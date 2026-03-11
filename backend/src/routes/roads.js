const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const Graph = require('graphology');
const { dijkstra } = require('graphology-shortest-path');

// ── Haversine: distance in km between two [lng, lat] coords ────
function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Total distance of a coordinate array in km
function polylineDistanceKm(coords) {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += haversineKm(coords[i], coords[i + 1]);
  }
  return total;
}

// ─────────────────────────────────────────────────────────────────
// GET /api/roads/nearby?lat=&lng=&radius=
// Returns all roads within <radius> meters (default 1000m)
// ─────────────────────────────────────────────────────────────────
router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }

    const result = await pool.query(
      `SELECT
         v.*,
         ST_AsGeoJSON(v.geom)::json AS geometry
       FROM v_road_safety v
       WHERE ST_DWithin(
         v.geom::geography,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         $3
       )`,
      [parseFloat(lng), parseFloat(lat), parseFloat(radius)]
    );

    const features = result.rows.map((row) => ({
      type: 'Feature',
      geometry: row.geometry,
      properties: {
        id: row.id,
        road_name: row.road_name,
        road_type: row.road_type,
        base_score: parseFloat(row.base_score),
        final_safety_score: parseFloat(row.final_safety_score),
        routing_cost: parseFloat(row.routing_cost),
        lighting: row.lighting,
        crowd_level: row.crowd_level,
        incidents_reported: row.incidents_reported,
        cctv_present: row.cctv_present,
        nearest_police_station: row.nearest_police_station,
        police_distance_meters: row.police_distance_meters
          ? parseFloat(row.police_distance_meters)
          : null,
        last_updated: row.last_updated,
      },
    }));

    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/roads/route?startLat=&startLng=&endLat=&endLng=
// Builds in-memory graph, runs Dijkstra using routing_cost
// ─────────────────────────────────────────────────────────────────
router.get('/route', async (req, res, next) => {
  console.log('🛣️  Route request received:', req.query);
  try {
    const { startLat, startLng, endLat, endLng } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res
        .status(400)
        .json({ error: 'startLat, startLng, endLat, and endLng are all required' });
    }

    if (startLat === endLat && startLng === endLng) {
      return res.json({ type: 'FeatureCollection', features: [] });
    }

    // Fetch all roads (network is small enough to load in memory)
    const result = await pool.query(
      `SELECT
         v.*,
         ST_AsGeoJSON(v.geom)::json AS geometry,
         ST_X(ST_StartPoint(v.geom))  AS start_lng,
         ST_Y(ST_StartPoint(v.geom))  AS start_lat,
         ST_X(ST_EndPoint(v.geom))    AS end_lng,
         ST_Y(ST_EndPoint(v.geom))    AS end_lat
       FROM v_road_safety v
       WHERE ST_DWithin(
         v.geom::geography,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         2000
       )`,
      [parseFloat(startLng), parseFloat(startLat)]
    );

    console.log(`🛣️  Found ${result.rows.length} roads near start point.`);

    // Build in-memory graph using graphology
    const graph = new Graph({ type: 'undirected', multi: true, allowSelfLoops: false });

    const roadMap = new Map(); // nodeKey → road data

    for (const road of result.rows) {
      if (!road.geometry || !road.geometry.coordinates) continue;

      const coords = road.geometry.coordinates;
      const weight = parseFloat(road.routing_cost) || 1;
      const segWeight = weight / Math.max(1, coords.length - 1);

      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];

        const node1 = `${parseFloat(p1[1]).toFixed(5)},${parseFloat(p1[0]).toFixed(5)}`;
        const node2 = `${parseFloat(p2[1]).toFixed(5)},${parseFloat(p2[0]).toFixed(5)}`;

        if (node1 === node2) continue;

        if (!graph.hasNode(node1)) graph.addNode(node1, { lat: parseFloat(p1[1]), lng: parseFloat(p1[0]) });
        if (!graph.hasNode(node2)) graph.addNode(node2, { lat: parseFloat(p2[1]), lng: parseFloat(p2[0]) });

        const edgeKey = `road_${road.id}_seg_${i}`;
        if (!graph.hasEdge(edgeKey)) {
          graph.addEdgeWithKey(edgeKey, node1, node2, {
            weight: segWeight,
            roadId: road.id,
          });
        }
      }
      roadMap.set(road.id, road);
    }

    // Find closest graph nodes to the start & end coordinates
    const findClosestNode = (lat, lng) => {
      let closest = null;
      let minDist = Infinity;
      graph.forEachNode((node, attrs) => {
        const d = Math.pow(attrs.lat - lat, 2) + Math.pow(attrs.lng - lng, 2);
        if (d < minDist) {
          minDist = d;
          closest = node;
        }
      });
      return closest;
    };

    const sourceNode = findClosestNode(parseFloat(startLat), parseFloat(startLng));
    const targetNode = findClosestNode(parseFloat(endLat), parseFloat(endLng));

    console.log(`🛣️  Source node: ${sourceNode}, Target node: ${targetNode}`);

    if (!sourceNode || !targetNode) {
      return res.status(404).json({ error: 'Could not map coordinates to road network' });
    }

    if (sourceNode === targetNode) {
      return res.json({ type: 'FeatureCollection', features: [] });
    }

    // Run Dijkstra
    let path;
    try {
      path = dijkstra.bidirectional(graph, sourceNode, targetNode, 'weight');
    } catch {
      return res.status(404).json({ error: 'No route found between the given points' });
    }

    if (!path || path.length < 2) {
      return res.status(404).json({ error: 'No route found between the given points' });
    }

    // Collect road IDs along the path
    const routeRoadIds = [];
    for (let i = 0; i < path.length - 1; i++) {
      const edges = graph.edges(path[i], path[i + 1]);
      for (const e of edges) {
        const roadId = graph.getEdgeAttribute(e, 'roadId');
        if (roadId && !routeRoadIds.includes(roadId)) {
          routeRoadIds.push(roadId);
        }
      }
    }

    // Build clipped routeLine from exact path nodes
    const routeLineCoords = path.map((node) => {
      const [lat, lng] = node.split(',').map(Number);
      return [lng, lat];
    });

    const features = routeRoadIds
      .map((id) => roadMap.get(id))
      .filter(Boolean)
      .map((road) => ({
        type: 'Feature',
        geometry: road.geometry,
        properties: {
          id: road.id,
          road_name: road.road_name,
          road_type: road.road_type,
          base_score: parseFloat(road.base_score),
          final_safety_score: parseFloat(road.final_safety_score),
          routing_cost: parseFloat(road.routing_cost),
          lighting: road.lighting,
          crowd_level: road.crowd_level,
          incidents_reported: road.incidents_reported,
          cctv_present: road.cctv_present,
          nearest_police_station: road.nearest_police_station,
          police_distance_meters: road.police_distance_meters
            ? parseFloat(road.police_distance_meters)
            : null,
          last_updated: road.last_updated,
        },
      }));

    res.json({
      type: 'FeatureCollection',
      features,
      routeLine: { type: 'LineString', coordinates: routeLineCoords },
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/roads/routes?startLat=&startLng=&endLat=&endLng=&maxRoutes=
// Returns multiple shortest-path alternatives (Yen's K-shortest paths)
// ─────────────────────────────────────────────────────────────────
router.get('/routes', async (req, res, next) => {
  console.log('🛣️  Multi-route request received:', req.query);
  try {
    const { startLat, startLng, endLat, endLng, maxRoutes = 5 } = req.query;
    const K = Math.min(parseInt(maxRoutes, 10) || 5, 10);

    if (!startLat || !startLng || !endLat || !endLng) {
      return res
        .status(400)
        .json({ error: 'startLat, startLng, endLat, and endLng are all required' });
    }

    if (startLat === endLat && startLng === endLng) {
      return res.json({ routes: [] });
    }

    // Fetch all roads within 2km of start (same as single-route)
    const result = await pool.query(
      `SELECT
         v.*,
         ST_AsGeoJSON(v.geom)::json AS geometry,
         ST_X(ST_StartPoint(v.geom))  AS start_lng,
         ST_Y(ST_StartPoint(v.geom))  AS start_lat,
         ST_X(ST_EndPoint(v.geom))    AS end_lng,
         ST_Y(ST_EndPoint(v.geom))    AS end_lat
       FROM v_road_safety v
       WHERE ST_DWithin(
         v.geom::geography,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         2000
       )`,
      [parseFloat(startLng), parseFloat(startLat)]
    );

    console.log(`🛣️  Found ${result.rows.length} roads near start point.`);

    // ── Build graph ──────────────────────────────────────────
    const graph = new Graph({ type: 'undirected', multi: true, allowSelfLoops: false });
    const roadMap = new Map();

    for (const road of result.rows) {
      if (!road.geometry || !road.geometry.coordinates) continue;
      const coords = road.geometry.coordinates;
      const weight = parseFloat(road.routing_cost) || 1;
      const segWeight = weight / Math.max(1, coords.length - 1);

      for (let i = 0; i < coords.length - 1; i++) {
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const node1 = `${parseFloat(p1[1]).toFixed(5)},${parseFloat(p1[0]).toFixed(5)}`;
        const node2 = `${parseFloat(p2[1]).toFixed(5)},${parseFloat(p2[0]).toFixed(5)}`;
        if (node1 === node2) continue;

        if (!graph.hasNode(node1)) graph.addNode(node1, { lat: parseFloat(p1[1]), lng: parseFloat(p1[0]) });
        if (!graph.hasNode(node2)) graph.addNode(node2, { lat: parseFloat(p2[1]), lng: parseFloat(p2[0]) });

        const edgeKey = `road_${road.id}_seg_${i}`;
        if (!graph.hasEdge(edgeKey)) {
          graph.addEdgeWithKey(edgeKey, node1, node2, {
            weight: segWeight,
            roadId: road.id,
          });
        }
      }
      roadMap.set(road.id, road);
    }

    // ── Find closest graph nodes ─────────────────────────────
    const findClosestNode = (lat, lng) => {
      let closest = null;
      let minDist = Infinity;
      graph.forEachNode((node, attrs) => {
        const d = Math.pow(attrs.lat - lat, 2) + Math.pow(attrs.lng - lng, 2);
        if (d < minDist) { minDist = d; closest = node; }
      });
      return closest;
    };

    const sourceNode = findClosestNode(parseFloat(startLat), parseFloat(startLng));
    const targetNode = findClosestNode(parseFloat(endLat), parseFloat(endLng));

    if (!sourceNode || !targetNode) {
      return res.status(404).json({ error: 'Could not map coordinates to road network' });
    }
    if (sourceNode === targetNode) {
      return res.json({ routes: [] });
    }

    // ── Yen's K-Shortest Paths ───────────────────────────────
    // Helper: run Dijkstra on a filtered graph (excluding certain edges/nodes)
    const runDijkstra = (excludedEdges, excludedNodes) => {
      const dist = new Map();
      const prev = new Map();
      const visited = new Set();

      // simple priority queue (array-based, fine for small graphs)
      const pq = [];
      const push = (node, d) => {
        pq.push({ node, d });
        pq.sort((a, b) => a.d - b.d);
      };

      dist.set(sourceNode, 0);
      push(sourceNode, 0);

      while (pq.length) {
        const { node: u } = pq.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        if (excludedNodes.has(u)) continue;
        if (u === targetNode) break;

        graph.forEachEdge(u, (edge, attrs, source, target) => {
          if (excludedEdges.has(edge)) return;
          const neighbor = source === u ? target : source;
          if (excludedNodes.has(neighbor) || visited.has(neighbor)) return;

          const alt = dist.get(u) + attrs.weight;
          if (alt < (dist.get(neighbor) ?? Infinity)) {
            dist.set(neighbor, alt);
            prev.set(neighbor, { node: u, edge });
            push(neighbor, alt);
          }
        });
      }

      if (!dist.has(targetNode)) return null;

      // Reconstruct path
      const path = [];
      let cur = targetNode;
      while (cur) {
        path.unshift(cur);
        const p = prev.get(cur);
        cur = p ? p.node : null;
      }
      return { path, cost: dist.get(targetNode) };
    };

    // First shortest path (standard Dijkstra)
    const firstResult = runDijkstra(new Set(), new Set());
    if (!firstResult) {
      return res.status(404).json({ error: 'No route found between the given points' });
    }

    const A = [firstResult]; // confirmed K-shortest paths
    const B = []; // candidate paths

    for (let k = 1; k < K; k++) {
      const prevPath = A[k - 1].path;

      for (let i = 0; i < prevPath.length - 1; i++) {
        const spurNode = prevPath[i];
        const rootPath = prevPath.slice(0, i + 1);

        // Edges to exclude: for each confirmed path that shares the same root, exclude the next edge
        const excludedEdges = new Set();
        const excludedNodes = new Set();

        for (const confirmedRoute of A) {
          const cp = confirmedRoute.path;
          if (cp.length > i && cp.slice(0, i + 1).join('|') === rootPath.join('|')) {
            // Exclude the edge from spurNode to the next node in this confirmed path
            if (i + 1 < cp.length) {
              const edges = graph.edges(cp[i], cp[i + 1]);
              for (const e of edges) excludedEdges.add(e);
            }
          }
        }

        // Exclude all nodes in rootPath except the spur node
        for (let j = 0; j < i; j++) {
          excludedNodes.add(rootPath[j]);
        }

        // Temporarily change source for the spur path
        const originalSource = sourceNode;
        // We need a modified Dijkstra from spurNode
        const spurDijkstra = (() => {
          const dist = new Map();
          const prev = new Map();
          const visited = new Set();
          const pq = [];
          const push = (node, d) => { pq.push({ node, d }); pq.sort((a, b) => a.d - b.d); };

          dist.set(spurNode, 0);
          push(spurNode, 0);

          while (pq.length) {
            const { node: u } = pq.shift();
            if (visited.has(u)) continue;
            visited.add(u);
            if (excludedNodes.has(u) && u !== spurNode) continue;
            if (u === targetNode) break;

            graph.forEachEdge(u, (edge, attrs, source, target) => {
              if (excludedEdges.has(edge)) return;
              const neighbor = source === u ? target : source;
              if (excludedNodes.has(neighbor) || visited.has(neighbor)) return;

              const alt = dist.get(u) + attrs.weight;
              if (alt < (dist.get(neighbor) ?? Infinity)) {
                dist.set(neighbor, alt);
                prev.set(neighbor, { node: u, edge });
                push(neighbor, alt);
              }
            });
          }

          if (!dist.has(targetNode)) return null;

          const path = [];
          let cur = targetNode;
          while (cur) {
            path.unshift(cur);
            const p = prev.get(cur);
            cur = p ? p.node : null;
          }
          return { path, cost: dist.get(targetNode) };
        })();

        if (!spurDijkstra) continue;

        // Calculate root path cost
        let rootCost = 0;
        for (let r = 0; r < rootPath.length - 1; r++) {
          const edges = graph.edges(rootPath[r], rootPath[r + 1]);
          if (edges.length) rootCost += graph.getEdgeAttribute(edges[0], 'weight');
        }

        const totalPath = [...rootPath.slice(0, -1), ...spurDijkstra.path];
        const totalCost = rootCost + spurDijkstra.cost;

        // Deduplicate: skip if this path already exists
        const pathKey = totalPath.join('|');
        const exists = A.some((r) => r.path.join('|') === pathKey) ||
                       B.some((r) => r.path.join('|') === pathKey);
        if (!exists) {
          B.push({ path: totalPath, cost: totalCost });
        }
      }

      if (!B.length) break;

      // Pick the lowest-cost candidate
      B.sort((a, b) => a.cost - b.cost);
      A.push(B.shift());
    }

    console.log(`🛣️  Found ${A.length} alternative routes (before dedup).`);

    // ── Build response for each route ────────────────────────
    const buildRouteResponse = (routeResult, routeIndex) => {
      const routeRoadIds = [];
      for (let i = 0; i < routeResult.path.length - 1; i++) {
        const edges = graph.edges(routeResult.path[i], routeResult.path[i + 1]);
        for (const e of edges) {
          const roadId = graph.getEdgeAttribute(e, 'roadId');
          if (roadId && !routeRoadIds.includes(roadId)) {
            routeRoadIds.push(roadId);
          }
        }
      }

      // Build clipped routeLine from exact path nodes ("lat,lng" strings → [lng, lat])
      const routeLineCoords = routeResult.path.map((node) => {
        const [lat, lng] = node.split(',').map(Number);
        return [lng, lat];
      });

      const features = routeRoadIds
        .map((id) => roadMap.get(id))
        .filter(Boolean)
        .map((road) => ({
          type: 'Feature',
          geometry: road.geometry,
          properties: {
            id: road.id,
            road_name: road.road_name,
            road_type: road.road_type,
            base_score: parseFloat(road.base_score),
            final_safety_score: parseFloat(road.final_safety_score),
            routing_cost: parseFloat(road.routing_cost),
            lighting: road.lighting,
            crowd_level: road.crowd_level,
            incidents_reported: road.incidents_reported,
            cctv_present: road.cctv_present,
            nearest_police_station: road.nearest_police_station,
            police_distance_meters: road.police_distance_meters
              ? parseFloat(road.police_distance_meters)
              : null,
            last_updated: road.last_updated,
          },
        }));

      const scores = features
        .map((f) => f.properties.final_safety_score)
        .filter((s) => typeof s === 'number');
      const avgSafetyScore = scores.length
        ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
        : null;

      // Collect the set of road IDs for deduplication
      const roadIdSet = new Set(routeRoadIds);

      return {
        features,
        routeLine: {
          type: 'LineString',
          coordinates: routeLineCoords,
        },
        roadIdSet,
        metadata: {
          routeIndex,
          totalCost: parseFloat(routeResult.cost.toFixed(2)),
          totalDistanceKm: parseFloat(polylineDistanceKm(routeLineCoords).toFixed(2)),
          avgSafetyScore,
          segmentCount: features.length,
          isSafest: false,
          isShortest: false,
        },
      };
    };

    const allBuilt = A.map((r, i) => buildRouteResponse(r, i));

    // ── Tag shortest (by distance) and safest (by avg safety) ──
    let shortestIdx = 0;
    let safestIdx = 0;
    let shortestDist = Infinity;
    let highestScore = -Infinity;
    allBuilt.forEach((r, i) => {
      if (r.metadata.totalDistanceKm < shortestDist) {
        shortestDist = r.metadata.totalDistanceKm;
        shortestIdx = i;
      }
      if (r.metadata.avgSafetyScore !== null && r.metadata.avgSafetyScore > highestScore) {
        highestScore = r.metadata.avgSafetyScore;
        safestIdx = i;
      }
    });
    allBuilt[shortestIdx].metadata.isShortest = true;
    allBuilt[safestIdx].metadata.isSafest = true;

    // ── Deduplicate: remove routes with >70% road overlap ────
    // Jaccard similarity = |intersection| / |union|
    const jaccardSimilarity = (setA, setB) => {
      let intersection = 0;
      for (const id of setA) { if (setB.has(id)) intersection++; }
      const union = setA.size + setB.size - intersection;
      return union === 0 ? 1 : intersection / union;
    };

    const SIMILARITY_THRESHOLD = 0.7;
    const kept = new Set(); // indices to keep
    // Always keep shortest and safest
    kept.add(shortestIdx);
    kept.add(safestIdx);

    for (let i = 0; i < allBuilt.length; i++) {
      if (kept.has(i)) continue; // already guaranteed

      let isDuplicate = false;
      for (const k of kept) {
        if (jaccardSimilarity(allBuilt[i].roadIdSet, allBuilt[k].roadIdSet) > SIMILARITY_THRESHOLD) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        kept.add(i);
      }
    }

    // Build final array, re-index, strip internal roadIdSet
    const routes = [...kept]
      .sort((a, b) => a - b)
      .map((origIdx, newIdx) => {
        const r = allBuilt[origIdx];
        delete r.roadIdSet;
        r.metadata.routeIndex = newIdx;
        return r;
      });

    console.log(`🛣️  Found ${A.length} → kept ${routes.length} distinct route(s).`);

    res.json({ routes });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/roads/:id
// Returns single road with full safety breakdown
// ─────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         v.*,
         ST_AsGeoJSON(v.geom)::json AS geometry
       FROM v_road_safety v
       WHERE v.id = $1`,
      [parseInt(id, 10)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Road with id ${id} not found` });
    }

    const road = result.rows[0];
    res.json({
      type: 'Feature',
      geometry: road.geometry,
      properties: {
        id: road.id,
        road_name: road.road_name,
        road_type: road.road_type,
        base_score: parseFloat(road.base_score),
        final_safety_score: parseFloat(road.final_safety_score),
        routing_cost: parseFloat(road.routing_cost),
        lighting: road.lighting,
        crowd_level: road.crowd_level,
        incidents_reported: road.incidents_reported,
        cctv_present: road.cctv_present,
        nearest_police_station: road.nearest_police_station,
        police_distance_meters: road.police_distance_meters
          ? parseFloat(road.police_distance_meters)
          : null,
        last_updated: road.last_updated,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────
// POST /api/roads/:id/report
// Body: { description: string }
// ─────────────────────────────────────────────────────────────────
router.post('/:id/report', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'description is required in the request body' });
    }

    // Check road exists
    const roadCheck = await pool.query('SELECT id FROM road_segments WHERE id = $1', [
      parseInt(id, 10),
    ]);
    if (roadCheck.rows.length === 0) {
      return res.status(404).json({ error: `Road with id ${id} not found` });
    }

    // Insert incident report (trigger auto-updates incidents_reported)
    await pool.query(
      `INSERT INTO incident_reports (road_id, description)
       VALUES ($1, $2)`,
      [parseInt(id, 10), description]
    );

    // Return updated road safety info
    const result = await pool.query(
      `SELECT
         v.*,
         ST_AsGeoJSON(v.geom)::json AS geometry
       FROM v_road_safety v
       WHERE v.id = $1`,
      [parseInt(id, 10)]
    );

    const road = result.rows[0];
    res.status(201).json({
      message: 'Incident reported successfully',
      road: {
        type: 'Feature',
        geometry: road.geometry,
        properties: {
          id: road.id,
          road_name: road.road_name,
          road_type: road.road_type,
          base_score: parseFloat(road.base_score),
          final_safety_score: parseFloat(road.final_safety_score),
          routing_cost: parseFloat(road.routing_cost),
          lighting: road.lighting,
          crowd_level: road.crowd_level,
          incidents_reported: road.incidents_reported,
          cctv_present: road.cctv_present,
          nearest_police_station: road.nearest_police_station,
          police_distance_meters: road.police_distance_meters
            ? parseFloat(road.police_distance_meters)
            : null,
          last_updated: road.last_updated,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

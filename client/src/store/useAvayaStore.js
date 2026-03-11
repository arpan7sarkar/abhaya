import { create } from 'zustand';

const EMPTY_FEATURES = [];

export const useAvayaStore = create((set, get) => ({
  // Location
  userLocation: null, // { lat, lng }
  destination: null, // { lat, lng, name }
  locationMode: 'live', // 'live' | 'manual'

  // Map Data
  nearbyRoads: [], // GeoJSON features array

  // Multi-route state
  allRoutes: [], // Array of { features, metadata }
  selectedRouteIndex: 0,
  routeViewMode: 'select', // 'select' | 'detail'

  // UI
  isLoading: false,
  locationReady: false,
  error: null,

  // SOS
  sosResult: null,
  sosModalOpen: false,

  // Report
  reportRoadId: null,
  reportModalOpen: false,

  // Actions
  setUserLocation: (loc) => set({ userLocation: loc }),
  setDestination: (dest) => set({ destination: dest }),
  setLocationMode: (mode) => set({ locationMode: mode }),
  setManualLocation: (loc) => set({ userLocation: loc, locationReady: true, locationMode: 'manual' }),
  setNearbyRoads: (roads) => set({ nearbyRoads: roads }),

  // Multi-route actions
  setAllRoutes: (routes) => set({
    allRoutes: routes,
    selectedRouteIndex: 0,
    routeViewMode: routes.length > 1 ? 'select' : 'detail',
  }),
  selectRoute: (index) => set({ selectedRouteIndex: index }),
  showSafestRoute: () => {
    const { allRoutes } = get();
    const safestIdx = allRoutes.findIndex((r) => r.metadata?.isSafest);
    if (safestIdx >= 0) {
      set({ selectedRouteIndex: safestIdx, routeViewMode: 'detail' });
    }
  },
  setRouteViewMode: (mode) => set({ routeViewMode: mode }),

  // Legacy compat — setActiveRoute wraps into allRoutes format
  setActiveRoute: (features) => set({
    allRoutes: features.length
      ? [{ features, metadata: { routeIndex: 0, avgSafetyScore: null, segmentCount: features.length, totalCost: 0, isSafest: true } }]
      : [],
    selectedRouteIndex: 0,
    routeViewMode: 'detail',
  }),

  setLoading: (bool) => set({ isLoading: bool }),
  setLocationReady: (bool) => set({ locationReady: bool }),
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),
  clearRoute: () => set({ allRoutes: [], selectedRouteIndex: 0, routeViewMode: 'select', destination: null }),

  setSosResult: (data) => set({ sosResult: data }),
  setSosModalOpen: (bool) => set({ sosModalOpen: bool }),

  setReportRoadId: (id) => set({ reportRoadId: id, reportModalOpen: true }),
  closeReportModal: () => set({ reportRoadId: null, reportModalOpen: false }),
}));

// Helper to get active route features — use INSIDE component body, not as a Zustand selector
export const getActiveFeatures = (allRoutes, selectedRouteIndex) => {
  const route = allRoutes[selectedRouteIndex];
  return route ? route.features : EMPTY_FEATURES;
};

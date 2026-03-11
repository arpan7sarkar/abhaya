import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { getMultipleRoutes } from '../../services/api';
import { useAvayaStore } from '../../store/useAvayaStore';
import { useToastStore } from '../../store/useToastStore';

export default function SearchBar() {
  const userLocation = useAvayaStore((s) => s.userLocation);
  const setAllRoutes = useAvayaStore((s) => s.setAllRoutes);
  const setDestination = useAvayaStore((s) => s.setDestination);
  const destination = useAvayaStore((s) => s.destination);
  const clearRoute = useAvayaStore((s) => s.clearRoute);
  const addToast = useToastStore((s) => s.addToast);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch suggestions from Nominatim (debounced)
  const fetchSuggestions = useCallback(async (text) => {
    if (!text || text.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSuggestLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  // Debounce input changes
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Select a suggestion → set destination + fetch routes
  const handleSelectSuggestion = async (item) => {
    const destLat = parseFloat(item.lat);
    const destLng = parseFloat(item.lon);
    const name = item.display_name;

    setQuery(name.split(',').slice(0, 2).join(','));
    setSuggestions([]);
    setShowSuggestions(false);

    if (!userLocation) return;

    setLoading(true);
    setError('');
    try {
      const routeData = await getMultipleRoutes(
        userLocation.lat, userLocation.lng, destLat, destLng
      );
      setAllRoutes(routeData?.routes ?? []);
      setDestination({ lat: destLat, lng: destLng, name });
      if (routeData?.routes?.length > 1) {
        addToast(`${routeData.routes.length} routes found! Pick one or show the safest.`, 'info');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!query.trim() || loading || !userLocation) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();

      if (!data.length) {
        setError('Location not found. Try a more specific name.');
        return;
      }

      const { lat, lon: lng, display_name } = data[0];
      const destLat = parseFloat(lat);
      const destLng = parseFloat(lng);

      const routeData = await getMultipleRoutes(
        userLocation.lat,
        userLocation.lng,
        destLat,
        destLng
      );

      setAllRoutes(routeData?.routes ?? []);
      setDestination({ lat: destLat, lng: destLng, name: display_name });

      if (routeData?.routes?.length > 1) {
        addToast(`${routeData.routes.length} routes found! Pick one or show the safest.`, 'info');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Drop a draggable destination pin near the user's location (offset slightly so it's visible)
  const handleDropPin = async () => {
    if (!userLocation) return;

    const destLat = userLocation.lat + 0.003;
    const destLng = userLocation.lng + 0.003;

    setDestination({ lat: destLat, lng: destLng, name: `📍 ${destLat.toFixed(5)}, ${destLng.toFixed(5)}` });
    addToast('Destination pin dropped — drag it to your destination', 'info');

    // Auto-compute initial routes
    try {
      const routeData = await getMultipleRoutes(userLocation.lat, userLocation.lng, destLat, destLng);
      setAllRoutes(routeData?.routes ?? []);
    } catch {
      // Route will update when user drags the pin
    }
  };

  const handleClear = () => {
    setQuery('');
    setError('');
    setSuggestions([]);
    setShowSuggestions(false);
    clearRoute();
  };

  // Shorten display name for suggestion items
  const shortenName = (name) => {
    const parts = name.split(',').map((p) => p.trim());
    return parts.slice(0, 3).join(', ');
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '90%',
        maxWidth: '440px',
      }}
    >
      <form onSubmit={handleSearch}>
        <div
          className="panel-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            borderRadius: '14px',
          }}
        >
          {loading ? (
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #e8e6e0',
                borderTopColor: '#e8a020',
                borderRadius: '50%',
                animation: 'spin-shield 0.7s linear infinite',
                flexShrink: 0,
              }}
            />
          ) : (
            <Search size={16} color="#6b6b6b" style={{ flexShrink: 0 }} />
          )}

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Where do you want to go?"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#141414',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
            aria-label="Search destination"
            autoComplete="off"
          />

          {(query || destination) && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear"
              style={{
                background: '#f7f6f2',
                border: 'none',
                borderRadius: '6px',
                color: '#6b6b6b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          )}

          {/* Drop Pin button */}
          <button
            type="button"
            onClick={handleDropPin}
            aria-label="Drop destination pin on map"
            title="Drop a pin on the map"
            style={{
              background: destination ? 'rgba(239,68,68,0.15)' : '#f7f6f2',
              border: destination ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
              borderRadius: '8px',
              color: destination ? '#ef4444' : '#6b6b6b',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            <MapPin size={16} strokeWidth={2.2} />
          </button>

          <button
            type="submit"
            disabled={loading}
            aria-label="Search destination"
            style={{
              background: '#141414',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            <Search size={18} strokeWidth={2.5} color="#ffffff" />
          </button>
        </div>
      </form>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="panel-card"
          style={{
            marginTop: '6px',
            borderRadius: '12px',
            padding: '4px 0',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((item, idx) => (
            <button
              key={item.place_id || idx}
              type="button"
              onClick={() => handleSelectSuggestion(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #e8e6e0' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f6f2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <MapPin size={14} color="#e8a020" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#141414',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '350px',
                  }}
                >
                  {shortenName(item.display_name)}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#6b6b6b',
                    marginTop: '1px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '350px',
                  }}
                >
                  {item.type?.replace(/_/g, ' ')}
                  {item.address?.state ? ` · ${item.address.state}` : ''}
                </p>
              </div>
            </button>
          ))}
          {suggestLoading && (
            <p style={{ fontSize: '11px', color: '#6b6b6b', textAlign: 'center', padding: '6px' }}>
              Searching…
            </p>
          )}
        </div>
      )}

      {error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: '#ef4444',
            textAlign: 'center',
            background: 'rgba(239,68,68,0.1)',
            borderRadius: '8px',
            padding: '6px 10px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}


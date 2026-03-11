import { useState } from 'react';
import { Shield } from 'lucide-react';
import { getNearestPolice, sendSOSAlert } from '../../services/api';
import { useAvayaStore } from '../../store/useAvayaStore';
import { useUser } from '@clerk/react';

export default function SOSButton() {
  const userLocation = useAvayaStore((s) => s.userLocation);
  const setSosResult = useAvayaStore((s) => s.setSosResult);
  const setSosModalOpen = useAvayaStore((s) => s.setSosModalOpen);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleSOS = async () => {
    if (loading || !userLocation) return;
    setLoading(true);
    try {
      const result = await getNearestPolice(userLocation.lat, userLocation.lng);
      setSosResult(result);
      setSosModalOpen(true);

      // Post SOS to community feed
      if (user) {
        sendSOSAlert({
          clerkUserId: user.id,
          authorName: user.fullName || user.firstName || 'A User',
          authorAvatar: user.imageUrl || null,
          lat: userLocation.lat,
          lng: userLocation.lng,
          address: `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`,
        }).catch((e) => console.error('SOS alert post failed:', e.message));
      }
    } catch {
      setSosResult({
        name: 'Local Police Station',
        phone: '100',
        address: 'Call emergency services',
        distance_meters: null,
      });
      setSosModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSOS}
      disabled={loading}
      aria-label="Emergency SOS"
      className="map-sos-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        zIndex: 1000,
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#dc2626',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(220,38,38,0.5)',
      }}
    >
      {!loading && (
        <>
          <div
            className="animate-pulse-ring"
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px solid rgba(220,38,38,0.5)',
            }}
          />
          <div
            className="animate-pulse-ring"
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px solid rgba(220,38,38,0.3)',
              animationDelay: '0.7s',
            }}
          />
        </>
      )}

      {loading ? (
        <div
          style={{
            width: '24px',
            height: '24px',
            border: '2.5px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin-shield 0.7s linear infinite',
          }}
        />
      ) : (
        <Shield size={28} color="#fff" strokeWidth={2} />
      )}
    </button>
  );
}

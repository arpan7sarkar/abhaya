import { useEffect, useRef } from 'react';
import { useAvayaStore } from '../store/useAvayaStore';
import { useToastStore } from '../store/useToastStore';
import LoadingScreen from '../components/UI/LoadingScreen';
import AppShell from '../components/Layout/AppShell';
import AvayaMap from '../components/Map/AvayaMap';
import ErrorBoundary from '../components/UI/ErrorBoundary';

export default function MapPage() {
  const locationReady = useAvayaStore((s) => s.locationReady);
  const addToast = useToastStore((s) => s.addToast);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasShownToast.current) {
      addToast(
        "If your live location is not near Barasat, manually update location near Barasat to test this feature. Since our database is limited to Barasat region, we will update it to your location soon.",
        "warning",
        10000
      );
      hasShownToast.current = true;
    }
  }, [addToast]);

  return (
    <>
      {!locationReady && <LoadingScreen />}
      <AppShell>
        <ErrorBoundary>
          <AvayaMap />
        </ErrorBoundary>
      </AppShell>
    </>
  );
}

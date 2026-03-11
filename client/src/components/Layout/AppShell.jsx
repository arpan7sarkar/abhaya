import HeaderBadge from '../UI/HeaderBadge';
import SearchBar from '../UI/SearchBar';
import SafetyLegend from '../UI/SafetyLegend';
import SOSButton from '../UI/SOSButton';
import SOSModal from '../UI/SOSModal';
import RouteSelectorPanel from '../UI/RouteSelectorPanel';
import ReportModal from '../UI/ReportModal';
import ErrorBanner from '../UI/ErrorBanner';
import UserProfileMenu from '../UI/UserProfileMenu';
import LocationModeToggle from '../UI/LocationModeToggle';

export default function AppShell({ children }) {
  return (
    <div className="app-shell" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {children}

      <ErrorBanner />
      <UserProfileMenu />
      <HeaderBadge />
      <LocationModeToggle />
      <SearchBar />
      <SafetyLegend />
      <SOSButton />
      <RouteSelectorPanel />

      <SOSModal />
      <ReportModal />
    </div>
  );
}


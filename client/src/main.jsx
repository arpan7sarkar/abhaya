import 'leaflet/dist/leaflet.css';
import './index.css';

import L from 'leaflet';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Fix Leaflet default marker icon path (Vite asset handling)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

import { ClerkProvider } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
        },
        variables: {
          colorPrimary: '#c8860a',
          colorBackground: '#fafaf8',
          colorInputBackground: '#f5f3ee',
          colorInputText: '#0f0f0d',
          colorText: '#0f0f0d',
          colorTextSecondary: '#7a7a72',
          colorShimmer: 'rgba(200,134,10,0.1)',
          colorDanger: '#ef4444',
          colorSuccess: '#22c55e',
          colorWarning: '#c8860a',
          borderRadius: '16px',
        },
        elements: {
          card: "shadow-md border border-[#ede9e0] rounded-2xl",
          rootBox: "w-full !max-w-full",
          userButtonAvatarBox: "w-9 h-9 border border-[#ede9e0]",
          userButtonPopoverCard: "!bg-[#fafaf8] !border !border-[#ede9e0] !shadow-lg !rounded-2xl",
          userButtonPopoverActionButton: "hover:!bg-[#f5f3ee]",
          userButtonPopoverActionButtonText: "!text-[#0f0f0d]",
          userButtonPopoverActionButtonIcon: "!text-[#7a7a72]",
          userButtonPopoverFooter: "hidden",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          formHeader: "hidden",
          socialButtonsBlockButton: "!bg-[#f5f3ee] !border !border-[#ede9e0] hover:!bg-[#ede9e0] !text-[#0f0f0d] !rounded-xl !transition-all !duration-300 py-3",
          socialButtonsBlockButtonText: "!text-[#0f0f0d] !font-medium !text-[15px]",
          dividerLine: "!bg-[#ede9e0]",
          dividerText: "!text-[#7a7a72]",
          formFieldLabel: "!text-[#0f0f0d] !font-medium !mb-1.5",
          formFieldInput: "!bg-[#f5f3ee] !border !border-[#ede9e0] !text-[#0f0f0d] !rounded-xl focus:!border-[#c8860a] focus:!ring-1 focus:!ring-[#c8860a] !transition-all !duration-300 !py-2.5",
          formButtonPrimary: "!bg-[#0f0f0d] hover:!bg-[#2a2a28] !text-white !font-bold !py-3 !w-full !rounded-xl !transition-all !duration-300 !shadow-[0_4px_12px_rgba(0,0,0,0.1)] !mt-2",
          footerActionLink: "!text-[#c8860a] hover:!text-[#a06e08] !font-semibold !transition-colors text-base",
          footerActionText: "!text-[#7a7a72] text-base",
          identityPreviewText: "!text-[#0f0f0d]",
          identityPreviewEditButtonIcon: "!text-[#c8860a]",
          otpCodeFieldInput: "!bg-[#f5f3ee] !border !border-[#ede9e0] !text-[#0f0f0d] !rounded-xl focus:!border-[#c8860a]",
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);

import { Phone, Lightbulb, MapPin, Shield, AlertTriangle, Eye, Users, BellRing } from 'lucide-react';

const emergencyNumbers = [
  { label: 'Police', number: '100', color: '#ef4444' },
  { label: 'Women Helpline', number: '1091', color: '#e8a020' },
  { label: 'Child Helpline', number: '1098', color: '#60a5fa' },
  { label: 'Ambulance', number: '102', color: '#22c55e' },
];

const tips = [
  {
    icon: MapPin,
    title: 'Plan your route',
    text: 'Check the map before you leave. Choose well-lit, busy streets. Avoid isolated shortcuts.',
    accent: 'var(--gold)',
    bg: 'var(--gold-light)',
  },
  {
    icon: Lightbulb,
    title: 'Stay visible',
    text: 'Stick to areas with good lighting and foot traffic. Trust your instincts — if a place feels wrong, leave.',
    accent: '#f59e0b',
    bg: '#fff8e8',
  },
  {
    icon: Shield,
    title: 'Use the SOS button',
    text: 'Keep the Avaya map open when walking alone. The SOS button gives you instant access to the nearest police station.',
    accent: 'var(--green)',
    bg: '#ecfdf5',
  },
  {
    icon: AlertTriangle,
    title: 'Report unsafe areas',
    text: 'If you notice poor lighting, harassment, or other issues, report them in the app so others stay informed.',
    accent: 'var(--red)',
    bg: '#fef2f2',
  },
  {
    icon: Eye,
    title: 'Stay aware of surroundings',
    text: 'Avoid using headphones in both ears. Keep your phone accessible but not distracting. Look around regularly.',
    accent: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    icon: Users,
    title: 'Travel in groups',
    text: 'Whenever possible, walk with friends or colleagues. There is always safety in numbers, especially at night.',
    accent: '#60a5fa',
    bg: '#eff6ff',
  },
  {
    icon: BellRing,
    title: 'Share your live location',
    text: 'Use Avaya\'s live location sharing with trusted contacts so someone always knows where you are.',
    accent: '#ec4899',
    bg: '#fdf2f8',
  },
];

export default function SafetyTipsPage() {
  return (
    <div className="font-outfit animate-fade-in" style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>

      {/* ── HERO BANNER ── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--ink) 0%, #1a1a18 100%)',
        padding: '80px 40px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(200,134,10,0.15)', top: '-80px', left: '-60px' }}></div>
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(200,134,10,0.1)', bottom: '-40px', right: '-40px' }}></div>

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(200,134,10,0.2)',
            color: 'var(--gold)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            🛡 Your Safety Matters
          </div>
          <h1 className="font-garamond" style={{
            fontSize: '52px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}>
            Safety Tips &amp; <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Emergency</em> Info
          </h1>
          <p style={{
            fontSize: '17px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            Important information and emergency contacts to help you stay safe while navigating the city.
          </p>
        </div>
      </section>

      {/* ── EMERGENCY NUMBERS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Phone size={14} />
            Emergency Contacts
          </div>
          <h2 className="font-garamond" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--ink)' }}>
            Dial for <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Immediate</em> Help
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {emergencyNumbers.map(({ label, number, color }) => (
            <a
              key={label}
              href={`tel:${number}`}
              className="hover-lift"
              style={{
                textDecoration: 'none',
                padding: '28px 24px',
                background: 'var(--white)',
                border: '1.5px solid var(--border)',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: color,
              }} />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: `${color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Phone size={20} color={color} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500, display: 'block', marginBottom: '4px' }}>{label}</span>
                <span style={{ fontSize: '32px', fontWeight: 800, color: color, fontFamily: "'Cormorant Garamond', serif" }}>{number}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SAFETY GUIDELINES ── */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Shield size={14} />
              Safety Guidelines
            </div>
            <h2 className="font-garamond" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--ink)' }}>
              Stay <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Safe,</em> Stay Alert
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {tips.map(({ icon: Icon, title, text, accent, bg }, idx) => (
              <div
                key={title}
                className="hover-lift"
                style={{
                  padding: '32px',
                  background: 'var(--white)',
                  border: '1.5px solid var(--border)',
                  borderRadius: '24px',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: accent,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                }} className="accent-bar" />

                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <Icon size={26} color={accent} />
                </div>

                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  Tip #{idx + 1}
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px', color: 'var(--ink)' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a8f5a, #0f7048)',
          borderRadius: '32px',
          padding: '56px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', top: '-80px', right: '-80px' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="font-garamond" style={{ fontSize: '36px', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
              Stay Protected with Avaya
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px' }}>
              Open the live map to see real-time safety scores and navigate with confidence.
            </p>
            <a
              href="/map"
              className="btn-primary-landing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                background: 'white',
                color: '#0f7048',
                fontWeight: 600,
                fontSize: '15px',
                borderRadius: '30px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              🗺 Open Live Map
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

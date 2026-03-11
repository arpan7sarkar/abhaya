import { useEffect } from 'react';
import { Mail, Send, MapPin, Clock, MessageSquare, Phone, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import { useToastStore } from '../store/useToastStore';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'thecodersclan.04@gmail.com',
    sub: 'We reply within 24 hours',
    color: '#e8a020',
    bg: '#fff4e0',
  },
  {
    icon: MapPin,
    title: 'Location',
    detail: 'Kolkata, India',
    sub: 'West Bengal',
    color: '#60a5fa',
    bg: '#eff6ff',
  },
  {
    icon: Clock,
    title: 'Response Time',
    detail: '24–48 hours',
    sub: 'Typically faster',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
];

export default function ContactPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [state, handleSubmit] = useForm(
    import.meta.env.VITE_FORMSPREE_FORM_ID || 'xreyqgoe'
  );

  useEffect(() => {
    if (state.succeeded) {
      addToast("Thank you! We'll get back to you soon.", 'success');
    }
    if (state.errors?.length > 0) {
      addToast('Something went wrong. Please try again.', 'error');
    }
  }, [state.succeeded, state.errors, addToast]);

  const isSubmitting = state.submitting;

  /* ── Success Screen ── */
  if (state.succeeded) {
    return (
      <div
        className="font-outfit animate-fade-in flex flex-col items-center justify-center min-h-[70vh] px-6 text-center"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="font-garamond text-5xl font-bold mb-4">Message Received!</h2>
        <p className="text-muted max-w-md mb-10 leading-relaxed text-lg">
          Thank you for reaching out. Our team will get back to you within 24–48 hours.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-[#111110] text-white rounded-2xl font-bold text-[16px] hover:-translate-y-1 hover:shadow-xl transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  /* ── Main Page ── */
  return (
    <div
      className="font-outfit animate-fade-in"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}
    >
      {/* ══ HERO BANNER ══ */}
      <section
        className="relative overflow-hidden text-center text-white contact-hero-section"
        style={{
          backgroundColor: '#111110',
          paddingTop: '7rem',
          paddingBottom: '7rem',
        }}
      >
        {/* Decorative circles */}
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '1px solid rgba(200,155,60,0.12)',
            top: '-100px',
            right: '-100px',
          }}
        />
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1px solid rgba(200,155,60,0.07)',
            bottom: '-60px',
            left: '-60px',
          }}
        />

        <div
          className="relative flex flex-col items-center"
          style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem', zIndex: 10 }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 font-bold uppercase"
            style={{
              background: 'rgba(97,69,13,0.38)',
              color: '#CCA543',
              padding: '0.45rem 1.1rem',
              borderRadius: '999px',
              fontSize: '12px',
              letterSpacing: '0.18em',
              marginBottom: '1.75rem',
            }}
          >
            <MessageSquare size={14} fill="currentColor" style={{ opacity: 0.9 }} />
            Get in Touch
          </div>

          {/* Headline */}
          <h1
            className="font-garamond font-semibold leading-tight"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Contact{' '}
            <em className="font-serif italic" style={{ color: '#C89B3C' }}>
              Us
            </em>
          </h1>

          {/* Subline */}
          <p
            className="font-light"
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              maxWidth: '460px',
            }}
          >
            Have feedback, a question, or want to report an issue? We&apos;d love to hear
            from you.
          </p>
        </div>
      </section>

      {/* ══ CONTACT CARDS — pulled up to straddle the banner ══ */}
      <div style={{ position: 'relative', zIndex: 20, marginTop: '-56px' }}>
        <div
          className="contact-info-grid"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
        >
          {contactInfo.map(({ icon: Icon, title, detail, sub, color, bg }) => (
            <div
              key={title}
              className="hover-lift flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 10px 36px rgba(0,0,0,0.07)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                width: '100%',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: bg,
                  marginBottom: '1.25rem',
                }}
              >
                <Icon size={22} color={color} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                {title}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  letterSpacing: '-0.02em',
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {detail}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', opacity: 0.75 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FORM SECTION ══ */}
      <section
        className="contact-form-section"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem 6rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '1050px',
            alignItems: 'flex-start',
          }}
          className="flex-col lg:flex-row gap-12 lg:gap-20"
        >
          {/* ── Left: Heading + Emergency ── */}
          <div style={{ flex: '0 0 auto', width: '380px', maxWidth: '100%' }} className="w-full lg:w-auto">
            <div
              className="inline-flex items-center gap-2 font-bold uppercase"
              style={{
                color: '#C89B3C',
                fontSize: '12px',
                letterSpacing: '0.18em',
                marginBottom: '1.25rem',
              }}
            >
              <Mail size={13} strokeWidth={2.5} />
              Send a Message
            </div>

            <h2
              className="font-garamond font-semibold"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1.5rem',
                color: 'var(--ink)',
              }}
            >
              We&apos;re here to{' '}
              <em className="font-serif italic" style={{ color: '#C89B3C' }}>
                help
              </em>
            </h2>

            <p
              className="font-light"
              style={{
                color: 'var(--muted)',
                fontSize: '15px',
                lineHeight: 1.75,
                marginBottom: '2.5rem',
              }}
            >
              Whether you have a question about safety features, need help with your account,
              or want to report an unsafe area — our team is ready to assist.
            </p>

            {/* Emergency box */}
            <div
              style={{
                background: 'rgba(240,236,225,0.5)',
                border: '1px solid #e8dfc8',
                borderRadius: '20px',
                padding: '1.5rem',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}
              >
                <span>⚠️</span> For emergencies
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                If you&apos;re in immediate danger, do NOT use this form.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:100"
                  className="inline-flex items-center justify-center gap-2 font-bold no-underline hover:brightness-110 transition-all"
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '999px',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                  }}
                >
                  <Phone size={13} fill="currentColor" /> Call 100
                </a>
                <a
                  href="tel:1091"
                  className="inline-flex items-center justify-center gap-2 font-bold no-underline hover:brightness-110 transition-all"
                  style={{
                    background: '#C89B3C',
                    color: '#fff',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '999px',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(200,155,60,0.3)',
                  }}
                >
                  <Phone size={13} fill="currentColor" /> Call 1091
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{ flex: '1 1 0', minWidth: 0 }} className="w-full">
            <div
              className="contact-form-card"
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '32px',
                padding: '2.5rem',
                boxShadow: '0 8px 40px rgba(0,0,0,0.04)',
              }}
            >
              <form
                action="https://formspree.io/f/xreyqgoe"
                method="POST"
                onSubmit={handleSubmit}
              >
                {/* Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.9rem 1.25rem',
                      background: '#f8f6f0',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      color: 'var(--ink)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C89B3C';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0,0,0,0.06)';
                      e.target.style.background = '#f8f6f0';
                    }}
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                    style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.9rem 1.25rem',
                      background: '#f8f6f0',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      color: 'var(--ink)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C89B3C';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0,0,0,0.06)';
                      e.target.style.background = '#f8f6f0';
                    }}
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '2rem' }}>
                  <label
                    htmlFor="message"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      marginBottom: '8px',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us what's on your mind..."
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.9rem 1.25rem',
                      background: '#f8f6f0',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '14px',
                      fontSize: '15px',
                      color: 'var(--ink)',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, background 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#C89B3C';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0,0,0,0.06)';
                      e.target.style.background = '#f8f6f0';
                    }}
                  />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 font-bold transition-all"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '14px',
                    fontSize: '15px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    background: isSubmitting ? '#f0ece1' : '#111110',
                    color: isSubmitting ? 'var(--muted)' : '#fff',
                    boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(0,0,0,0.14)',
                    transform: 'translateY(0)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isSubmitting ? 'none' : '0 6px 20px rgba(0,0,0,0.14)';
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2.5px solid #aaa',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                        }}
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

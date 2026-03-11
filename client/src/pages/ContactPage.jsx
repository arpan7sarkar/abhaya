import { useState } from 'react';
import { Mail, Send, MapPin, Clock, MessageSquare, Phone } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@avaya.app',
    sub: 'We reply within 24 hours',
    color: '#e8a020',
    bg: '#fff4e0',
  },
  {
    icon: Phone,
    title: 'Call Us',
    detail: '+91 1800-XXX-XXXX',
    sub: 'Mon–Sat, 9am–6pm IST',
    color: '#22c55e',
    bg: '#ecfdf5',
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
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      addToast('Thank you! We\'ll get back to you soon.', 'success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(200,134,10,0.15)', top: '-80px', right: '-60px' }}></div>
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(200,134,10,0.1)', bottom: '-40px', left: '-40px' }}></div>

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
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
            <MessageSquare size={14} />
            Get in Touch
          </div>
          <h1 className="font-garamond" style={{
            fontSize: '52px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}>
            Contact <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Us</em>
          </h1>
          <p style={{
            fontSize: '17px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: '440px',
            margin: '0 auto',
          }}>
            Have feedback, a question, or want to report an issue? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {contactInfo.map(({ icon: Icon, title, detail, sub, color, bg }) => (
            <div
              key={title}
              className="hover-lift"
              style={{
                padding: '28px 24px',
                background: 'var(--white)',
                border: '1.5px solid var(--border)',
                borderRadius: '24px',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{detail}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted2)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Left: Info */}
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              <Mail size={14} />
              Send a Message
            </div>
            <h2 className="font-garamond" style={{ fontSize: '36px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>
              We&apos;re here to <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>help</em>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '380px' }}>
              Whether you have a question about safety features, need help with your account, or want to report an unsafe area — our team is ready to assist.
            </p>

            <div style={{
              background: 'var(--cream)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '24px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>⚠️ For emergencies</div>
              <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
                If you&apos;re in immediate danger, do NOT use this form.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href="tel:100" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}>
                  <Phone size={14} /> Call 100
                </a>
                <a href="tel:1091" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 20px',
                  background: 'var(--gold)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}>
                  <Phone size={14} /> Call 1091
                </a>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{
            background: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: '28px',
            padding: '36px',
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="contact-name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '14px',
                    color: 'var(--ink)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="contact-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '14px',
                    color: 'var(--ink)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-message" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--ink)' }}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'var(--cream)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '14px',
                    color: 'var(--ink)',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary-landing"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: submitting ? 'var(--cream)' : 'var(--ink)',
                  color: submitting ? 'var(--muted)' : 'var(--white)',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: submitting ? 'none' : '0 8px 24px rgba(0,0,0,0.12)',
                  transition: 'all 0.25s ease',
                }}
              >
                <Send size={18} />
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

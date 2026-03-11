import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Route, AlertTriangle } from 'lucide-react';
import { Show, UserButton } from '@clerk/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteHeader from '../components/Layout/SiteHeader';
import SiteFooter from '../components/Layout/SiteFooter';
export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(1);
  const handleSOS = () => {
    alert("SOS Activated! Locating nearest police station...");
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar entrance
    gsap.fromTo('.landing-nav',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );

    // Hero eyebrow
    gsap.fromTo('.hero-eyebrow',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );

    // Hero H1 Stagger
    gsap.fromTo('.hero-h1 span',
      { y: '110%' },
      { y: '0%', duration: 1, stagger: 0.13, ease: "power4.out", delay: 0.4 }
    );

    // Hero Elements Staggered Fade Up
    gsap.fromTo('.hero-fade-up',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.8 }
    );

    // Right Column Card Animation
    gsap.fromTo('.hero-card-anim',
      { opacity: 0, y: 36, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 0.8 }
    );

    // Floating Pills (entrance + loop)
    gsap.fromTo('.floating-f1',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.6)", delay: 1.2, onComplete: () => {
          gsap.to('.floating-f1', { y: -10, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }}
    );

    gsap.fromTo('.floating-f2',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.6)", delay: 1.4, onComplete: () => {
          gsap.to('.floating-f2', { y: 10, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }}
    );

    // Section ScrollTriggers
    const sections = ['.features-section', '.how-it-works-section', '.stats-section', '.welcome-section', '.sos-banner'];
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 82%',
        onEnter: () => {
          if (sec === '.features-section') {
            gsap.fromTo('.feature-card-anim', 
              { opacity: 0, y: 40 }, 
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );
          } else if (sec === '.how-it-works-section') {
            gsap.fromTo('.hiw-step', 
              { opacity: 0, x: -30 }, 
              { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
            );
            gsap.fromTo('.hiw-phone',
              { opacity: 0, x: 30 },
              { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
            );
          } else if (sec === '.stats-section') {
            gsap.fromTo('.stat-block',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
          } else if (sec === '.welcome-section') {
             gsap.fromTo('.welcome-panel, .welcome-quick-card',
               { opacity: 0, y: 30 },
               { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
             );
          } else if (sec === '.sos-banner') {
             gsap.fromTo('.sos-banner-anim',
               { scale: 0.97, opacity: 0 },
               { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" }
             );
          }
        }
      });
    });

  });

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }} className="font-outfit">
      {/* ── NAVBAR (Matched to SiteHeader) ── */}
      <div className="landing-nav" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
        <SiteHeader />
      </div>

      {/* ── HERO SECTION ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px', overflow: 'hidden' }}>
        {/* Right side background */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: 'linear-gradient(160deg, #f0f7f3, #e1efe8)', zIndex: 0 }}></div>
        
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '55% 45%', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* LEFT COLUMN */}
          <div style={{ padding: '40px 40px 40px 40px' }}>
          <div className="hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse-ring 1.8s infinite' }}></span>
            WOMEN'S SAFETY NAVIGATION
          </div>
          
          <h1 className="hero-h1 font-garamond" style={{ fontSize: '78px', fontWeight: 700, lineHeight: 1, letterSpacing: '-1.5px', marginBottom: '24px', color: 'var(--ink)' }}>
            <div style={{ overflow: 'hidden' }}><span style={{ display: 'inline-block' }}>Navigate</span></div>
            <div style={{ overflow: 'hidden' }}><span style={{ display: 'inline-block' }}>with <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Confidence,</em></span></div>
            <div style={{ overflow: 'hidden' }}><span style={{ display: 'inline-block' }}>Stay Safe Always</span></div>
          </h1>
          
          <p className="hero-fade-up" style={{ fontSize: '16px', color: 'var(--muted)', maxWidth: '400px', lineHeight: 1.75, marginBottom: '40px' }}>
            Avaya finds you the safest route — not just the fastest. Real-time safety scores, color-coded roads, and one-tap emergency SOS built for every woman.
          </p>
          
          <div className="hero-fade-up" style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
            <Link to="/map" className="btn-primary-landing" style={{ padding: '14px 28px', background: 'var(--ink)', color: 'var(--white)', borderRadius: '30px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🗺 Open Live Map
            </Link>
            <Link to="/how-it-works" className="btn-secondary-landing" style={{ padding: '14px 28px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--ink)', borderRadius: '30px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ▶ How it works
            </Link>
          </div>
          
          <div className="hero-fade-up" style={{ display: 'flex', gap: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <div><div className="font-garamond" style={{ fontSize: '30px', fontWeight: 700 }}>2000+</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>Routes Mapped</div></div>
            <div><div className="font-garamond" style={{ fontSize: '30px', fontWeight: 700 }}>50K+</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>Women Protected</div></div>
            <div><div className="font-garamond" style={{ fontSize: '30px', fontWeight: 700 }}>99%</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>Satisfaction</div></div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          <div className="hero-card-anim hover-lift" style={{ position: 'relative', width: '100%', maxWidth: '340px', background: 'var(--white)', borderRadius: '28px', border: '1px solid var(--border)', boxShadow: '0 24px 48px rgba(0,0,0,0.06)' }}>
            
            {/* Map Preview */}
            <div style={{ height: '240px', background: 'linear-gradient(160deg, #dff2ea, #cce8d8, #b8ddc8)', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,143,90,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,143,90,0.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <svg viewBox="0 0 310 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M40 200 Q 150 180 180 120 T 260 60" fill="none" stroke="var(--green)" strokeWidth="6" strokeLinecap="round" />
                <path d="M40 200 Q 100 130 150 90 T 260 60" fill="none" stroke="var(--gold-mid)" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" />
                <circle cx="260" cy="60" r="8" fill="var(--red)" />
              </svg>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>📍 Destination</div>
            </div>

            {/* Panel Body */}
            <div style={{ padding: '22px 24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--gold-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="var(--gold)" />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Sector 29, City Center</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>From: Current Location</div>
                </div>
              </div>

              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '1px', marginBottom: '12px' }}>4 ROUTES FOUND</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ background: 'var(--green-light)', border: '1.5px solid var(--green)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Route 4 — Safest</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>5 segments · Cost: 13.34</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--green)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>SAFEST</div>
                </div>

                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Route 1 — Shortest</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>3 segments · Cost: 8.92</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--gold)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>SHORTEST</div>
                </div>

                <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--muted)' }}></div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Route 2</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>5 segments · Cost: 11.9</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--border)', color: 'var(--muted)', fontSize: '9px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>5.4 · Mod</div>
                </div>
              </div>
            </div>

            {/* Floating popups */}
            <div className="floating-f1" style={{ position: 'absolute', top: '-20px', left: '-10px', background: 'var(--white)', padding: '10px 14px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '16px' }}>✅</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>Safe Route Found</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Score: 5.8 · Moderate</div>
              </div>
            </div>
            
            <div className="floating-f2" style={{ position: 'absolute', bottom: '-20px', right: '-10px', background: 'var(--white)', padding: '10px 14px', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '16px' }}>🚨</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>SOS Ready</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>Police: 0.3km away</div>
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
          {Array(4).fill(['🚨 Emergency SOS', '⭐ Safety Scores', '📍 Point-to-Point Routing', '🔐 Women First', '🛡 Safe Routes']).flat().map((item, i) => (
            <span key={i} style={{ display: 'inline-block', fontSize: '14px', fontWeight: 500, margin: '0 24px', color: 'var(--ink)' }}>{item}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section className="features-section" style={{ background: 'var(--white)', padding: '110px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-block', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>— Core Features</div>
          <h2 className="font-garamond" style={{ fontSize: '48px', fontWeight: 700, color: 'var(--ink)' }}>Built to keep you <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>safe,</em> every single route</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div className="feature-card-anim landing-feature-card" style={{ border: '1.5px solid var(--border)', borderRadius: '28px', padding: '40px 36px', background: 'var(--white)', position: 'relative', overflow: 'hidden', cursor: 'default' }}>
            <div style={{ width: '100%', height: '3px', background: 'var(--gold-mid)', position: 'absolute', top: 0, left: 0, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s ease' }} className="accent-bar" />
            <div style={{ marginBottom: '24px' }}><MapPin size={32} color="var(--gold)" /></div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Color-Coded Road Safety</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6 }}>Roads reflect real-time safety metrics including lighting, crowd density, and historical incident reports to keep you informed.</p>
          </div>
          <div className="feature-card-anim landing-feature-card" style={{ border: '1.5px solid var(--border)', borderRadius: '28px', padding: '40px 36px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '3px', background: 'var(--green)', position: 'absolute', top: 0, left: 0, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s ease' }} className="accent-bar" />
            <div style={{ marginBottom: '24px' }}><Route size={32} color="var(--green)" /></div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Safest Route Algorithm</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6 }}>Our advanced algorithm weighs safety heavily, dynamically guiding you through well-lit and populated safe areas.</p>
          </div>
          <div className="feature-card-anim landing-feature-card" style={{ border: '1.5px solid var(--border)', borderRadius: '28px', padding: '40px 36px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '3px', background: 'var(--red)', position: 'absolute', top: 0, left: 0, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s ease' }} className="accent-bar" />
            <div style={{ marginBottom: '24px' }}><AlertTriangle size={32} color="var(--red)" /></div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Emergency SOS</h3>
            <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6 }}>A dedicated one-tap panic button that instantly locates and routes you to the nearest police station securely.</p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works-section" style={{ background: 'var(--cream)', padding: '110px 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 className="font-garamond hiw-step" style={{ fontSize: '48px', fontWeight: 700, marginBottom: '48px' }}>How it works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {[
                { num: 1, title: 'Set Your Location', desc: 'Enter your destination to see road safety scores instantly.' },
                { num: 2, title: 'Compare Routes', desc: 'Review the shortest and safest path options side-by-side.' },
                { num: 3, title: 'Navigate Safely', desc: 'Follow the live map with total peace of mind.' }
              ].map((step) => (
                <div key={step.num} className="hiw-step" onClick={() => setActiveStep(step.num)} style={{ display: 'flex', gap: '20px', cursor: 'pointer', padding: '16px', borderRadius: '20px', background: activeStep === step.num ? 'var(--white)' : 'transparent', border: activeStep === step.num ? '1.5px solid var(--border)' : '1.5px solid transparent', transition: 'all 0.3s ease' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: activeStep === step.num ? 'var(--ink)' : 'var(--white)', border: '1.5px solid var(--border)', color: activeStep === step.num ? 'white' : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600, flexShrink: 0, transition: 'all 0.3s ease' }}>{step.num}</div>
                   <div>
                     <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
                     <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.5 }}>{step.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hiw-phone" style={{ background: 'var(--white)', height: '500px', borderRadius: '40px', border: '8px solid var(--ink)', boxShadow: '0 32px 64px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
            {/* Notch */}
            <div style={{ height: '30px', width: '120px', background: 'var(--ink)', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', zIndex: 5 }}></div>
            
            {/* SCREEN 1: Set Location */}
            {activeStep === 1 && (
              <div style={{ background: 'linear-gradient(160deg, #e8f4ec, #d4ead8, #c8e0cc)', height: '100%', width: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '44px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', borderRadius: '24px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', zIndex: 3 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a8a89e' }}></div>
                  <span style={{ fontSize: '11px', color: '#a8a89e', fontWeight: 500 }}>Where do you want to go?</span>
                  <div style={{ marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderLeft: '1.5px solid white', borderTop: '1.5px solid white', transform: 'rotate(135deg)' }}></div>
                  </div>
                </div>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 300 500">
                  <path d="M 40 200 Q 80 220 120 210 T 200 250 T 280 220" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 150 80 Q 160 150 140 200 T 160 350 T 140 480" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: '220px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#60a5fa', border: '4px solid white', boxShadow: '0 2px 12px rgba(96,165,250,0.5)' }}></div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(96,165,250,0.12)', position: 'absolute', top: '-20px', left: '-20px' }}></div>
                </div>
                <div style={{ position: 'absolute', top: '180px', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: '12px', padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 3, whiteSpace: 'nowrap', fontSize: '10px', fontWeight: 600, color: '#141414' }}>
                  📍 You are here
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(255,255,255,0.97)', borderRadius: '20px 20px 0 0', padding: '16px 20px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', zIndex: 3, textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#141414', marginBottom: '8px' }}>📍 Drop a pin or search</div>
                  <div style={{ fontSize: '10px', color: '#6b6b6b' }}>Tap anywhere on the map or type a destination</div>
                </div>
              </div>
            )}

            {/* SCREEN 2: Compare Routes */}
            {activeStep === 2 && (
              <div style={{ background: 'linear-gradient(160deg, #e8f4ec, #d4ead8, #c8e0cc)', height: '100%', width: '100%', position: 'relative' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 300 500">
                  <path d="M 40 200 Q 80 220 120 210 T 200 250 T 280 220" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 150 80 Q 160 150 140 200 T 160 350 T 140 480" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 80 130 Q 110 180 140 220 T 220 320" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 80 130 Q 140 160 180 200 T 240 310" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />
                  <path d="M 80 130 Q 60 200 100 260 T 220 340" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />
                </svg>
                <div style={{ position: 'absolute', top: '120px', left: '68px', zIndex: 2 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#60a5fa', border: '3px solid white', boxShadow: '0 2px 8px rgba(96,165,250,0.4)' }}></div>
                </div>
                <div style={{ position: 'absolute', top: '300px', right: '60px', zIndex: 2 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', border: '3px solid white', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}></div>
                </div>
                {/* Route comparison panel */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(255,255,255,0.97)', borderRadius: '20px 20px 0 0', padding: '14px 16px 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', zIndex: 3 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#141414', marginBottom: '10px' }}>3 Routes Found</div>
                  {[{name: 'Route 1', label: 'SAFEST', score: '7.3', color: '#22c55e', dist: '1.27 km'},
                    {name: 'Route 2', label: '', score: '6.9', color: '#f59e0b', dist: '1.69 km'},
                    {name: 'Route 3', label: 'SHORTEST', score: '7.1', color: '#60a5fa', dist: '980 m'}
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', marginBottom: i < 2 ? '6px' : 0, background: i === 0 ? 'rgba(34,197,94,0.08)' : '#fdf9f3', borderRadius: '10px', border: i === 0 ? '1px solid rgba(34,197,94,0.2)' : '1px solid #e8e6e0' }}>
                      <div style={{ width: '3px', height: '24px', borderRadius: '3px', background: r.color }}></div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#141414' }}>{r.name}</span>
                        {r.label && <span style={{ fontSize: '8px', fontWeight: 700, color: r.color, marginLeft: '6px', textTransform: 'uppercase' }}>{r.label}</span>}
                        <div style={{ fontSize: '9px', color: '#6b6b6b' }}>{r.dist}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: r.color, background: `${r.color}18`, padding: '2px 8px', borderRadius: '8px' }}>{r.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 3: Navigate Safely */}
            {activeStep === 3 && (
              <div style={{ background: 'linear-gradient(160deg, #e8f4ec, #d4ead8, #c8e0cc)', height: '100%', width: '100%', position: 'relative' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} viewBox="0 0 300 500">
                  <path d="M 40 200 Q 80 220 120 210 T 200 250 T 280 220" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 150 80 Q 160 150 140 200 T 160 350 T 140 480" fill="none" stroke="rgba(200,180,140,0.4)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 100 150 Q 130 200 150 250 T 210 360" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', top: '140px', left: '88px', zIndex: 2 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#22c55e', border: '4px solid white', boxShadow: '0 2px 12px rgba(34,197,94,0.5)' }}></div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(34,197,94,0.12)', position: 'absolute', top: '-15px', left: '-15px' }}></div>
                </div>
                <div style={{ position: 'absolute', top: '340px', right: '70px', zIndex: 2 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', border: '3px solid white', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}></div>
                </div>
                {/* Navigation header */}
                <div style={{ position: 'absolute', top: '44px', left: '16px', right: '16px', background: '#22c55e', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 4px 16px rgba(34,197,94,0.3)', zIndex: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>↑</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Head North</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>on NH12 Connector · 200m</div>
                    </div>
                  </div>
                </div>
                {/* Safety badge on route */}
                <div style={{ position: 'absolute', top: '230px', left: '140px', background: 'white', borderRadius: '12px', padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 3, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#141414' }}>7.3</span>
                  <span style={{ fontSize: '9px', color: '#6b6b6b' }}>Safe Route</span>
                </div>
                {/* Bottom ETA bar */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(255,255,255,0.97)', borderRadius: '20px 20px 0 0', padding: '16px 20px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', zIndex: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#141414' }}>4 min</div>
                      <div style={{ fontSize: '10px', color: '#6b6b6b' }}>1.27 km · ETA 2:34 PM</div>
                    </div>
                    <div style={{ background: 'rgba(34,197,94,0.15)', padding: '4px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#22c55e' }}>🛡 Safe</div>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#e8e6e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', background: '#22c55e', borderRadius: '4px' }}></div>
                  </div>
                </div>
                {/* SOS button */}
                <div style={{ position: 'absolute', bottom: '120px', right: '16px', width: '40px', height: '40px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 4px 16px rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, color: 'white', fontSize: '11px', fontWeight: 800 }}>SOS</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="stats-section" style={{ background: 'var(--ink)', padding: '80px 8%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', color: 'white', textAlign: 'center' }}>
        {[['2000+', 'Routes'], ['50K+', 'Women'], ['99%', 'Satisfaction'], ['2s', 'Calculation']].map((stat, i) => (
          <div key={i} className="stat-block">
            <div className="font-garamond" style={{ fontSize: '56px', fontWeight: 700 }}>{stat[0].replace(/[^0-9.]/g, '')}<span style={{ color: 'var(--gold)' }}>{stat[0].replace(/[0-9.]/g, '')}</span></div>
            <div style={{ color: 'var(--muted2)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>{stat[1]}</div>
          </div>
        ))}
      </section>

      {/* ── DASHBOARD / WELCOME (Auth Only) ── */}
      <Show when="signed-in">
        <section className="welcome-section" style={{ background: 'var(--white)', padding: '110px 8%' }}>
          <div style={{ marginBottom: '48px' }}>
             <div style={{ display: 'inline-block', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>— Dashboard</div>
             <h2 className="font-garamond" style={{ fontSize: '40px', fontWeight: 700 }}>Welcome back, <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>User</em></h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div className="welcome-panel" style={{ background: 'var(--ink)', padding: '48px', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--green)', opacity: 0.1, borderRadius: '50%', top: '-100px', right: '-100px' }}></div>
              <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'var(--gold)', opacity: 0.1, borderRadius: '50%', bottom: '-50px', left: '-50px' }}></div>
              
              <div style={{ display: 'inline-block', background: 'rgba(200,134,10,0.2)', color: 'var(--gold)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>Ready to navigate</div>
              <h3 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>Your personal safety dashboard</h3>
              <p style={{ color: 'var(--muted2)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '300px' }}>Access live maps, check real-time routes, and use quick SOS actions.</p>
              
              <Link to="/map" style={{ display: 'inline-flex', padding: '14px 28px', background: 'var(--gold)', color: 'white', borderRadius: '14px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', alignItems: 'center', gap: '8px' }}>
                🗺 Open Live Map →
              </Link>
              
              <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--green)' }}>
                ● Live safety data active
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Plan a Route', to: '/map', icon: <Route size={24} color="var(--ink)" /> },
                { label: 'Safety Tips', to: '/safety-tips', icon: <Shield size={24} color="var(--ink)" /> },
                { label: 'SOS Contacts', action: handleSOS, icon: <AlertTriangle size={24} color="var(--red)" /> },
                { label: 'Safety Report', to: '/map', icon: <MapPin size={24} color="var(--ink)" /> },
              ].map((card, i) => (
                card.to ? (
                  <Link key={i} to={card.to} className="welcome-quick-card hover-lift" style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '24px', padding: '24px', textDecoration: 'none', color: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s ease, background 0.2s ease' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--white)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{card.label}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '18px' }}>→</span>
                    </div>
                  </Link>
                ) : (
                  <button key={i} onClick={card.action} className="welcome-quick-card hover-lift" style={{ cursor: 'pointer', background: 'var(--red-light)', border: '1px solid var(--red)', borderRadius: '24px', padding: '24px', color: 'var(--ink)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left', transition: 'transform 0.2s ease' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--white)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{card.label}</span>
                      <span style={{ color: 'var(--red)', fontSize: '18px' }}>→</span>
                    </div>
                  </button>
                )
              ))}
            </div>
          </div>
        </section>
      </Show>

      {/* ── SOS BANNER ── */}
      <section className="sos-banner" style={{ margin: '0 8% 80px', background: 'linear-gradient(135deg, #1a8f5a, #0f7048)', borderRadius: '40px', padding: '48px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', top: '-100px', right: '-100px' }}></div>
        <div className="sos-banner-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', zIndex: 10 }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' }}>Emergency Feature</div>
            <h2 className="font-garamond" style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Instant Emergency Support</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>One tap to share your location with contacts and nearest police.</p>
          </div>
          <button onClick={handleSOS} className="btn-primary-landing" style={{ padding: '16px 32px', background: 'var(--white)', color: 'var(--red)', fontSize: '16px', fontWeight: 700, border: 'none', borderRadius: '24px', cursor: 'pointer', boxShadow: '0 16px 32px rgba(0,0,0,0.1)' }}>
            🚨 Activate SOS Now
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />

      <style jsx>{`
        .feature-card-anim:hover {
           transform: translateY(-6px);
           box-shadow: 0 16px 32px rgba(0,0,0,0.06);
           border-color: var(--gold-mid);
        }
        .feature-card-anim:hover .accent-bar {
           transform: scaleX(1);
        }
        .welcome-quick-card:hover {
           transform: translateY(-4px);
           background: var(--white) !important;
        }
        button:hover {
           transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

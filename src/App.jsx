import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function TypewriterText({ text, delay = 0, speed = 55, eraseSpeed = 28, pauseAfterType = 2400, pauseAfterErase = 500 }) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('init');

  useEffect(() => {
    let t;
    if (phase === 'init') {
      t = setTimeout(() => setPhase('typing'), delay);
    } else if (phase === 'typing') {
      if (displayed.length < text.length) {
        t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      } else {
        t = setTimeout(() => setPhase('erasing'), pauseAfterType);
      }
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), eraseSpeed);
      } else {
        t = setTimeout(() => setPhase('typing'), pauseAfterErase);
      }
    }
    return () => clearTimeout(t);
  }, [phase, displayed, text, delay, speed, eraseSpeed, pauseAfterType, pauseAfterErase]);

  return (
    <>
      {displayed}
      <span className="tw-cursor">|</span>
    </>
  );
}

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mouse = { x: -2000, y: -2000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = () => { mouse.x = -2000; mouse.y = -2000; };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    const GRAYS = ['55,55,60', '90,90,95', '125,125,130', '160,160,165', '40,40,45', '110,110,115', '175,175,180'];
    const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000));

    const particles = Array.from({ length: count }, () => {
      const tvx = (Math.random() - 0.5) * 0.6;
      const tvy = (Math.random() - 0.5) * 0.6;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 3 + 0.6,
        vx: tvx,
        vy: tvy,
        tvx,
        tvy,
        opacity: Math.random() * 0.38 + 0.12,
        opacityDelta: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.004 + 0.001),
        col: GRAYS[Math.floor(Math.random() * GRAYS.length)],
      };
    });

    const MOUSE_RADIUS = 200;
    const MOUSE_FORCE = 0.018;
    const RESTORE = 0.025;
    const MAX_SPEED = 3.0;

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Drift back to natural velocity
        p.vx += (p.tvx - p.vx) * RESTORE;
        p.vy += (p.tvy - p.vy) * RESTORE;

        // Speed cap
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > MAX_SPEED) { p.vx = (p.vx / spd) * MAX_SPEED; p.vy = (p.vy / spd) * MAX_SPEED; }

        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDelta;

        if (p.opacity >= 0.52 || p.opacity <= 0.1) p.opacityDelta *= -1;
        if (p.x < -8) p.x = canvas.width + 8;
        if (p.x > canvas.width + 8) p.x = -8;
        if (p.y < -8) p.y = canvas.height + 8;
        if (p.y > canvas.height + 8) p.y = -8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

const Logo = ({ onClick }) => (
  <div className="logo-mark" onClick={onClick}>
    <svg
      className="logo-icon"
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      {/* Route path: origin circle → bezier curve → destination diamond */}
      <path
        d="M 6 26 C 5 13 27 19 27 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="6" cy="26" r="3.2" fill="currentColor" />
      <path d="M 27 4.5 L 30.5 8 L 27 11.5 L 23.5 8 Z" fill="currentColor" />
    </svg>
    <span className="logo-wordmark">envido</span>
  </div>
);

const carriers = [
  { name: 'Correo Argentino', logo: '/logos/Logotipo_correo_argentino.png' },
  { name: 'OCA', logo: '/logos/Logotipo_oca.svg' },
  { name: 'OCASA', logo: '/logos/Logotipo_ocasa.svg' },
  { name: 'Urbano', logo: '/logos/Logotipo_urbano.svg' },
  { name: 'Pickit', logo: '/logos/Logotipo_pickit.svg' }
];

const results = [
  { 
    id: 1, 
    company: 'pickit Envío a Punto', 
    price: '$2.950', 
    time: 'Llega hoy (Más rápido)', 
    logo: '🦘', 
    featured: true 
  },
  { 
    id: 2, 
    company: 'pickit Envío a Domicilio', 
    price: '$3.800', 
    time: 'Mañana', 
    logo: '🦘' 
  },
  { 
    id: 3, 
    company: 'Correo Argentino', 
    price: '$3.850', 
    time: '2-3 días hábiles', 
    logo: '📦' 
  },
  { 
    id: 4, 
    company: 'OCA', 
    price: '$4.250', 
    time: 'Mañana', 
    logo: '🚛' 
  }
];

const PickitLogo = () => (
  <div className="pickit-mini-logo">
    <svg width="60" height="24" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 25.5C15.5 25.5 5.5 21.5 5.5 13.5C5.5 5.5 15.5 -10.5 30.5 -14.5C45.5 -18.5 51.5 -1.5 59.5 6.5C67.5 14.5 80.5 10.5 88.5 14.5" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round"/>
      <text x="35" y="28" fill="#FF6B00" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif">pickit</text>
    </svg>
  </div>
);

function App() {
  // Navigation State
  // Views: 'tracking-home', 'tracking-results', 'quoter-home', 'quoter-results', 'register', 'payment', 'dashboard'
  const [view, setView] = useState('tracking-home');
  const [trackingId, setTrackingId] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  // Form States
  const [quoteData, setQuoteData] = useState({ from: '', to: '', w: '', h: '', l: '' });

  // Notification Modal States
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifStep, setNotifStep] = useState('contact'); // 'contact' | 'verify' | 'success'
  const [notifContact, setNotifContact] = useState('');
  const [notifCode, setNotifCode] = useState('');
  const [notifType, setNotifType] = useState('email'); // 'email' | 'phone'

  // Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Navbar glass on scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Actions
  const handleTrackingSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) setView('tracking-results');
  };

  const handleQuote = (e) => {
    e.preventDefault();
    setView('quoter-results');
  };

  const handleCreateShipment = () => {
    setShowModal(true);
  };

  const [includeInsurance, setIncludeInsurance] = useState(true);

  const handleRegister = (e) => {
    e.preventDefault();
    setView('ship-data');
  };

  const handleShipData = (e) => {
    e.preventDefault();
    setView('payment');
  };

  const handlePayment = () => {
    setView('payment-success');
    setTimeout(() => setView('dashboard'), 4000);
  };

  const resetToHome = () => {
    setView('tracking-home');
    setTrackingId('');
  };

  return (
    <>
    {view === 'tracking-home' && <ParticleBackground />}
    <div className="app">
      {/* Toast Notification */}
      {toast && <div className="toast fade-in">{toast}</div>}

      {/* Notification Modal */}
      {showNotifModal && (
        <div className="modal-overlay" onClick={() => setShowNotifModal(false)}>
          <div className="modal-box animate-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNotifModal(false)}>✕</button>

            {/* STEP 1: Contact input */}
            {notifStep === 'contact' && (
              <>
                <div className="modal-icon">🔔</div>
                <h3>Recibir notificaciones</h3>
                <p className="modal-desc">Te avisamos cuando haya novedades sobre tu envío <strong>#PK-448291</strong></p>

                <div className="notif-type-toggle">
                  <button
                    className={`type-btn ${notifType === 'email' ? 'active' : ''}`}
                    onClick={() => setNotifType('email')}
                  >
                    ✉️ Email
                  </button>
                  <button
                    className={`type-btn ${notifType === 'phone' ? 'active' : ''}`}
                    onClick={() => setNotifType('phone')}
                  >
                    📱 Celular
                  </button>
                </div>

                <div className="input-container mt-2">
                  <input
                    type={notifType === 'email' ? 'email' : 'tel'}
                    placeholder={notifType === 'email' ? 'tu@email.com' : '+54 9 11 ...'}
                    value={notifContact}
                    onChange={e => setNotifContact(e.target.value)}
                  />
                </div>

                <button
                  className="btn-primary mt-2"
                  disabled={!notifContact}
                  onClick={() => setNotifStep('verify')}
                >
                  Enviar código →
                </button>
              </>
            )}

            {/* STEP 2: Verify code */}
            {notifStep === 'verify' && (
              <>
                <div className="modal-icon">📩</div>
                <h3>Verificá tu {notifType === 'email' ? 'correo' : 'celular'}</h3>
                <p className="modal-desc">
                  Enviamos un código de 6 dígitos a<br />
                  <strong>{notifContact}</strong>
                </p>

                <div className="code-inputs">
                  {[0,1,2,3,4,5].map(i => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      className="code-digit"
                      onChange={e => {
                        const val = e.target.value;
                        if (val && e.target.nextSibling) e.target.nextSibling.focus();
                        const inputs = e.target.closest('.code-inputs').querySelectorAll('.code-digit');
                        setNotifCode(Array.from(inputs).map(inp => inp.value).join(''));
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
                          e.target.previousSibling.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  className="btn-primary mt-2"
                  onClick={() => setNotifStep('success')}
                >
                  Verificar código
                </button>
                <button className="btn-text-gray mt-1" onClick={() => setNotifStep('contact')}>
                  ← Cambiar {notifType === 'email' ? 'correo' : 'número'}
                </button>
              </>
            )}

            {/* STEP 3: Success */}
            {notifStep === 'success' && (
              <>
                <div className="modal-success-icon">
                  <div className="success-ring"></div>
                  <div className="success-icon" style={{width:'72px', height:'72px', fontSize:'1.8rem'}}>✓</div>
                </div>
                <h3 className="mt-2">¡Suscripto!</h3>
                <p className="modal-desc">
                  Te notificaremos sobre los cambios de estado de tu envío <strong>#PK-448291</strong> en <strong>{notifContact}</strong>
                </p>
                <button className="btn-primary mt-2" onClick={() => setShowNotifModal(false)}>
                  Entendido
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className={`navbar${navScrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container nav-content">
          <Logo onClick={resetToHome} />
          
          <div className="nav-actions">
            {view === 'dashboard' || view === 'payment' || view === 'ship-data' ? (
              <>
                <span className="nav-icon">🔔</span>
                <div className="profile-pill">
                  <div className="avatar">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80" alt="Juan Doe" />
                  </div>
                  <span>Juan Doe</span>
                </div>
              </>
            ) : view === 'register' ? (
              <button className="btn-pill">Iniciar sesión</button>
            ) : view.startsWith('quoter') ? (
              <>
                <button className="btn-text">Iniciar sesión</button>
                <button className="btn-pill accent-bg" onClick={() => setView('register')}>Crear cuenta</button>
              </>
            ) : (
              <button className="btn-pill" onClick={() => setView('quoter-home')}>Cotizar envío</button>
            )}
          </div>
        </div>
      </nav>

      {/* Views Container */}
      <div className="view-container">
        
        {/* PANTALLA 1: TRACKING HOME */}
        {view === 'tracking-home' && (
          <main className="container tracking-home-view animate-up">
            <div className="hero-ambient" aria-hidden="true" />
            <svg className="hero-noise-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <filter id="fn" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch">
                  <animate attributeName="baseFrequency" dur="42s"
                    values="0.65;0.48;0.72;0.55;0.65" keyTimes="0;0.25;0.5;0.75;1"
                    calcMode="spline" keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
                    repeatCount="indefinite" />
                </feTurbulence>
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" fill="white" filter="url(#fn)" />
            </svg>
            <h1 className="single-line-title">
              <TypewriterText text="Seguí tus envíos en un solo lugar" delay={150} speed={38} />
            </h1>
            <div className="search-container">
              <form className="search-form" onSubmit={handleTrackingSearch}>
                <div className="input-wrapper shadow">
                  <input 
                    type="text" 
                    placeholder="Ingresa tu número de seguimiento" 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>
                
                <div className="search-helpers centered">
                  <span className="tooltip-trigger" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                    ¿Dónde lo encuentro?
                  </span>
                  {showTooltip && <div className="tooltip-box">En el mail de confirmación de tu compra.</div>}
                </div>
                
                <button type="submit" className="btn-primary">Consultar</button>
              </form>
            </div>

            <div className="carrier-logos-footer">
              <div className="carrier-logos-row">
                {carriers.map(c => (
                  <div key={c.name} className="carrier-badge">
                    <img src={c.logo} alt={c.name} className="carrier-logo-img" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* TRACKING RESULTS */}
        {view === 'tracking-results' && (
          <main className="container animate-up">
            <div className="status-card shadow">
              <span className="status-title">Llega hoy</span>
              <span className="tracking-number">#{trackingId}</span>
            </div>
            <div className="timeline">
              <div className="timeline-item active">
                <div className="timeline-icon">🚚</div>
                <div className="timeline-content">
                  <h3>Tu envío está en el último tramo del recorrido.</h3>
                  <p>Hoy, 10:45 hs</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Llegó al centro de distribución</h3>
                  <p>Hoy, 06:30 hs</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>En viaje a la sucursal de destino</h3>
                  <p>Ayer, 21:15 hs</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Procesado en planta principal</h3>
                  <p>Ayer, 18:20 hs</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>Despachado por el remitente</h3>
                  <p>10 May, 14:00 hs</p>
                </div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary" onClick={() => { setShowNotifModal(true); setNotifStep('contact'); setNotifContact(''); setNotifCode(''); }}>🔔 Recibir notificaciones</button>
              <button className="btn-ghost" onClick={resetToHome}>Consultar otro envío ←</button>
            </div>
          </main>
        )}

        {/* PANTALLA 1 (COTIZADOR): QUOTER HOME */}
        {view === 'quoter-home' && (
          <main className="container animate-up">
            <div className="hero-section">
              <h1>Cotizar envío</h1>
              <p className="description">Compará precios en las mejores logísticas del país</p>
            </div>
            <form className="quoter-card shadow" onSubmit={handleQuote}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quote-origin">CP o Localidad (Desde)</label>
                  <div className="input-with-icon">
                    <span className="icon">📍</span>
                    <input id="quote-origin" type="text" placeholder="Origen" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quote-dest">CP o Localidad (Hasta)</label>
                  <div className="input-with-icon">
                    <span className="icon">📍</span>
                    <input id="quote-dest" type="text" placeholder="Destino" />
                  </div>
                </div>
              </div>
              <div className="form-row dims">
                <div className="form-group">
                  <label htmlFor="quote-width">Ancho</label>
                  <div className="input-with-suffix">
                    <input id="quote-width" type="number" placeholder="0" />
                    <span>cm</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quote-height">Alto</label>
                  <div className="input-with-suffix">
                    <input id="quote-height" type="number" placeholder="0" />
                    <span>cm</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quote-length">Largo</label>
                  <div className="input-with-suffix">
                    <input id="quote-length" type="number" placeholder="0" />
                    <span>cm</span>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quote-weight">Peso</label>
                  <div className="input-with-suffix">
                    <input id="quote-weight" type="number" placeholder="0" />
                    <span>kg</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quote-value">Valor de mercadería</label>
                  <div className="input-with-icon">
                    <span className="icon">$</span>
                    <input id="quote-value" type="number" placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary elevated">Cotizar</button>
                <button type="button" className="btn-text-gray">Limpiar filtros</button>
              </div>
            </form>
          </main>
        )}

        {/* PANTALLA 2 (COTIZADOR): QUOTER RESULTS */}
        {view === 'quoter-results' && (
          <main className="container animate-up">
            <div className="search-summary-card card shadow-soft mb-4">
              <div className="summary-group">
                <span className="label-xs">RECORRIDO</span>
                <div className="summary-content">
                  <strong>Buenos Aires</strong>
                  <span className="arrow-icon">➔</span>
                  <strong>Córdoba</strong>
                </div>
              </div>
              <div className="v-divider"></div>
              <div className="summary-group">
                <span className="label-xs">DIMENSIONES</span>
                <div className="summary-content">
                  <span className="icon-sm">📦</span>
                  <strong>10 × 10 × 10</strong> <span className="unit">cm</span>
                  <span className="dot">•</span>
                  <strong>2</strong> <span className="unit">kg</span>
                </div>
              </div>
              <button className="btn-edit" onClick={() => setView('quoter-home')} title="Editar búsqueda">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
             <div className="results-list">
               {results.map(res => (
                 <div key={res.id} className={`result-card shadow-hover ${res.featured ? 'featured-card' : ''}`}>
                   {res.featured && <div className="featured-badge">RECOMENDADO</div>}
                   <div className="result-info">
                     <div className="result-logo">
                       {res.company.toLowerCase().includes('pickit') ? (
                         <PickitLogo />
                       ) : <span className="emoji-logo">{res.logo}</span>}
                     </div>
                     <div className="result-details">
                       <h3>{res.company}</h3>
                       <p className="delivery-time">{res.time}</p>
                     </div>
                   </div>
                   <div className="result-action">
                     <div className="price-tag">
                       <span className="price">{res.price}</span>
                       {res.featured && <span className="savings">Ahorrá 25%</span>}
                     </div>
                     <button className={`btn-pill ${res.featured ? 'primary-bg' : 'accent-bg'} small`} onClick={handleCreateShipment}>
                       Crear envío
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </main>
        )}

        {/* PANTALLA 3: REGISTER */}
        {view === 'register' && (
          <main className="container animate-up">
            <div className="flow-stepper">
              <div className="step active">
                <div className="step-circle">1</div>
                <span>Crear cuenta</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-circle">2</div>
                <span>Cargar datos</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-circle">3</div>
                <span>Pagar</span>
              </div>
            </div>
            <div className="auth-card shadow">
              <h2>Crear cuenta</h2>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-nombre">Nombre</label>
                    <div className="input-container">
                      <input id="reg-nombre" type="text" required placeholder="Ej: Juan" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-apellido">Apellido</label>
                    <div className="input-container">
                      <input id="reg-apellido" type="text" required placeholder="Ej: Perez" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email">Email</label>
                  <div className="input-container">
                    <input id="reg-email" type="email" required placeholder="juan.perez@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-phone">Teléfono</label>
                  <div className="input-container">
                    <input id="reg-phone" type="tel" required placeholder="+54 9 11 ..." />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-user">Usuario</label>
                    <div className="input-container">
                      <input id="reg-user" type="text" required placeholder="Nombre de usuario" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-pass">Contraseña</label>
                    <div className="input-container">
                      <input id="reg-pass" type="password" required placeholder="••••••••" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-primary mt-3">Continuar →</button>
              </form>
            </div>
          </main>
        )}

        {/* PANTALLA 3B: SHIP DATA */}
        {view === 'ship-data' && (
          <main className="container animate-up">
            <div className="flow-stepper">
              <div className="step done">
                <div className="step-circle">✓</div>
                <span>Crear cuenta</span>
              </div>
              <div className="step-line active"></div>
              <div className="step active">
                <div className="step-circle">2</div>
                <span>Cargar datos</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-circle">3</div>
                <span>Pagar</span>
              </div>
            </div>
            <form onSubmit={handleShipData} className="ship-data-form shadow">
              <div className="ship-data-section">
                <h3 className="section-title">📍 Datos del origen</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ship-org-name">Nombre</label>
                    <div className="input-container"><input id="ship-org-name" type="text" required placeholder="Tu nombre" /></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ship-org-last">Apellido</label>
                    <div className="input-container"><input id="ship-org-last" type="text" required placeholder="Tu apellido" /></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ship-org-email">Correo electrónico</label>
                  <div className="input-container"><input id="ship-org-email" type="email" required placeholder="tu@email.com" /></div>
                </div>
              </div>

              <div className="ship-data-divider">
                <span>▼</span>
              </div>

              <div className="ship-data-section">
                <h3 className="section-title">📦 Datos del destino</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ship-dest-name">Nombre</label>
                    <div className="input-container"><input id="ship-dest-name" type="text" required placeholder="Nombre del destinatario" /></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ship-dest-last">Apellido</label>
                    <div className="input-container"><input id="ship-dest-last" type="text" required placeholder="Apellido" /></div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ship-dest-email">Correo electrónico</label>
                    <div className="input-container"><input id="ship-dest-email" type="email" required placeholder="destinatario@email.com" /></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ship-dest-phone">Celular</label>
                    <div className="input-container"><input id="ship-dest-phone" type="tel" required placeholder="+54 9 11..." /></div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ship-dest-city">Ciudad o localidad</label>
                    <div className="input-container"><input id="ship-dest-city" type="text" required placeholder="Ej: Córdoba" /></div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ship-dest-address">Dirección</label>
                    <div className="input-container"><input id="ship-dest-address" type="text" required placeholder="Calle y número" /></div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ship-dest-notes">Nota para el destinatario <span className="optional">(opcional)</span></label>
                  <div className="input-container">
                    <textarea id="ship-dest-notes" rows="3" placeholder="Ej: Dejar con el portero, timbre 3B..." />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => setView('register')}>← Volver</button>
                <button type="submit" className="btn-primary">Continuar →</button>
              </div>
            </form>
          </main>
        )}

        {/* PANTALLA 3C: PAYMENT */}
        {view === 'payment' && (
          <main className="container animate-up">
            <div className="flow-stepper">
              <div className="step done">
                <div className="step-circle">✓</div>
                <span>Crear cuenta</span>
              </div>
              <div className="step-line active"></div>
              <div className="step done">
                <div className="step-circle">✓</div>
                <span>Cargar datos</span>
              </div>
              <div className="step-line active"></div>
              <div className="step active">
                <div className="step-circle">3</div>
                <span>Pagar</span>
              </div>
            </div>
            <div className="payment-card shadow">
              <h2>Confirmación y Pago</h2>
              
              <div className="order-summary">
                <div className="summary-header">
                  <div className="carrier-info">
                    <div className="pickit-mini-logo" style={{marginRight: '0.5rem'}}>
                      <svg width="40" height="16" viewBox="0 0 120 40" fill="none">
                        <text x="0" y="28" fill="#FF6B00" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif">pickit</text>
                      </svg>
                    </div>
                    <div>
                      <p className="label-sm">Logística seleccionada</p>
                      <strong>pickit Envío a Punto</strong>
                    </div>
                  </div>
                  <div className="route-info">
                    <span>Bs. As.</span>
                    <span className="arrow">➔</span>
                    <span>Córdoba</span>
                  </div>
                </div>

                <div className="summary-details">
                  <div className="summary-item">
                    <span>Costo de envío</span>
                    <span>$2.950</span>
                  </div>
                  <div className="summary-item insurance-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={() => setIncludeInsurance(!includeInsurance)}
                        className="insurance-checkbox"
                      />
                      <span>Seguro de mercadería</span>
                    </label>
                    <span className={includeInsurance ? '' : 'strikethrough'}>$1.000</span>
                  </div>
                  <div className="summary-total">
                    <span>Total a pagar</span>
                    <span>${includeInsurance ? '3.950' : '2.950'}</span>
                  </div>
                </div>
              </div>

              <button className="btn-primary mt-2" onClick={handlePayment}>Pagar envío</button>
              <p className="secure-payment">🔒 Pago procesado por Mercado Pago</p>
            </div>
          </main>
        )}

        {/* PANTALLA: PAYMENT SUCCESS */}
        {view === 'payment-success' && (
          <main className="container animate-up">
            <div className="success-card">
              <div className="success-icon-wrap">
                <div className="success-ring"></div>
                <div className="success-icon">✓</div>
              </div>
              <h2 className="success-title">¡Envío creado con éxito!</h2>
              <p className="success-subtitle">Tu pago fue procesado correctamente</p>

              <div className="success-summary">
                <div className="success-row">
                  <span>Logística</span>
                  <strong>pickit Envío a Punto</strong>
                </div>
                <div className="success-row">
                  <span>Destino</span>
                  <strong>Córdoba</strong>
                </div>
                <div className="success-row">
                  <span>N° de seguimiento</span>
                  <strong className="tracking-num">#PK-448291</strong>
                </div>
                <div className="success-row">
                  <span>Total cobrado</span>
                  <strong>$3.950</strong>
                </div>
              </div>

              <p className="redirect-hint">Redirigiendo al dashboard…</p>
              <div className="redirect-bar"><div className="redirect-progress"></div></div>

              <button className="btn-primary mt-2" onClick={() => setView('dashboard')}>
                Ir al dashboard ahora
              </button>
            </div>
          </main>
        )}

        {/* PANTALLA 4: DASHBOARD */}
        {view === 'dashboard' && (
          <main className="container animate-up">
            <section className="promo-banner shadow-soft mb-3">
              <div className="promo-content">
                <div className="pickit-logo">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF6B00">
                    <path d="M19.5,12C19.5,16.14 16.14,19.5 12,19.5C7.86,19.5 4.5,16.14 4.5,12C4.5,7.86 7.86,4.5 12,4.5C16.14,4.5 19.5,7.86 19.5,12M21,12C21,7.03 16.97,3 12,3C7.03,3 3,7.03 3,12C3,16.97 7.03,21 12,21C16.97,21 21,16.97 21,12Z" />
                  </svg>
                  <span className="p-text">pickit</span>
                </div>
                <h2 className="off-text">50% OFF</h2>
                <p className="promo-desc">en tus primeros 20 envíos <strong>con pickit</strong></p>
              </div>
              <div className="promo-shape s1"></div>
              <div className="promo-shape s2"></div>
              <div className="promo-shape s3"></div>
            </section>

            <section className="current-shipment card shadow-soft mb-3">
              <div className="card-header">
                <h3>Envío Actual</h3>
                <span className="badge-live">LIVE</span>
              </div>
              <p className="opacity-70">En camino a destino - #PK-448291</p>
              <div className="status-bar"><div className="progress" style={{width: '65%'}}></div></div>
              <p className="text-sm opacity-50 mt-1">Última actualización: Hace 5 minutos</p>
            </section>

            <div className="dashboard-grid">
              {/* Historial de Trackings Consultados */}
              <section className="dashboard-box card shadow-soft">
                <div className="box-header">
                  <h3>Trackings Consultados</h3>
                  <button className="btn-small" onClick={() => setView('tracking-home')}>Consultar</button>
                </div>
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Costo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Andreani</strong></td>
                        <td>$4.100</td>
                        <td><span className="status-tag success">Recibido</span></td>
                      </tr>
                      <tr>
                        <td><strong>OCASA</strong></td>
                        <td>$3.500</td>
                        <td><span className="status-tag danger">Cancelado</span></td>
                      </tr>
                      <tr>
                        <td><strong>Correo Arg.</strong></td>
                        <td>$2.900</td>
                        <td><span className="status-tag success">Recibido</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Historial de Mis Envíos Realizados */}
              <section className="dashboard-box card shadow-soft">
                <div className="box-header">
                  <h3>Mis Envíos Realizados</h3>
                  <button className="btn-small">Nuevo envío</button>
                </div>
                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Destino</th>
                        <th>Total</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Andreani</strong></td>
                        <td>Córdoba</td>
                        <td>$4.250</td>
                        <td><button className="link-tracking active">Tracking ➔</button></td>
                      </tr>
                      <tr>
                        <td><strong>OCASA</strong></td>
                        <td>Rosario</td>
                        <td>$3.800</td>
                        <td><button className="link-tracking" disabled title="Solo habilitado en camino">Entregado</button></td>
                      </tr>
                      <tr>
                        <td><strong>Andreani</strong></td>
                        <td>Mendoza</td>
                        <td>$5.100</td>
                        <td><button className="link-tracking active">Tracking ➔</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Medios de Pago */}
              <section className="dashboard-box card shadow-soft">
                <div className="box-header">
                  <h3>Medios de Pago</h3>
                  <button className="btn-small">+ Agregar</button>
                </div>
                <div className="payment-methods-list">
                  <div className="payment-method">
                    <div className="p-brand visa">VISA</div>
                    <div className="p-details">
                      <p>Visa Débito •••• 8829</p>
                      <span className="badge-pill-sm">Principal</span>
                    </div>
                  </div>
                  <div className="payment-method">
                    <div className="p-brand mp">MP</div>
                    <div className="p-details">
                      <p>Mercado Pago</p>
                      <span className="badge-pill-sm opacity-50">Vinculada</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </main>
        )}

      </div>

      {/* MODAL INTERRUPCIÓN */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-up shadow">
            <h2>Para continuar, necesitás una cuenta</h2>
            <p>Registrate en segundos para gestionar tus envíos y pagos de forma segura.</p>
            <div class="modal-actions">
              <button className="btn-primary" onClick={() => {setShowModal(false); setView('register');}}>Continuar con registro</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default App;

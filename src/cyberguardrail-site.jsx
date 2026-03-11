import { useState, useEffect, useRef } from "react";

const BRAND = {
  dark: "#0f1419",
  darkAlt: "#1a2028",
  card: "#1e2730",
  cardHover: "#243039",
  accent: "#d4a853",
  accentDim: "#b8923f",
  accentGlow: "rgba(212, 168, 83, 0.12)",
  text: "#e8e4dd",
  textMuted: "#9ca3af",
  textDim: "#6b7280",
  border: "#2a3440",
  success: "#4ade80",
  danger: "#ef4444",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/* ── NAVIGATION ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useIsMobile();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "The Problem", href: "problem" },
    { label: "Services", href: "services" },
    { label: "Our Work", href: "work" },
    { label: "About", href: "about" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? "rgba(15,20,25,0.97)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${BRAND.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDim})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
            fontSize: 12, color: BRAND.dark
          }}>CG</div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 17 : 20, fontWeight: 600, color: BRAND.text, letterSpacing: "-0.02em" }}>
            CyberGuardrail
          </span>
        </a>

        {/* Desktop nav */}
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {links.map((l) => (
              <a key={l.href} href={`#${l.href}`} onClick={e => { e.preventDefault(); scrollTo(l.href); }} style={{
                color: BRAND.textMuted, textDecoration: "none", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                letterSpacing: "0.02em", transition: "color 0.2s", cursor: "pointer",
              }}
                onMouseEnter={e => e.target.style.color = BRAND.accent}
                onMouseLeave={e => e.target.style.color = BRAND.textMuted}
              >{l.label}</a>
            ))}
            <a href="https://calendly.com/cyberguardrail/20min" target="_blank" rel="noopener noreferrer" style={{
              background: BRAND.accent, color: BRAND.dark, padding: "10px 22px",
              borderRadius: 6, textDecoration: "none", fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}>Free Consultation</a>
          </div>
        )}

        {/* Mobile hamburger */}
        {mobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 8,
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            <span style={{ width: 24, height: 2, background: BRAND.text, borderRadius: 2, transition: "all 0.3s",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ width: 24, height: 2, background: BRAND.text, borderRadius: 2, transition: "all 0.3s",
              opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 24, height: 2, background: BRAND.text, borderRadius: 2, transition: "all 0.3s",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        )}
      </div>

      {/* Mobile menu dropdown */}
      {mobile && menuOpen && (
        <div style={{
          padding: "8px 0 24px", borderTop: `1px solid ${BRAND.border}`,
          display: "flex", flexDirection: "column", gap: 0,
        }}>
          {links.map((l) => (
            <a key={l.href} href={`#${l.href}`} onClick={e => { e.preventDefault(); scrollTo(l.href); setMenuOpen(false); }} style={{
              color: BRAND.textMuted, textDecoration: "none", fontSize: 16, padding: "14px 0",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderBottom: `1px solid ${BRAND.border}22`,
            }}>{l.label}</a>
          ))}
          <a href="https://calendly.com/cyberguardrail/20min" target="_blank" rel="noopener noreferrer" style={{
            background: BRAND.accent, color: BRAND.dark, padding: "14px 24px", marginTop: 12,
            borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 600, textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}>Free Consultation</a>
        </div>
      )}
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `linear-gradient(165deg, ${BRAND.dark} 0%, #0a1218 40%, #111b24 100%)`,
      position: "relative", overflow: "hidden", padding: "120px 24px 80px",
    }}>
      {/* Subtle grid bg */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${BRAND.accent} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.accent} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600,
        borderRadius: "50%", background: `radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, width: "100%" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.2s",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: BRAND.accentGlow, border: `1px solid rgba(212,168,83,0.2)`,
              borderRadius: 100, padding: "6px 16px", marginBottom: 28,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND.success, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, color: BRAND.accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                Accepting New Clients
              </span>
            </div>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(40px, 5.5vw, 68px)",
            fontWeight: 700, color: BRAND.text, lineHeight: 1.1, letterSpacing: "-0.025em",
            margin: 0, marginBottom: 24,
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s ease 0.35s",
          }}>
            Cybersecurity planning
            <br />
            <span style={{ color: BRAND.accent }}>small businesses</span>
            <br />
            can actually afford.
          </h1>

          <p style={{
            fontSize: 19, lineHeight: 1.7, color: BRAND.textMuted,
            fontFamily: "'DM Sans', sans-serif", maxWidth: 560, margin: 0, marginBottom: 40,
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease 0.5s",
          }}>
            Most SMBs can't afford a full security team — but they can't afford a breach either.
            We deliver enterprise-grade security documentation, incident response plans, and
            compliance frameworks at a fraction of the cost.
          </p>

          <div style={{
            display: "flex", gap: 16, flexWrap: "wrap",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.7s ease 0.65s",
          }}>
            <a href="https://calendly.com/cyberguardrail/20min" target="_blank" rel="noopener noreferrer" style={{
              background: BRAND.accent, color: BRAND.dark, padding: "14px 32px",
              borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 8,
              transition: "all 0.2s", boxShadow: "0 4px 20px rgba(212,168,83,0.25)",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 28px rgba(212,168,83,0.35)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(212,168,83,0.25)"; }}
            >
              Book a Free Discovery Call →
            </a>
            <a href="#services" onClick={e => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }} style={{
              background: "transparent", color: BRAND.text, padding: "14px 32px",
              borderRadius: 8, textDecoration: "none", fontSize: 16, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", border: `1px solid ${BRAND.border}`,
              transition: "all 0.2s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.target.style.borderColor = BRAND.accent; e.target.style.color = BRAND.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = BRAND.border; e.target.style.color = BRAND.text; }}
            >
              View Services
            </a>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          display: "flex", gap: 40, marginTop: 72, flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease 0.9s",
        }}>
          {[
            { label: "NIST CSF", sub: "Aligned" },
            { label: "ISO 27001", sub: "Aligned" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 3, height: 32, background: BRAND.accent, borderRadius: 2, opacity: 0.5 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text, fontFamily: "'DM Sans', sans-serif" }}>{b.label}</div>
                <div style={{ fontSize: 12, color: BRAND.textDim, fontFamily: "'DM Sans', sans-serif" }}>{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── STATS / PROBLEM ── */
function Problem() {
  const stats = [
    { number: "43%", label: "of cyberattacks target small businesses", source: "Verizon 2023 DBIR" },
    { number: "60%", label: "of SMBs close within 6 months of a cyberattack", source: "National Cyber Security Alliance" },
    { number: "$164K", label: "average cost of a data breach for small businesses", source: "IBM Cost of a Data Breach Report" },
    { number: "51%", label: "of small businesses have no cybersecurity measures at all", source: "Digital.com Survey" },
  ];

  return (
    <section id="problem" style={{ background: BRAND.darkAlt, padding: "clamp(60px, 10vw, 100px) 24px", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${BRAND.accent}44, transparent)`,
      }} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>THE REALITY</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 20px", letterSpacing: "-0.02em",
            }}>
              Small businesses are the <span style={{ color: BRAND.danger }}>biggest target</span>
              <br />with the <span style={{ color: BRAND.danger }}>least protection</span>.
            </h2>
            <p style={{
              fontSize: 17, color: BRAND.textMuted, maxWidth: 600, margin: "0 auto",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
            }}>
              Attackers know that small and midsize businesses lack dedicated security teams. 
              The numbers tell the story — and it doesn't have to be yours.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: 20 }}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{
                background: BRAND.card, border: `1px solid ${BRAND.border}`,
                borderRadius: 12, padding: "36px 28px", transition: "all 0.3s",
                cursor: "default", position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = BRAND.accent + "55";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${BRAND.accentGlow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = BRAND.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  fontSize: 48, fontWeight: 700, color: BRAND.accent,
                  fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1, marginBottom: 12,
                }}>{s.number}</div>
                <div style={{
                  fontSize: 16, color: BRAND.text, fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5, marginBottom: 16,
                }}>{s.label}</div>
                <div style={{
                  fontSize: 12, color: BRAND.textDim, fontFamily: "'DM Sans', sans-serif",
                  fontStyle: "italic",
                }}>Source: {s.source}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function Services() {
  const tiers = [
    {
      name: "Security Assessment",
      tag: "Starting point",
      price: "One-time engagement",
      description: "Understand where you stand. We evaluate your current security posture against industry frameworks and deliver a prioritized action plan.",
      deliverables: [
        "In-depth cybersecurity assessment report",
        "Risk gap analysis mapped to NIST CSF",
        "Prioritized remediation roadmap",
        "Executive summary for leadership",
      ],
      timeline: "1–2 weeks",
      cta: "Book Discovery Call",
    },
    {
      name: "Policy & Documentation",
      tag: "Most popular",
      price: "Project-based",
      description: "Get the security documentation you need — for compliance, cyber insurance, or building a real security foundation. Customized to your org, not boilerplate.",
      deliverables: [
        "Incident Response Plan",
        "Disaster Recovery Plan",
        "Patch Management Policy",
        "Custom policy documents",
        "Implementation guidance & staff templates",
      ],
      timeline: "2–3 weeks",
      cta: "Book Discovery Call",
      featured: true,
    },
    {
      name: "Hands-On Partnership",
      tag: "Full support",
      price: "Retainer or project",
      description: "For organizations that want a security partner, not just documents. We work alongside your team to implement, train, and build lasting security practices.",
      deliverables: [
        "Everything in Policy & Documentation",
        "Business Continuity Plan",
        "Tabletop exercises & incident simulations",
        "Staff security awareness training",
        "Policy updates & compliance support",
        "12-month security posture review",
        "Direct access for security questions",
      ],
      timeline: "3–4 weeks",
      cta: "Book Discovery Call",
    },
  ];

  return (
    <section id="services" style={{ background: BRAND.dark, padding: "clamp(60px, 10vw, 100px) 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>SERVICES</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 20px", letterSpacing: "-0.02em",
            }}>
              Choose the level of support <span style={{ color: BRAND.accent }}>you need</span>.
            </h2>
            <p style={{
              fontSize: 17, color: BRAND.textMuted, maxWidth: 580, margin: "0 auto",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
            }}>
              Whether you need a one-time assessment or a dedicated security partner,
              every engagement starts with a free discovery call.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24 }}>
          {tiers.map((t, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{
                background: BRAND.card,
                border: t.featured ? `2px solid ${BRAND.accent}` : `1px solid ${BRAND.border}`,
                borderRadius: 16, padding: "40px 32px", display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden", height: "100%",
                transition: "all 0.3s",
                boxShadow: t.featured ? `0 0 40px ${BRAND.accentGlow}` : "none",
              }}
                onMouseEnter={e => { if (!t.featured) { e.currentTarget.style.borderColor = BRAND.accent + "55"; e.currentTarget.style.transform = "translateY(-4px)"; } }}
                onMouseLeave={e => { if (!t.featured) { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.transform = "translateY(0)"; } }}
              >
                {t.featured && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentDim})`,
                  }} />
                )}
                <div style={{
                  display: "inline-flex", alignSelf: "flex-start",
                  background: t.featured ? BRAND.accent : BRAND.accentGlow,
                  color: t.featured ? BRAND.dark : BRAND.accent,
                  padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
                  marginBottom: 20, textTransform: "uppercase",
                }}>{t.tag}</div>

                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700,
                  color: BRAND.text, margin: "0 0 8px", letterSpacing: "-0.01em",
                }}>{t.name}</h3>
                <div style={{
                  fontSize: 14, color: BRAND.accent, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, marginBottom: 16,
                }}>{t.price} · {t.timeline}</div>
                <p style={{
                  fontSize: 15, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.65, margin: "0 0 24px",
                }}>{t.description}</p>

                <div style={{ marginBottom: 32, flex: 1 }}>
                  {t.deliverables.map((d, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10,
                    }}>
                      <span style={{ color: BRAND.accent, fontSize: 16, lineHeight: "22px", flexShrink: 0 }}>✓</span>
                      <span style={{
                        fontSize: 14, color: BRAND.text, fontFamily: "'DM Sans', sans-serif",
                        lineHeight: "22px",
                      }}>{d}</span>
                    </div>
                  ))}
                </div>

                <a href="https://calendly.com/cyberguardrail/20min" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", padding: "14px 24px", borderRadius: 8,
                  textDecoration: "none", fontSize: 15, fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  background: t.featured ? BRAND.accent : "transparent",
                  color: t.featured ? BRAND.dark : BRAND.accent,
                  border: t.featured ? "none" : `1px solid ${BRAND.accent}`,
                }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; if (!t.featured) { e.target.style.background = BRAND.accent; e.target.style.color = BRAND.dark; } }}
                  onMouseLeave={e => { e.target.style.transform = "translateY(0)"; if (!t.featured) { e.target.style.background = "transparent"; e.target.style.color = BRAND.accent; } }}
                >{t.cta}</a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── DELIVERABLES SHOWCASE ── */
function Deliverables() {
  const docs = [
    { icon: "🛡️", name: "Incident Response Plan", desc: "Step-by-step procedures for detecting, containing, and recovering from security incidents." },
    { icon: "🔄", name: "Disaster Recovery Plan", desc: "Recovery time objectives, system priorities, and restoration procedures for business-critical systems." },
    { icon: "⚙️", name: "Patch Management Policy", desc: "Systematic approach to keeping systems secure with prioritized patching timelines and accountability." },
    { icon: "📋", name: "Business Continuity Plan", desc: "Ensure critical operations continue during and after disruptions with clear roles and communication protocols." },
    { icon: "🔍", name: "Risk Assessment Report", desc: "Comprehensive evaluation of your security posture with gap analysis and prioritized remediation roadmap." },
    { icon: "🎯", name: "Tabletop Exercises", desc: "Simulated incident scenarios that test your team's readiness and reveal gaps before a real attack does." },
  ];

  return (
    <section style={{ background: BRAND.darkAlt, padding: "clamp(60px, 10vw, 100px) 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>DELIVERABLES</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 0", letterSpacing: "-0.02em",
            }}>
              Real documents. <span style={{ color: BRAND.accent }}>Real protection.</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 16 }}>
          {docs.map((d, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                display: "flex", gap: 16, padding: "24px 20px",
                borderRadius: 10, border: `1px solid ${BRAND.border}`,
                background: BRAND.card, transition: "all 0.3s", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.accent + "44"; e.currentTarget.style.background = BRAND.cardHover; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.background = BRAND.card; }}
              >
                <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{d.icon}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: BRAND.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>{d.name}</div>
                  <div style={{ fontSize: 14, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.55 }}>{d.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CASE STUDY ── */
function CaseStudy() {
  return (
    <section id="work" style={{ background: BRAND.dark, padding: "clamp(60px, 10vw, 100px) 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>CASE STUDY</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 0", letterSpacing: "-0.02em",
            }}>
              From zero documentation to <span style={{ color: BRAND.accent }}>fully prepared</span>.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.border}`,
            borderRadius: 16, padding: "clamp(24px, 5vw, 48px) clamp(20px, 4vw, 40px)", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, width: 4, height: "100%",
              background: `linear-gradient(180deg, ${BRAND.accent}, transparent)`,
            }} />

            <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
              <span style={{
                background: BRAND.accentGlow, color: BRAND.accent, padding: "4px 14px",
                borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>Ontario-based Professional Regulatory Body</span>
              <span style={{
                background: "rgba(74,222,128,0.1)", color: BRAND.success, padding: "4px 14px",
                borderRadius: 100, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>Completed via TGT Solutions</span>
            </div>

            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 700,
              color: BRAND.text, margin: "0 0 20px",
            }}>Provincial Regulatory Association · 5 Employees · 100% Remote</h3>

            <div className="two-col-grid" style={{ display: "grid", gap: 40, marginBottom: 32 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: BRAND.danger, fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  The Challenge
                </h4>
                <p style={{ fontSize: 15, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
                  No formal cybersecurity policies. Five different antivirus solutions with no central management.
                  60% of devices running end-of-life Windows 10. Unencrypted backup drives. Needed documentation
                  for cyber insurance compliance and regulatory expectations.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: BRAND.success, fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  The Solution
                </h4>
                <p style={{ fontSize: 15, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
                  Conducted a comprehensive cybersecurity assessment and delivered four executive-ready
                  policy documents — Incident Response Plan, Disaster Recovery Plan, Patch Management Policy,
                  and a detailed risk assessment report — all customized for a small, remote-first team.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { num: "4", label: "Policy documents delivered" },
                { num: "16", label: "Critical findings identified" },
                { num: "2 weeks", label: "Engagement duration" },
                { num: "100%", label: "Tailored to their operations" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: BRAND.darkAlt, borderRadius: 10, padding: "16px 24px",
                  border: `1px solid ${BRAND.border}`, flex: "1 1 140px",
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: BRAND.accent, fontFamily: "'Playfair Display', Georgia, serif" }}>{m.num}</div>
                  <div style={{ fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  return (
    <section id="about" style={{ background: BRAND.darkAlt, padding: "clamp(60px, 10vw, 100px) 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>ABOUT</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 0", letterSpacing: "-0.02em",
            }}>
              Meet <span style={{ color: BRAND.accent }}>Toroko Fuwa</span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.border}`,
            borderRadius: 16, padding: "clamp(24px, 5vw, 48px) clamp(20px, 4vw, 40px)",
          }}>
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{
                width: 100, height: 100, borderRadius: 16, flexShrink: 0,
                background: `linear-gradient(135deg, ${BRAND.accent}33, ${BRAND.accent}11)`,
                border: `2px solid ${BRAND.accent}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42,
              }}>🛡️</div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{
                  fontSize: 17, color: BRAND.text, fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.8, margin: "0 0 20px",
                }}>
                  I'm a cybersecurity consultant who helps small and midsize organizations get prepared
                  before an incident happens — not after. From security assessments and incident response planning
                  to policy development and compliance frameworks, I deliver practical, actionable protection
                  that fits your team and budget.
                </p>
                <p style={{
                  fontSize: 17, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.8, margin: "0 0 28px",
                }}>
                  With hands-on experience in NIST CSF and ISO 27001, I use AI-powered research
                  to deliver enterprise-quality work at SMB-friendly pricing. My documents are written
                  for real people — not security experts — because a policy nobody understands is a
                  policy nobody follows.
                </p>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {["NIST CSF", "ISO 27001", "Incident Response", "Risk Assessment", "AI-Powered Delivery"].map((tag, i) => (
                    <span key={i} style={{
                      background: BRAND.accentGlow, color: BRAND.accent, padding: "6px 14px",
                      borderRadius: 6, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                      border: `1px solid ${BRAND.accent}22`,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── PROCESS ── */
function Process() {
  const steps = [
    { num: "01", title: "Discovery Call", desc: "20-minute complimentary call to understand your needs, timeline, and budget. No sales pitch — just an honest assessment of how we can help.", time: "20 minutes" },
    { num: "02", title: "Scoping & Proposal", desc: "We define deliverables, timeline, and investment. You'll know exactly what you're getting before we start.", time: "1–2 days" },
    { num: "03", title: "Information Gathering", desc: "Short questionnaire about your organization, systems, and current security practices. We do the heavy lifting.", time: "2–3 days" },
    { num: "04", title: "Delivery & Review", desc: "You receive customized, executive-ready documents in editable Word format. One round of revisions included.", time: "1–3 weeks" },
  ];

  return (
    <section style={{ background: BRAND.dark, padding: "clamp(60px, 10vw, 100px) 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>PROCESS</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 0", letterSpacing: "-0.02em",
            }}>
              Simple. Transparent. <span style={{ color: BRAND.accent }}>No surprises.</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", left: 28, top: 30, bottom: 30, width: 2,
            background: `linear-gradient(180deg, ${BRAND.accent}44, ${BRAND.accent}11)`,
          }} />

          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{ display: "flex", gap: 28, marginBottom: i < steps.length - 1 ? 32 : 0, position: "relative" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                  background: BRAND.card, border: `1px solid ${BRAND.accent}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700,
                  color: BRAND.accent, position: "relative", zIndex: 1,
                }}>{s.num}</div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <h3 style={{
                      fontSize: 20, fontWeight: 700, color: BRAND.text, margin: 0,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{s.title}</h3>
                    <span style={{
                      fontSize: 12, color: BRAND.textDim, fontFamily: "'DM Sans', sans-serif",
                      background: BRAND.darkAlt, padding: "2px 10px", borderRadius: 100,
                    }}>{s.time}</span>
                  </div>
                  <p style={{
                    fontSize: 15, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.65, margin: 0,
                  }}>{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", org: "", size: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 8, fontSize: 15,
    fontFamily: "'DM Sans', sans-serif", background: BRAND.darkAlt,
    border: `1px solid ${BRAND.border}`, color: BRAND.text, outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };

  return (
    <section id="contact" style={{ background: BRAND.darkAlt, padding: "clamp(60px, 10vw, 100px) 24px", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${BRAND.accent}44, transparent)`,
      }} />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: BRAND.accent, letterSpacing: "0.12em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
            }}>GET STARTED</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700, color: BRAND.text, margin: "16px 0 16px", letterSpacing: "-0.02em",
            }}>
              Let's talk about your <span style={{ color: BRAND.accent }}>security</span>.
            </h2>
            <p style={{
              fontSize: 17, color: BRAND.textMuted, maxWidth: 500, margin: "0 auto",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7,
            }}>
              Book a free 20-minute discovery call or send a message. No pressure, no sales pitch — just an honest conversation about what you need.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          {/* Calendly placeholder */}
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.accent}44`,
            borderRadius: 12, padding: "28px 32px", marginBottom: 32,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                Prefer to schedule directly?
              </div>
              <div style={{ fontSize: 14, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                Book a free 20-minute discovery call on my calendar.
              </div>
            </div>
            <a href="#" style={{
              background: BRAND.accent, color: BRAND.dark, padding: "12px 28px",
              borderRadius: 8, textDecoration: "none", fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
              onClick={e => { window.open("https://calendly.com/cyberguardrail/20min", "_blank"); e.preventDefault(); }}
              onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}
            >
              📅 Schedule a Call
            </a>
          </div>

          {/* Contact form */}
          <div style={{
            background: BRAND.card, border: `1px solid ${BRAND.border}`,
            borderRadius: 16, padding: "clamp(24px, 5vw, 40px) clamp(20px, 4vw, 36px)",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: BRAND.text, fontFamily: "'DM Sans', sans-serif", margin: "0 0 12px" }}>
                  Message received!
                </h3>
                <p style={{ fontSize: 16, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                  I'll get back to you within 24 business hours.
                </p>
              </div>
            ) : (
              <div>
                <h3 style={{
                  fontSize: 20, fontWeight: 700, color: BRAND.text, margin: "0 0 24px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Send a message</h3>
                <div className="two-col-grid" style={{ display: "grid", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, fontWeight: 500 }}>Name *</label>
                    <input
                      style={inputStyle}
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      onFocus={e => e.target.style.borderColor = BRAND.accent}
                      onBlur={e => e.target.style.borderColor = BRAND.border}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, fontWeight: 500 }}>Email *</label>
                    <input
                      style={inputStyle}
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={e => e.target.style.borderColor = BRAND.accent}
                      onBlur={e => e.target.style.borderColor = BRAND.border}
                    />
                  </div>
                </div>
                <div className="two-col-grid" style={{ display: "grid", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, fontWeight: 500 }}>Organization</label>
                    <input
                      style={inputStyle}
                      placeholder="Company name"
                      value={form.org}
                      onChange={e => setForm({ ...form, org: e.target.value })}
                      onFocus={e => e.target.style.borderColor = BRAND.accent}
                      onBlur={e => e.target.style.borderColor = BRAND.border}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, fontWeight: 500 }}>Team size</label>
                    <select
                      style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
                      value={form.size}
                      onChange={e => setForm({ ...form, size: e.target.value })}
                      onFocus={e => e.target.style.borderColor = BRAND.accent}
                      onBlur={e => e.target.style.borderColor = BRAND.border}
                    >
                      <option value="">Select...</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, color: BRAND.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, fontWeight: 500 }}>How can I help? *</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                    placeholder="Tell me about your situation — what are you looking for?"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={e => e.target.style.borderColor = BRAND.accent}
                    onBlur={e => e.target.style.borderColor = BRAND.border}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 8, border: "none",
                    background: BRAND.accent, color: BRAND.dark, fontSize: 16, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.target.style.background = BRAND.accentDim; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.background = BRAND.accent; e.target.style.transform = "translateY(0)"; }}
                >
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{
      background: BRAND.dark, borderTop: `1px solid ${BRAND.border}`,
      padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
              fontSize: 11, color: BRAND.dark
            }}>CG</div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: BRAND.text }}>
              CyberGuardrail
            </span>
          </div>
          <p style={{ fontSize: 13, color: BRAND.textDim, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            Practical cybersecurity for small and midsize businesses.
          </p>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <a href="mailto:info@anjimanagementconsulting.com" style={{
            fontSize: 14, color: BRAND.textMuted, textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = BRAND.accent}
            onMouseLeave={e => e.target.style.color = BRAND.textMuted}
          >info@anjimanagementconsulting.com</a>
        </div>
        <div style={{ fontSize: 13, color: BRAND.textDim, fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 CyberGuardrail. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ── MAIN APP ── */
export default function App() {
  return (
    <div style={{ background: BRAND.dark, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .two-col-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .two-col-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Problem />
      <Services />
      <Deliverables />
      <CaseStudy />
      <Process />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

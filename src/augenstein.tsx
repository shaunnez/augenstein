Code

import { useState, useEffect, useRef, useCallback } from “react”;

const T = {
gold: “#b8963e”, goldLight: “#d4b36a”, goldPale: “rgba(184,150,62,0.10)”,
goldBorder: “rgba(184,150,62,0.25)”, dark: “#1a1a1a”, charcoal: “#2a2a2a”,
charcoalLight: “#555”, offWhite: “#f8f6f2”, warmWhite: “#fdfcfa”,
cream: “#f0ece4”, creamDark: “#e8e2d6”,
};

// All Pexels — free, reliable CDN, single-param URLs to avoid & encoding issues
const IMG = {
heroBg:      “https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?w=1600”,
heroRing:    “https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?w=900”,
rings:       “https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?w=800”,
watches:     “https://images.pexels.com/photos/169378/pexels-photo-169378.jpeg?w=800”,
earrings:    “https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?w=800”,
fineJewel:   “https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?w=800”,
stolenGF:    “https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?w=800”,
karenWalker: “https://images.pexels.com/photos/2697598/pexels-photo-2697598.jpeg?w=800”,
engagement:  “https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?w=800”,
watchRepair: “https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?w=800”,
};

function useInView(threshold = 0.12) {
const ref = useRef(null);
const [vis, setVis] = useState(false);
useEffect(() => {
const el = ref.current; if (!el) return;
const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } }, { threshold });
obs.observe(el); return () => obs.disconnect();
}, [threshold]);
return [ref, vis];
}

function useMediaQuery(q) {
const [m, setM] = useState(() => typeof window !== “undefined” ? window.matchMedia(q).matches : false);
useEffect(() => { const mql = window.matchMedia(q); const h = (e) => setM(e.matches); mql.addEventListener(“change”, h); setM(mql.matches); return () => mql.removeEventListener(“change”, h); }, [q]);
return m;
}

function Reveal({ children, delay = 0, style = {} }) {
const [ref, vis] = useInView(0.08);
return (<div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? “translateY(0)” : “translateY(32px)”, transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`, …style }}>{children}</div>);
}

function Diamond({ size = 10, color = T.gold }) {
return <span style={{ display: “inline-block”, width: size, height: size, background: color, transform: “rotate(45deg)”, flexShrink: 0 }} />;
}

function Sep({ light }) {
const c = light ? “rgba(255,255,255,0.25)” : T.goldBorder;
return (<div style={{ display: “flex”, alignItems: “center”, justifyContent: “center”, gap: 14, width: 100, margin: “0 auto”, marginBottom: 28 }}><div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${c})` }} /><Diamond size={6} color={light ? “rgba(255,255,255,0.5)” : T.gold} /><div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${c})` }} /></div>);
}

function Btn({ children, variant = “gold”, onClick, style: sx = {} }) {
const [h, setH] = useState(false);
const s = { gold: { bg: h ? T.goldLight : T.gold, color: “#fff”, border: “none” }, outline: { bg: h ? T.goldPale : “transparent”, color: h ? T.gold : T.charcoal, border: `1px solid ${h ? T.gold : T.charcoal}` }, outlineLight: { bg: h ? “rgba(255,255,255,0.1)” : “transparent”, color: “#fff”, border: `1px solid rgba(255,255,255,${h ? 0.7 : 0.35})` }, outlineGold: { bg: h ? T.gold : “transparent”, color: h ? “#fff” : T.gold, border: `1px solid ${T.gold}` } }[variant];
return (<button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: “14px 32px”, fontSize: 12, fontFamily: “‘Lato’,sans-serif”, fontWeight: 500, letterSpacing: “0.15em”, textTransform: “uppercase”, borderRadius: 0, cursor: “pointer”, transition: “all 0.4s ease”, background: s.bg, color: s.color, border: s.border, …sx }}>{children}</button>);
}

function SectionLabel({ children, light, style: sx = {} }) {
return <span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 11, fontWeight: 500, letterSpacing: “0.2em”, textTransform: “uppercase”, color: light ? T.goldLight : T.gold, display: “block”, marginBottom: 20, …sx }}>{children}</span>;
}

function Heading({ children, light, size, mob, style: sx = {} }) {
const defaultSize = mob ? “clamp(30px,6vw,38px)” : “clamp(36px,4vw,50px)”;
return <h2 style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: size || defaultSize, fontWeight: 500, lineHeight: 1.2, color: light ? “#fff” : T.charcoal, letterSpacing: “0.01em”, margin: 0, …sx }}>{children}</h2>;
}

function Body({ children, light, style: sx = {} }) {
return <p style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: light ? “rgba(255,255,255,0.75)” : T.charcoalLight, margin: 0, …sx }}>{children}</p>;
}

/* ═══════════════════ ENQUIRY MODAL ═══════════════════ */
function EnquiryModal({ open, onClose }) {
const [form, setForm] = useState({ name: “”, email: “”, phone: “”, type: “General enquiry”, message: “” });
const [submitted, setSubmitted] = useState(false);
const mob = useMediaQuery(”(max-width:768px)”);
useEffect(() => { if (open) { document.body.style.overflow = “hidden”; setSubmitted(false); } else document.body.style.overflow = “”; return () => { document.body.style.overflow = “”; }; }, [open]);
if (!open) return null;
const up = (k) => (e) => setForm((f) => ({ …f, [k]: e.target.value }));
const iStyle = { width: “100%”, padding: “14px 16px”, fontFamily: “‘Lato’,sans-serif”, fontSize: 14, fontWeight: 300, border: `1px solid ${T.creamDark}`, background: T.offWhite, borderRadius: 0, outline: “none”, color: T.charcoal, transition: “border-color 0.3s”, boxSizing: “border-box” };
const focus = (e) => e.target.style.borderColor = T.gold;
const blur = (e) => e.target.style.borderColor = T.creamDark;

return (
<div onClick={onClose} style={{ position: “fixed”, inset: 0, zIndex: 1000, background: “rgba(0,0,0,0.6)”, backdropFilter: “blur(6px)”, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: 20, animation: “fadeIn 0.3s ease” }}>
<div onClick={(e) => e.stopPropagation()} style={{ background: T.warmWhite, width: “100%”, maxWidth: 520, maxHeight: “90vh”, overflowY: “auto”, padding: mob ? “40px 24px” : “48px 40px”, position: “relative”, animation: “slideUp 0.4s cubic-bezier(0.22,1,0.36,1)” }}>
<button onClick={onClose} style={{ position: “absolute”, top: 16, right: 20, background: “none”, border: “none”, fontSize: 28, color: T.charcoalLight, cursor: “pointer”, fontWeight: 300, lineHeight: 1 }}>×</button>
{submitted ? (
<div style={{ textAlign: “center”, padding: “40px 0” }}>
<Diamond size={14} color={T.gold} />
<Heading mob={mob} size=“28px” style={{ marginTop: 24, marginBottom: 16 }}>Thank you</Heading>
<Body>We’ll be in touch shortly. Feel free to call us on (09) 479 4391 if your enquiry is urgent.</Body>
</div>
) : (
<>
<div style={{ textAlign: “center”, marginBottom: 32 }}>
<Sep />
<Heading mob={mob} size=“30px” style={{ marginBottom: 12 }}>Make an Enquiry</Heading>
<Body style={{ fontSize: 14 }}>We’d love to hear from you. Fill in the form below and we’ll get back to you promptly.</Body>
</div>
<div style={{ display: “flex”, flexDirection: “column”, gap: 14 }}>
<input placeholder=“Your name *” value={form.name} onChange={up(“name”)} style={iStyle} onFocus={focus} onBlur={blur} />
<div style={{ display: “grid”, gridTemplateColumns: mob ? “1fr” : “1fr 1fr”, gap: 14 }}>
<input placeholder=“Email *” value={form.email} onChange={up(“email”)} style={iStyle} onFocus={focus} onBlur={blur} />
<input placeholder=“Phone” value={form.phone} onChange={up(“phone”)} style={iStyle} onFocus={focus} onBlur={blur} />
</div>
<select value={form.type} onChange={up(“type”)} style={{ …iStyle, appearance: “none”, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: “no-repeat”, backgroundPosition: “right 16px center” }}>
{[“General enquiry”, “Jewellery”, “Watch sales or service”, “Repair or restoration”, “Custom design or remodel”, “Engagement or special occasion”, “Valuation”].map(o => <option key={o}>{o}</option>)}
</select>
<textarea placeholder=“Tell us how we can help…” value={form.message} onChange={up(“message”)} rows={4} style={{ …iStyle, resize: “vertical”, fontFamily: “‘Lato’,sans-serif” }} onFocus={focus} onBlur={blur} />
<Btn variant=“gold” onClick={() => setSubmitted(true)} style={{ width: “100%”, marginTop: 4, padding: “16px” }}>Send Enquiry</Btn>
<p style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 12, color: T.charcoalLight, textAlign: “center”, opacity: 0.6, margin: 0 }}>Or call us directly: <a href=“tel:+6494794391” style={{ color: T.gold, textDecoration: “none” }}>(09) 479 4391</a></p>
</div>
</>
)}
</div>
</div>
);
}

/* ═══════════════════ HEADER — no phone number ═══════════════════ */
function Header({ onEnquire }) {
const [scrolled, setScrolled] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const mob = useMediaQuery(”(max-width:768px)”);
useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener(“scroll”, fn); return () => window.removeEventListener(“scroll”, fn); }, []);
const navItems = [{ label: “Products”, href: “#products” }, { label: “Services”, href: “#services” }, { label: “Repairs”, href: “#repairs” }, { label: “About”, href: “#about” }, { label: “Visit”, href: “#visit” }];

return (
<>
<header style={{ position: “fixed”, top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? “rgba(253,252,250,0.97)” : “rgba(26,26,26,0.3)”, backdropFilter: “blur(12px)”, WebkitBackdropFilter: “blur(12px)”, borderBottom: scrolled ? `1px solid ${T.goldBorder}` : “1px solid rgba(255,255,255,0.08)”, transition: “all 0.5s ease” }}>
<div style={{ maxWidth: 1260, margin: “0 auto”, padding: mob ? “14px 20px” : “16px 40px”, display: “flex”, alignItems: “center”, justifyContent: “space-between” }}>
<a href=”#” style={{ textDecoration: “none” }}>
<span style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: mob ? 22 : 26, fontWeight: 600, color: scrolled ? T.charcoal : “#fff”, letterSpacing: “0.04em”, transition: “color 0.5s” }}>Augenstein’s</span>
<span style={{ display: “block”, fontFamily: “‘Lato’,sans-serif”, fontSize: 8, fontWeight: 400, letterSpacing: “0.24em”, textTransform: “uppercase”, color: T.gold, marginTop: -2 }}>Jeweller & Watchmaker · Est. 1989</span>
</a>
{!mob && (
<nav style={{ display: “flex”, gap: 28, alignItems: “center” }}>
{navItems.map((n) => (<a key={n.label} href={n.href} style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 11.5, fontWeight: 400, letterSpacing: “0.12em”, textTransform: “uppercase”, color: scrolled ? T.charcoalLight : “rgba(255,255,255,0.8)”, textDecoration: “none”, transition: “color 0.3s”, padding: “4px 0” }} onMouseEnter={(e) => e.target.style.color = T.gold} onMouseLeave={(e) => e.target.style.color = scrolled ? T.charcoalLight : “rgba(255,255,255,0.8)”}>{n.label}</a>))}
<Btn variant={scrolled ? “outlineGold” : “outlineLight”} onClick={onEnquire} style={{ padding: “10px 22px”, fontSize: 11 }}>Enquire</Btn>
</nav>
)}
{mob && (
<button onClick={() => setMenuOpen(!menuOpen)} style={{ background: “none”, border: “none”, cursor: “pointer”, padding: 8, zIndex: 101 }}>
<div style={{ width: 24, display: “flex”, flexDirection: “column”, gap: 5 }}>
<span style={{ height: 1.5, background: scrolled && !menuOpen ? T.charcoal : “#fff”, borderRadius: 1, transition: “all 0.3s”, transform: menuOpen ? “rotate(45deg) translate(4.5px,4.5px)” : “none” }} />
<span style={{ height: 1.5, background: scrolled && !menuOpen ? T.charcoal : “#fff”, borderRadius: 1, transition: “all 0.3s”, opacity: menuOpen ? 0 : 1 }} />
<span style={{ height: 1.5, background: scrolled && !menuOpen ? T.charcoal : “#fff”, borderRadius: 1, transition: “all 0.3s”, transform: menuOpen ? “rotate(-45deg) translate(4.5px,-4.5px)” : “none” }} />
</div>
</button>
)}
</div>
</header>
{mob && (
<div style={{ position: “fixed”, top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, background: T.dark, transform: menuOpen ? “translateX(0)” : “translateX(100%)”, transition: “transform 0.4s cubic-bezier(0.22,1,0.36,1)”, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, gap: 28 }}>
{navItems.map((n) => (<a key={n.label} href={n.href} onClick={() => setMenuOpen(false)} style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: 28, fontWeight: 500, color: “#fff”, textDecoration: “none” }}>{n.label}</a>))}
<div style={{ marginTop: 12 }}><Btn variant=“outlineGold” onClick={() => { setMenuOpen(false); onEnquire(); }}>Enquire Now</Btn></div>
<a href=“tel:+6494794391” style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 15, color: T.goldLight, textDecoration: “none” }}>(09) 479 4391</a>
</div>
)}
</>
);
}

/* ═══════════════════ HERO ═══════════════════ */
function Hero({ onEnquire }) {
const [loaded, setLoaded] = useState(false);
const mob = useMediaQuery(”(max-width:768px)”);
useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);

return (
<section style={{ position: “relative”, minHeight: “100vh”, display: “flex”, alignItems: “center”, overflow: “hidden”, background: T.dark }}>
<img
src={IMG.heroBg}
alt=””
onLoad={() => {}}
style={{ position: “absolute”, inset: 0, width: “100%”, height: “100%”, objectFit: “cover”, objectPosition: “center 30%”, filter: “brightness(0.30) saturate(0.7)”, opacity: loaded ? 1 : 0, transition: “opacity 1.5s ease” }}
/>
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(135deg, rgba(184,150,62,0.1) 0%, transparent 50%, rgba(184,150,62,0.05) 100%)” }} />
<div style={{ position: “absolute”, inset: 0, background: “radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)” }} />

```
  <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 1260, margin: "0 auto", padding: mob ? "130px 24px 80px" : "160px 40px 100px", display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 40 : 60, alignItems: "center" }}>
    <div>
      <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(-8px)", transition: "all 1s ease 0.2s", marginBottom: 24 }}>
        <span style={{ fontFamily: "'Lato',sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", color: T.goldLight }}>Family Owned · Browns Bay · Since 1989</span>
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? "clamp(34px,9vw,46px)" : "clamp(44px,5vw,64px)", fontWeight: 500, lineHeight: 1.12, color: "#fff", letterSpacing: "0.01em", margin: "0 0 28px", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(28px)", transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.35s" }}>
        Browns Bay's trusted{!mob && <br />} jeweller <span style={{ fontStyle: "italic", color: T.goldLight }}>&amp;</span> watchmaker
      </h1>
      <p style={{ fontFamily: "'Lato',sans-serif", fontSize: mob ? 15 : 17, fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 0 40px", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(28px)", transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.5s" }}>
        Beautiful jewellery, expert repairs, and personal service. Three generations of watchmaking expertise — Gerhard and son Gerry, with over 70 years' experience between them.
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(28px)", transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.65s" }}>
        <Btn variant="gold" onClick={() => document.getElementById("visit")?.scrollIntoView({ behavior: "smooth" })}>Visit Our Store</Btn>
        <Btn variant="outlineLight" onClick={onEnquire}>Enquire Now</Btn>
      </div>
    </div>

    {!mob && (
      <div style={{ position: "relative", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateX(40px)", transition: "all 1.2s cubic-bezier(0.22,1,0.36,1) 0.5s" }}>
        <div style={{ position: "absolute", top: -16, left: -16, right: 16, bottom: 16, border: `1px solid ${T.goldBorder}` }} />
        <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: T.cream }}>
          <img src={IMG.heroRing} alt="Fine jewellery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,26,0.35) 0%, transparent 40%)" }} />
        </div>
        <div style={{ position: "absolute", bottom: 28, left: 28 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: "italic", color: T.goldLight }}>Hand-selected fine jewellery</span>
        </div>
      </div>
    )}
  </div>

  <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: loaded ? 0.5 : 0, transition: "opacity 1.5s ease 1.5s" }}>
    <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${T.goldLight}, transparent)`, animation: "pulse 2.5s ease-in-out infinite" }} />
  </div>
  <style>{`@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
</section>
```

);
}

/* ═══════════════════ TRUST STRIP ═══════════════════ */
function TrustStrip() {
const mob = useMediaQuery(”(max-width:768px)”);
const items = [“Family Owned & Operated”, “Since 1989”, “3rd & 4th Generation Watchmakers”, “Full Workshop On-Site”, “70+ Years Combined Experience”];
return (
<div style={{ background: T.charcoal, padding: mob ? “20px 16px” : “28px 40px”, overflow: “hidden” }}>
<div style={{ display: “flex”, justifyContent: “center”, flexWrap: “wrap”, gap: mob ? “6px 16px” : “8px 40px”, maxWidth: 1100, margin: “0 auto” }}>
{items.map((t, i) => (
<div key={i} style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<Diamond size={4} color={T.gold} />
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: mob ? 9 : 11, fontWeight: 400, letterSpacing: “0.14em”, textTransform: “uppercase”, color: “rgba(255,255,255,0.75)”, whiteSpace: “nowrap” }}>{t}</span>
</div>
))}
</div>
</div>
);
}

/* ═══════════════════ ABOUT — bigger heading, more spacing ═══════════════════ */
function About() {
const mob = useMediaQuery(”(max-width:768px)”);
return (
<section id=“about” style={{ background: T.warmWhite, padding: mob ? “80px 24px” : “130px 40px” }}>
<div style={{ maxWidth: 760, margin: “0 auto”, textAlign: “center” }}>
<Reveal><Sep /></Reveal>
<Reveal delay={0.08}><SectionLabel>About Us</SectionLabel></Reveal>
<Reveal delay={0.12}><Heading mob={mob} style={{ marginBottom: 32 }}>A local jeweller built on trust, <span style={{ fontStyle: “italic” }}>craftsmanship</span>, and service</Heading></Reveal>
<Reveal delay={0.18}><Body style={{ maxWidth: 620, margin: “0 auto 16px” }}>We are a traditional family owned jewellery business that have been loyally servicing the North Shore community since 1989. Located in the main street of Browns Bay, with Gerhard and son Gerry — 3rd and 4th generation watch and clock makers — the jewellery and watch business is in our blood.</Body></Reveal>
<Reveal delay={0.22}><Body style={{ maxWidth: 620, margin: “0 auto” }}>We have a full workshop facility on site so we can repair your jewellery or watch without it normally leaving the shop. Old fashioned service and product knowledge ensure you can shop with the confidence of knowing that genuine expertise is at hand.</Body></Reveal>
</div>
</section>
);
}

/* ═══════════════════ PRODUCTS ═══════════════════ */
function ProductCard({ image, title, desc, delay = 0 }) {
const [h, setH] = useState(false);
return (
<Reveal delay={delay} style={{ height: “100%” }}>
<div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: “relative”, overflow: “hidden”, cursor: “pointer”, aspectRatio: “3/4”, background: T.cream }}>
<img src={image} alt={title} style={{ width: “100%”, height: “100%”, objectFit: “cover”, transition: “transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.6s ease”, transform: h ? “scale(1.06)” : “scale(1)”, filter: h ? “brightness(0.55)” : “brightness(0.7)” }} />
<div style={{ position: “absolute”, inset: 0, background: `linear-gradient(to top, rgba(26,26,26,${h ? 0.85 : 0.65}) 0%, transparent ${h ? "70%" : "50%"})`, transition: “all 0.6s ease” }} />
<div style={{ position: “absolute”, bottom: 0, left: 0, right: 0, padding: “24px 20px”, transform: h ? “translateY(0)” : “translateY(4px)”, transition: “transform 0.5s ease” }}>
<h3 style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: 22, fontWeight: 600, color: “#fff”, margin: “0 0 6px” }}>{title}</h3>
<p style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 13, fontWeight: 300, color: “rgba(255,255,255,0.75)”, margin: 0, lineHeight: 1.6, opacity: h ? 1 : 0, maxHeight: h ? 60 : 0, transition: “all 0.5s ease”, overflow: “hidden” }}>{desc}</p>
</div>
<div style={{ position: “absolute”, top: 14, left: 14, width: 20, height: 20, borderTop: `1.5px solid ${T.goldLight}`, borderLeft: `1.5px solid ${T.goldLight}`, opacity: h ? 1 : 0, transition: “opacity 0.5s ease” }} />
<div style={{ position: “absolute”, bottom: 14, right: 14, width: 20, height: 20, borderBottom: `1.5px solid ${T.goldLight}`, borderRight: `1.5px solid ${T.goldLight}`, opacity: h ? 1 : 0, transition: “opacity 0.5s ease” }} />
</div>
</Reveal>
);
}

function Products() {
const mob = useMediaQuery(”(max-width:768px)”);
const products = [
{ image: IMG.rings, title: “Gemstone Rings”, desc: “From simple elegance to sophisticated coloured gemstones.” },
{ image: IMG.watches, title: “Watches”, desc: “Raymond Weil, Citizen, Casio, Olympic, Roamer & Royal London.” },
{ image: IMG.fineJewel, title: “Fine Jewellery”, desc: “Earrings, necklaces, pendants, and bracelets.” },
{ image: IMG.stolenGF, title: “Stolen Girlfriends Club”, desc: “Bold, iconic New Zealand jewellery design.” },
{ image: IMG.karenWalker, title: “Karen Walker”, desc: “Distinctive contemporary jewellery from NZ’s leading designer.” },
{ image: IMG.engagement, title: “Engagement & Bridal”, desc: “Find the perfect ring for life’s biggest moment.” },
];
return (
<section id=“products” style={{ background: T.dark, padding: mob ? “80px 16px” : “130px 40px” }}>
<div style={{ maxWidth: 1260, margin: “0 auto” }}>
<Reveal>
<div style={{ textAlign: “center”, marginBottom: mob ? 48 : 72 }}>
<Sep light />
<SectionLabel light>Our Collection</SectionLabel>
<Heading light mob={mob}>Curated with <span style={{ fontStyle: “italic”, color: T.goldLight }}>care</span> and expertise</Heading>
</div>
</Reveal>
<div style={{ display: “grid”, gridTemplateColumns: mob ? “1fr 1fr” : “repeat(3, 1fr)”, gap: mob ? 10 : 20 }}>
{products.map((p, i) => <ProductCard key={i} {…p} delay={i * 0.06} />)}
</div>
<Reveal delay={0.2}><p style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 13, fontWeight: 300, color: “rgba(255,255,255,0.45)”, textAlign: “center”, marginTop: 32 }}>Hand-selected from experience — visit in store to see our full range</p></Reveal>
</div>
</section>
);
}

/* ═══════════════════ SERVICES — centered icons + headings ═══════════════════ */
function ServiceCard2({ icon, title, desc, items, delay }) {
const [h, setH] = useState(false);
const mob = useMediaQuery(”(max-width:768px)”);
return (
<Reveal delay={delay}>
<div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: mob ? “32px 20px” : “44px 36px”, background: T.warmWhite, border: `1px solid ${h ? T.goldBorder : "rgba(0,0,0,0.04)"}`, transition: “all 0.5s ease”, position: “relative”, overflow: “hidden”, textAlign: “center” }}>
<div style={{ position: “absolute”, top: 0, left: 0, right: 0, height: 2, background: T.gold, transform: h ? “scaleX(1)” : “scaleX(0)”, transition: “transform 0.5s ease”, transformOrigin: “left” }} />
<div style={{ fontSize: mob ? 30 : 36, marginBottom: 18, lineHeight: 1 }}>{icon}</div>
<h3 style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: mob ? 22 : 24, fontWeight: 600, color: T.charcoal, margin: “0 0 14px” }}>{title}</h3>
<Body style={{ fontSize: 14, marginBottom: items ? 18 : 0, textAlign: “center” }}>{desc}</Body>
{items && (
<div style={{ display: “flex”, flexWrap: “wrap”, gap: “5px 14px”, marginTop: 8, justifyContent: “center” }}>
{items.map((item, i) => (<span key={i} style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 12, fontWeight: 300, color: T.charcoalLight, display: “flex”, alignItems: “center”, gap: 6 }}><Diamond size={3} color={T.gold} /> {item}</span>))}
</div>
)}
</div>
</Reveal>
);
}

function Services() {
const mob = useMediaQuery(”(max-width:768px)”);
return (
<section id=“services” style={{ background: T.offWhite, padding: mob ? “80px 16px” : “130px 40px” }}>
<div style={{ maxWidth: 1100, margin: “0 auto” }}>
<Reveal>
<div style={{ textAlign: “center”, marginBottom: mob ? 48 : 72 }}>
<Sep />
<SectionLabel>Our Services</SectionLabel>
<Heading mob={mob}>Everything under <span style={{ fontStyle: “italic” }}>one roof</span></Heading>
</div>
</Reveal>
<div style={{ display: “grid”, gridTemplateColumns: mob ? “1fr” : “repeat(2, 1fr)”, gap: mob ? 14 : 20 }}>
<ServiceCard2 icon=“💎” title=“Jewellery” delay={0} desc=“Hand-selected pieces for everyday wear, gifting, and special occasions. As a manufacturing jeweller, we can also create to your exact requirements.” items={[“Rings”, “Necklaces”, “Earrings”, “Bracelets”, “Pendants”]} />
<ServiceCard2 icon=“⌚” title=“Watch Sales & Service” delay={0.08} desc=“Quality watches from leading brands, backed by certified watchmakers with European training. Battery replacements from $25.” items={[“Raymond Weil”, “Citizen”, “Casio”, “Olympic”, “Roamer”, “Royal London”]} />
<ServiceCard2 icon=“🔧” title=“In-House Repairs” delay={0.12} desc=“Full workshop on-site with all repairs kept secure in our safes overnight. Speak directly with the jeweller to ensure we understand your needs.” items={[“Resizing”, “Stone setting”, “Polishing”, “Chain repairs”, “Restoration”]} />
<ServiceCard2 icon=“✨” title=“Custom Design & Remodelling” delay={0.16} desc=“Transform an existing piece into something new, or work with us to design a completely bespoke creation. From engagement rings to heirloom redesigns.” items={[“Bespoke design”, “Remodelling”, “Valuations”, “Engravings”]} />
</div>
</div>
</section>
);
}

/* ═══════════════════ REPAIRS ═══════════════════ */
function Repairs({ onEnquire }) {
const mob = useMediaQuery(”(max-width:768px)”);
const repairItems = [“Batteries (under 20 min)”, “Water pressure testing”, “Full overhaul”, “Ring resizing”, “Stone replacement”, “Clock restoration”, “Rhodium plating”, “Insurance valuations”];
return (
<section id=“repairs” style={{ background: T.dark, overflow: “hidden” }}>
<div style={{ maxWidth: 1260, margin: “0 auto”, display: “grid”, gridTemplateColumns: mob ? “1fr” : “1fr 1fr” }}>
<Reveal>
<div style={{ position: “relative”, minHeight: mob ? 280 : 580, overflow: “hidden” }}>
<img src={IMG.watchRepair} alt=“Watch repair” style={{ width: “100%”, height: “100%”, objectFit: “cover”, filter: “brightness(0.8) saturate(0.9)”, position: “absolute”, inset: 0 }} />
{!mob && <div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to right, transparent 60%, rgba(26,26,26,1) 100%)” }} />}
{mob && <div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to bottom, transparent 40%, rgba(26,26,26,1) 100%)” }} />}
</div>
</Reveal>
<div style={{ display: “flex”, flexDirection: “column”, justifyContent: “center”, padding: mob ? “32px 24px 64px” : “80px 64px” }}>
<Reveal>
<SectionLabel light>Repairs & Restoration</SectionLabel>
<Heading light mob={mob} style={{ marginBottom: 28 }}>Repair, restore, or create <span style={{ fontStyle: “italic”, color: T.goldLight }}>something new</span></Heading>
</Reveal>
<Reveal delay={0.1}><Body light style={{ marginBottom: 24 }}>Watch repairs is a family affair at Augenstein’s. Both Gerhard and Gerry are certified watchmakers with European training and over 70 years’ combined experience. With a comprehensive workshop on-site and an extensive range of parts, you can trust us for prompt and expert service.</Body></Reveal>
<Reveal delay={0.15}>
<div style={{ display: “grid”, gridTemplateColumns: mob ? “1fr” : “1fr 1fr”, gap: “8px 20px”, marginBottom: 32 }}>
{repairItems.map((s, i) => (<span key={i} style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 12, fontWeight: 300, color: “rgba(255,255,255,0.6)”, display: “flex”, alignItems: “center”, gap: 8 }}><Diamond size={3} color={T.gold} /> {s}</span>))}
</div>
</Reveal>
<Reveal delay={0.2}><div><Btn variant="outlineGold" onClick={onEnquire}>Ask About Repairs</Btn></div></Reveal>
</div>
</div>
</section>
);
}

/* ═══════════════════ FEATURE / CTA ═══════════════════ */
function Feature({ onEnquire }) {
const mob = useMediaQuery(”(max-width:768px)”);
return (
<section style={{ position: “relative”, overflow: “hidden”, background: `linear-gradient(135deg, ${T.cream} 0%, ${T.offWhite} 100%)`, padding: mob ? “80px 24px” : “130px 40px” }}>
<div style={{ position: “absolute”, top: “-10%”, right: “-5%”, width: 400, height: 400, borderRadius: “50%”, border: `1px solid ${T.goldBorder}`, opacity: 0.3 }} />
<div style={{ maxWidth: 1100, margin: “0 auto”, position: “relative”, display: “grid”, gridTemplateColumns: mob ? “1fr” : “1fr 1fr”, gap: mob ? 36 : 80, alignItems: “center” }}>
<Reveal>
<div>
<Sep />
<SectionLabel>Something Special</SectionLabel>
<Heading mob={mob} style={{ marginBottom: 28 }}>Looking for the <span style={{ fontStyle: “italic” }}>perfect piece?</span></Heading>
<Body style={{ marginBottom: 36 }}>From milestone gifts to engagement rings, we can help you find something that feels right. Not only do we carry an extensive range, but as manufacturing jewellers we can create to your exact requirements. Come in and talk to us about your ideas.</Body>
<Btn variant="gold" onClick={onEnquire}>Start an Enquiry</Btn>
</div>
</Reveal>
<Reveal delay={0.15}>
<div style={{ position: “relative” }}>
{!mob && <div style={{ position: “absolute”, top: 16, left: 16, right: -16, bottom: -16, border: `1px solid ${T.goldBorder}` }} />}
<div style={{ aspectRatio: mob ? “16/10” : “4/3”, overflow: “hidden”, background: T.cream }}>
<img src={IMG.engagement} alt=“Engagement ring” style={{ width: “100%”, height: “100%”, objectFit: “cover” }} />
</div>
</div>
</Reveal>
</div>
</section>
);
}

/* ═══════════════════ WHY US ═══════════════════ */
function WhyUs() {
const mob = useMediaQuery(”(max-width:768px)”);
const points = [{ n: “35+”, label: “Years serving Browns Bay” }, { n: “70+”, label: “Years combined watchmaking experience” }, { n: “3rd & 4th”, label: “Generation watch & clock makers” }, { n: “On-Site”, label: “Full workshop facility” }];
return (
<section style={{ background: T.warmWhite, padding: mob ? “80px 24px” : “120px 40px” }}>
<div style={{ maxWidth: 1000, margin: “0 auto” }}>
<Reveal>
<div style={{ textAlign: “center”, marginBottom: mob ? 48 : 64 }}>
<Sep />
<Heading mob={mob}>Why choose <span style={{ fontStyle: “italic”, color: T.gold }}>Augenstein’s?</span></Heading>
</div>
</Reveal>
<div style={{ display: “grid”, gridTemplateColumns: mob ? “1fr 1fr” : “repeat(4, 1fr)”, gap: mob ? 24 : 40, textAlign: “center” }}>
{points.map((p, i) => (
<Reveal key={i} delay={i * 0.08}>
<div>
<span style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: mob ? 32 : 44, fontWeight: 600, color: T.gold, display: “block”, marginBottom: 10 }}>{p.n}</span>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 13, fontWeight: 300, color: T.charcoalLight, lineHeight: 1.5 }}>{p.label}</span>
</div>
</Reveal>
))}
</div>
</div>
</section>
);
}

/* ═══════════════════ VISIT / MAP ═══════════════════ */
function Visit({ onEnquire }) {
const mob = useMediaQuery(”(max-width:768px)”);
return (
<section id=“visit” style={{ background: T.offWhite }}>
<div style={{ maxWidth: 1260, margin: “0 auto”, display: “grid”, gridTemplateColumns: mob ? “1fr” : “1fr 1fr” }}>
<div style={{ padding: mob ? “64px 24px 48px” : “100px 64px”, display: “flex”, flexDirection: “column”, justifyContent: “center” }}>
<Reveal>
<Sep />
<SectionLabel style={{ marginTop: 4 }}>Visit Us</SectionLabel>
<Heading mob={mob} style={{ marginBottom: 28 }}>In the heart of <span style={{ fontStyle: “italic” }}>Browns Bay</span></Heading>
</Reveal>
<Reveal delay={0.1}><Body style={{ marginBottom: 32 }}>Come in to browse jewellery and watches, talk through a repair, or get advice from a trusted local team. We’re located at 60 Clyde Road in the main street of Browns Bay.</Body></Reveal>
<Reveal delay={0.15}>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 20, marginBottom: 36, padding: “28px 0”, borderTop: `1px solid ${T.goldBorder}`, borderBottom: `1px solid ${T.goldBorder}` }}>
<div>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 10, fontWeight: 500, letterSpacing: “0.18em”, textTransform: “uppercase”, color: T.gold, display: “block”, marginBottom: 10 }}>Address</span>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 14, fontWeight: 300, color: T.charcoalLight, lineHeight: 1.7 }}>60 Clyde Road<br />Browns Bay<br />Auckland 0630</span>
</div>
<div>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 10, fontWeight: 500, letterSpacing: “0.18em”, textTransform: “uppercase”, color: T.gold, display: “block”, marginBottom: 10 }}>Hours</span>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 14, fontWeight: 300, color: T.charcoalLight, lineHeight: 1.7 }}>Mon–Fri: 8:30am – 5:30pm<br />Sat: 9:00am – 5:00pm<br />Sun: Closed</span>
</div>
</div>
</Reveal>
<Reveal delay={0.2}>
<div style={{ display: “flex”, gap: 14, flexWrap: “wrap”, alignItems: “center” }}>
<a href=“tel:+6494794391” style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: 26, fontWeight: 600, color: T.charcoal, textDecoration: “none” }}>(09) 479 4391</a>
<Btn variant=“outlineGold” onClick={onEnquire} style={{ padding: “10px 24px” }}>Enquire</Btn>
</div>
</Reveal>
</div>
<div style={{ minHeight: mob ? 300 : 500, background: T.cream }}>
<iframe title=“Augenstein’s location” src=“https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.3!2d174.7475!3d-36.7135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d39e3c5f6b7c1%3A0x2a38b0e5e39b4c0!2s60+Clyde+Rd%2C+Browns+Bay%2C+Auckland+0630!5e0!3m2!1sen!2snz!4v1700000000000” style={{ width: “100%”, height: “100%”, minHeight: mob ? 300 : 500, border: “none”, filter: “saturate(0.8) contrast(1.05)” }} allowFullScreen loading=“lazy” />
</div>
</div>
</section>
);
}

/* ═══════════════════ FOOTER ═══════════════════ */
function Footer({ onEnquire }) {
const mob = useMediaQuery(”(max-width:768px)”);
const lnk = { fontFamily: “‘Lato’,sans-serif”, fontSize: 13, fontWeight: 300, color: “rgba(255,255,255,0.55)”, textDecoration: “none”, display: “block”, marginBottom: 9, transition: “color 0.3s”, cursor: “pointer” };
const colHead = { fontFamily: “‘Lato’,sans-serif”, fontSize: 10, fontWeight: 500, letterSpacing: “0.18em”, textTransform: “uppercase”, color: T.gold, display: “block”, marginBottom: 18 };
const hover = (e) => e.target.style.color = “rgba(255,255,255,0.9)”;
const unhover = (e) => e.target.style.color = “rgba(255,255,255,0.55)”;

return (
<footer style={{ background: T.dark, borderTop: `2px solid ${T.gold}`, padding: mob ? “48px 24px 32px” : “80px 40px 48px” }}>
<div style={{ maxWidth: 1100, margin: “0 auto”, display: “grid”, gridTemplateColumns: mob ? “1fr 1fr” : “2.5fr 1fr 1fr 1.5fr”, gap: mob ? “32px 16px” : 48 }}>
<div style={{ gridColumn: mob ? “1 / -1” : “auto” }}>
<span style={{ fontFamily: “‘Cormorant Garamond’,serif”, fontSize: 28, fontWeight: 600, color: “#fff”, display: “block”, marginBottom: 4 }}>Augenstein’s</span>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 9, fontWeight: 400, letterSpacing: “0.22em”, textTransform: “uppercase”, color: T.gold, display: “block”, marginBottom: 20 }}>Jeweller & Watchmaker · Browns Bay, Auckland</span>
<Body light style={{ fontSize: 13, maxWidth: 300, opacity: 0.5 }}>A trusted family owned business serving the North Shore community since 1989. Three generations of watchmaking expertise.</Body>
</div>
<div>
<span style={colHead}>Products</span>
{[“Fine Jewellery”, “Gemstone Rings”, “Watches”, “Karen Walker”, “Stolen Girlfriends Club”].map((s) => (<a key={s} href="#products" style={lnk} onMouseEnter={hover} onMouseLeave={unhover}>{s}</a>))}
</div>
<div>
<span style={colHead}>Services</span>
{[“Watch Repairs”, “Jewellery Repairs”, “Custom Design”, “Remodelling”, “Valuations”].map((s) => (<a key={s} href="#services" style={lnk} onMouseEnter={hover} onMouseLeave={unhover}>{s}</a>))}
</div>
<div>
<span style={colHead}>Contact</span>
<a href=“tel:+6494794391” style={{ …lnk, fontSize: 18, fontFamily: “‘Cormorant Garamond’,serif”, fontWeight: 600, color: “#fff”, marginBottom: 12 }}>(09) 479 4391</a>
<a href="mailto:augensteinsjewellers@gmail.com" style={lnk} onMouseEnter={hover} onMouseLeave={unhover}>augensteinsjewellers@gmail.com</a>
<p style={{ …lnk, cursor: “default” }}>60 Clyde Road, Browns Bay</p>
<p style={{ …lnk, cursor: “default” }}>Auckland 0630</p>
<div style={{ marginTop: 16 }}><Btn variant=“outlineGold” onClick={onEnquire} style={{ padding: “10px 22px”, fontSize: 11 }}>Enquire Now</Btn></div>
</div>
</div>
<div style={{ maxWidth: 1100, margin: “48px auto 0”, paddingTop: 24, borderTop: “1px solid rgba(255,255,255,0.06)”, display: “flex”, justifyContent: “space-between”, flexWrap: “wrap”, gap: 8 }}>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 11, fontWeight: 300, color: “rgba(255,255,255,0.25)” }}>© 2026 Augenstein’s Jewellers. All rights reserved.</span>
<span style={{ fontFamily: “‘Lato’,sans-serif”, fontSize: 11, fontWeight: 300, color: “rgba(255,255,255,0.2)” }}>Browns Bay’s trusted jeweller since 1989</span>
</div>
</footer>
);
}

/* ═══════════════════ MAIN ═══════════════════ */
export default function AugensteinsHomepage() {
const [enquiryOpen, setEnquiryOpen] = useState(false);
const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

return (
<div style={{ background: T.offWhite, minHeight: “100vh” }}>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;500&display=swap" rel="stylesheet" />
<style>{`*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden}::selection{background:rgba(184,150,62,0.25);color:${T.charcoal}}img{display:block}`}</style>
<EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
<Header onEnquire={openEnquiry} />
<Hero onEnquire={openEnquiry} />
<TrustStrip />
<About />
<Products />
<Services />
<Repairs onEnquire={openEnquiry} />
<Feature onEnquire={openEnquiry} />
<WhyUs />
<Visit onEnquire={openEnquiry} />
<Footer onEnquire={openEnquiry} />
</div>
);
}
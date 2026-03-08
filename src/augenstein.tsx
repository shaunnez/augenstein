import { useState, useEffect, useRef, useCallback, type ReactNode, type ChangeEvent } from "react";
import "./main.css";

// ─── Constants ────────────────────────────────────────────
const IMAGES = {
heroBg: "https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?w=1600",
heroRing: "https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?w=900",
customDesign: "https://images.pexels.com/photos/1616096/pexels-photo-1616096.jpeg?w=800",
engagement: "https://images.pexels.com/photos/2849742/pexels-photo-2849742.jpeg?w=800",
repairs: "https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?w=800",
estate: "https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?w=800",
valuations: "https://images.pexels.com/photos/2697598/pexels-photo-2697598.jpeg?w=800",
goldDealing: "https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?w=800",
workshop: "https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?w=800",
} as const;

const NAV_ITEMS = [
{ label: "Jewellery", href: "#products" },
{ label: "Services", href: "#services" },
{ label: "Repairs", href: "#repairs" },
{ label: "About", href: "#about" },
{ label: "Contact", href: "#contact" },
] as const;

const ENQUIRY_TYPES = [
"General enquiry",
"Custom design",
"Repair or restoration",
"Valuation",
"Estate jewellery",
"Engagement ring",
"Gold buying or selling",
] as const;

const PRODUCTS = [
{ image: IMAGES.customDesign, title: "Custom Design", desc: "Bespoke pieces crafted by hand to your exact vision." },
{ image: IMAGES.engagement, title: "Engagement Rings", desc: "Handcrafted engagement and wedding rings for life's biggest moment." },
{ image: IMAGES.repairs, title: "Repairs & Restoration", desc: "Expert repair of fine jewellery, including antique and vintage pieces." },
{ image: IMAGES.estate, title: "Estate Jewellery", desc: "Curated pre-owned and vintage pieces with character and history." },
{ image: IMAGES.valuations, title: "Valuations", desc: "Professional jewellery valuations for insurance and estate purposes." },
{ image: IMAGES.goldDealing, title: "Gold Dealing", desc: "Licensed gold dealer — fair prices for buying and selling gold." },
] as const;

const SERVICES = [
{
icon: "💎",
title: "Custom Design & Manufacturing",
desc: "As one of New Zealand's few classically trained goldsmiths, John can design and handcraft bespoke pieces to your exact specifications.",
tags: ["Bespoke rings", "Necklaces", "Remodelling", "Engravings", "Commissions"],
},
{
icon: "🔧",
title: "Repairs & Restoration",
desc: "Over 50 years of hands-on experience repairing and restoring fine jewellery, with particular expertise in antique and vintage pieces.",
tags: ["Resizing", "Stone setting", "Polishing", "Chain repairs", "Antique restoration"],
},
{
icon: "📋",
title: "Valuations & Appraisals",
desc: "Professional, thorough valuations for insurance, estate, and personal purposes from a highly experienced and qualified jeweller.",
tags: ["Insurance valuations", "Estate appraisals", "Gem identification"],
},
{
icon: "✨",
title: "Gold Dealing",
desc: "Licensed gold dealer offering fair, transparent prices. Whether you're buying or selling, you'll receive honest, expert advice.",
tags: ["Gold buying", "Gold selling", "Licensed dealer"],
},
] as const;

const REPAIR_ITEMS = [
"Ring resizing",
"Stone replacement & setting",
"Chain & clasp repairs",
"Antique restoration",
"Prong re-tipping",
"Rhodium plating",
"Engraving",
"Soldering & structural repairs",
] as const;

const STATS = [
{ number: "50+", label: "Years in the trade" },
{ number: "One of few", label: "Classically trained NZ goldsmiths" },
{ number: "35+", label: "Years serving Auckland's North Shore" },
{ number: "By Appt", label: "Personal, dedicated service" },
] as const;

const MAPS_EMBED_URL =
"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12770.0!2d174.6870!3d-36.5870!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d3a1e2f3b4c5d%3A0x1234567890abcdef!2sOrewa%2C+Auckland!5e0!3m2!1sen!2snz!4v1700000000000";

// ─── Hooks ────────────────────────────────────────────────
function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
const ref = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
const el = ref.current;
if (!el) return;

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      observer.unobserve(el);
    }
  },
  { threshold }
);

observer.observe(el);
return () => observer.disconnect();
}, [threshold]);

return [ref, isVisible];
}

function useScrolled(offset = 60): boolean {
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
const handleScroll = () => setScrolled(window.scrollY > offset);
window.addEventListener("scroll", handleScroll);
return () => window.removeEventListener("scroll", handleScroll);
}, [offset]);

return scrolled;
}

// ─── Primitives ───────────────────────────────────────────
interface RevealProps {
children: ReactNode;
delay?: number;
className?: string;
}

function Reveal({ children, delay = 0, className }: RevealProps) {
const [ref, isVisible] = useInView(0.08);

return (
<div
ref={ref}
className={className}
style={{
opacity: isVisible ? 1 : 0,
transform: isVisible ? "translateY(0)" : "translateY(32px)",
transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
}}
>
{children}
</div>
);
}

function Diamond({ size = 10, light = false }: { size?: number; light?: boolean }) {
return (
<span
className="diamond"
style={{
width: size,
height: size,
background: light ? "rgba(255,255,255,0.5)" : undefined,
}}
/>
);
}

function Separator({ light = false }: { light?: boolean }) {
return (
<div className={`separator ${light ? "separator--light" : ""}`}>
<div className="separator__line separator__line--left" />
<Diamond size={6} light={light} />
<div className="separator__line separator__line--right" />
</div>
);
}

type ButtonVariant = "gold" | "outline" | "outlineLight" | "outlineGold";

interface ButtonProps {
children: ReactNode;
variant?: ButtonVariant;
onClick?: () => void;
className?: string;
}

const VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
gold: "btn-gold",
outline: "btn-outline",
outlineLight: "btn-outline-light",
outlineGold: "btn-outline-gold",
};

function Button({ children, variant = "gold", onClick, className = "" }: ButtonProps) {
return (
<button className={`btn ${VARIANT_CLASS_MAP[variant]} ${className}`} onClick={onClick}>
{children}
</button>
);
}

// ─── Enquiry Modal ────────────────────────────────────────
interface EnquiryForm {
name: string;
email: string;
phone: string;
type: string;
message: string;
}

const INITIAL_FORM: EnquiryForm = {
name: "",
email: "",
phone: "",
type: "General enquiry",
message: "",
};

function EnquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
const [form, setForm] = useState<EnquiryForm>(INITIAL_FORM);
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
document.body.style.overflow = open ? "hidden" : "";
if (open) setSubmitted(false);
return () => { document.body.style.overflow = ""; };
}, [open]);

if (!open) return null;

const updateField = (field: keyof EnquiryForm) => (
e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

return (
<div className="modal-backdrop" onClick={onClose}>
<div className="modal" onClick={(e) => e.stopPropagation()}>
<button className="modal__close" onClick={onClose}>×</button>

    {submitted ? (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Diamond size={14} />
        <h2 className="heading heading--sm" style={{ marginTop: 24, marginBottom: 16 }}>
          Thank you
        </h2>
        <p className="body-text">
          We'll be in touch shortly. Feel free to call us on (09) 486 0250 if your enquiry is urgent.
        </p>
      </div>
    ) : (
      <>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Separator />
          <h2 className="heading heading--md" style={{ marginBottom: 12 }}>Make an Enquiry</h2>
          <p className="body-text" style={{ fontSize: 14 }}>
            We'd love to hear from you. Fill in the form below and we'll get back to you promptly.
          </p>
        </div>

        <div className="modal__form">
          <input
            className="form-input"
            placeholder="Your name *"
            value={form.name}
            onChange={updateField("name")}
          />
          <div className="modal__form-row">
            <input
              className="form-input"
              placeholder="Email *"
              value={form.email}
              onChange={updateField("email")}
            />
            <input
              className="form-input"
              placeholder="Phone"
              value={form.phone}
              onChange={updateField("phone")}
            />
          </div>
          <select
            className="form-input form-input--select"
            value={form.type}
            onChange={updateField("type")}
          >
            {ENQUIRY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <textarea
            className="form-input form-input--textarea"
            placeholder="Tell us how we can help..."
            value={form.message}
            onChange={updateField("message")}
            rows={4}
          />
          <Button
            variant="gold"
            className="btn--full-width"
            onClick={() => setSubmitted(true)}
          >
            Send Enquiry
          </Button>
          <p className="modal__footnote">
            Or call us directly:{" "}
            <a href="tel:+6494860250">(09) 486 0250</a>
          </p>
        </div>
      </>
    )}
  </div>
</div>
);
}

// ─── Header ───────────────────────────────────────────────
function Header({ onEnquire }: { onEnquire: () => void }) {
const scrolled = useScrolled();
const [menuOpen, setMenuOpen] = useState(false);

const closeAndEnquire = () => {
setMenuOpen(false);
onEnquire();
};

return (
<>
<header className={`header ${scrolled ? "header--scrolled" : ""}`}>
<div className="header__inner">
<a href="#" className="header__brand">
<span className="header__title">Innes Jewellers</span>
<span className="header__subtitle">Manufacturing Jeweller · Master Goldsmith</span>
</a>

      <nav className="header__nav">
        {NAV_ITEMS.map(({ label, href }) => (
          <a key={label} href={href} className="header__nav-link">{label}</a>
        ))}
        <Button
          variant={scrolled ? "outlineGold" : "outlineLight"}
          onClick={onEnquire}
          className="btn--header"
        >
          Enquire
        </Button>
      </nav>

      <button
        className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="hamburger__line" />
        <span className="hamburger__line" />
        <span className="hamburger__line" />
      </button>
    </div>
  </header>

  <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
    {NAV_ITEMS.map(({ label, href }) => (
      <a
        key={label}
        href={href}
        className="mobile-menu__link"
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </a>
    ))}
    <div style={{ marginTop: 12 }}>
      <Button variant="outlineGold" onClick={closeAndEnquire}>Enquire Now</Button>
    </div>
    <a href="tel:+6494860250" className="mobile-menu__phone">(09) 486 0250</a>
  </div>
</>
);
}

// ─── Hero ─────────────────────────────────────────────────
function Hero({ onEnquire }: { onEnquire: () => void }) {
const [loaded, setLoaded] = useState(false);

useEffect(() => {
const timer = setTimeout(() => setLoaded(true), 150);
return () => clearTimeout(timer);
}, []);

const animClass = (n: number) =>
`hero__animate hero__animate--${n} ${loaded ? "hero__animate--loaded" : ""}`;

return (
<section className="hero">
<img
src={IMAGES.heroBg}
alt=""
className={`hero__bg ${loaded ? "hero__bg--loaded" : ""}`}
/>
<div className="hero__overlay-gold" />
<div className="hero__overlay-vignette" />

  <div className="hero__inner">
    <div>
      <div className={animClass(1)}>
        <span className="hero__eyebrow">Master Goldsmith · Orewa · 50+ Years' Experience</span>
      </div>

      <h1 className={`hero__title ${animClass(2)}`}>
        Auckland's master goldsmith<br />
        <span className="ampersand">&amp;</span> manufacturing jeweller
      </h1>

      <p className={`hero__subtitle ${animClass(3)}`}>
        One of New Zealand's few classically trained goldsmiths, with over 50 years'
        experience. Custom design, expert repairs, valuations, and estate jewellery —
        now crafting from Orewa.
      </p>

      <div className={`hero__cta ${animClass(4)}`}>
        <Button
          variant="gold"
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        >
          Get in Touch
        </Button>
        <Button variant="outlineLight" onClick={onEnquire}>Enquire Now</Button>
      </div>
    </div>

    <div className={`hero__image-wrapper ${loaded ? "hero__image-wrapper--loaded" : ""}`}>
      <div className="hero__image-frame" />
      <div className="hero__image">
        <img src={IMAGES.heroRing} alt="Fine jewellery" />
        <div className="hero__image-overlay" />
      </div>
      <span className="hero__image-caption">Hand-selected fine jewellery</span>
    </div>
  </div>

  <div className={`hero__scroll ${loaded ? "hero__scroll--visible" : ""}`}>
    <div className="hero__scroll-line" />
  </div>
</section>
);
}

// ─── Trust Strip ──────────────────────────────────────────
const TRUST_ITEMS = [
"Master Goldsmith",
"50+ Years' Experience",
"Classically Trained",
"Licensed Gold Dealer",
"Now in Orewa",
];

function TrustStrip() {
return (
<div className="trust-strip">
<div className="trust-strip__inner">
{TRUST_ITEMS.map((text) => (
<div key={text} className="trust-strip__item">
<Diamond size={4} />
<span className="trust-strip__label">{text}</span>
</div>
))}
</div>
</div>
);
}

// ─── About ────────────────────────────────────────────────
function About() {
return (
<section id="about" className="section section--warm-white">
<div className="section__container section__container-narrow" style={{ textAlign: "center" }}>
<Reveal><Separator /></Reveal>
<Reveal delay={0.08}>
<span className="section-label">About Us</span>
</Reveal>
<Reveal delay={0.12}>
<h2 className="heading" style={{ marginBottom: 32 }}>
A master goldsmith built on <em>craftsmanship</em> and trust
</h2>
</Reveal>
<Reveal delay={0.18}>
<p className="body-text" style={{ maxWidth: 620, margin: "0 auto 16px" }}>
John Innes has been a qualified manufacturing jeweller for over 50 years and is
one of only a few classically trained goldsmiths in New Zealand. After more than
35 years serving Auckland's North Shore from Takapuna's Hurstmere Road, John now
works from beautiful Orewa.
</p>
</Reveal>
<Reveal delay={0.22}>
<p className="body-text" style={{ maxWidth: 620, margin: "0 auto" }}>
Highly experienced and skilled, John is available for custom design, repairs,
valuations, and estate jewellery. As a licensed gold dealer, he offers a
complete jewellery service with the personal attention that only comes from
working directly with the craftsman.
</p>
</Reveal>
</div>
</section>
);
}

// ─── Products ─────────────────────────────────────────────
function ProductCard({ image, title, desc, delay }: {
image: string;
title: string;
desc: string;
delay: number;
}) {
return (
<Reveal delay={delay}>
<div className="product-card">
<img src={image} alt={title} className="product-card__image" />
<div className="product-card__overlay" />
<div className="product-card__content">
<h3 className="product-card__title">{title}</h3>
<p className="product-card__desc">{desc}</p>
</div>
<div className="product-card__corner product-card__corner--tl" />
<div className="product-card__corner product-card__corner--br" />
</div>
</Reveal>
);
}

function Products() {
return (
<section id="products" className="section section--dark">
<div className="section__container section__container--wide">
<Reveal>
<div className="section__header">
<Separator light />
<span className="section-label section-label--light">Our Expertise</span>
<h2 className="heading heading--light">
Crafted with <em className="gold-light">skill</em> and decades of experience
</h2>
</div>
</Reveal>

    <div className="product-grid">
      {PRODUCTS.map((product, i) => (
        <ProductCard key={product.title} {...product} delay={i * 0.06} />
      ))}
    </div>

    <Reveal delay={0.2}>
      <p className="product-grid__footnote">
        Get in touch to discuss your jewellery needs — by appointment in Orewa
      </p>
    </Reveal>
  </div>
</section>
);
}

// ─── Services ─────────────────────────────────────────────
function ServiceCard({ icon, title, desc, tags, delay }: {
icon: string;
title: string;
desc: string;
tags: readonly string[];
delay: number;
}) {
return (
<Reveal delay={delay}>
<div className="service-card">
<div className="service-card__accent" />
<div className="service-card__icon">{icon}</div>
<h3 className="service-card__title">{title}</h3>
<p className="body-text" style={{ fontSize: 14, textAlign: "center" }}>{desc}</p>
<div className="service-card__tags">
{tags.map((tag) => (
<span key={tag} className="service-card__tag">
<Diamond size={3} /> {tag}
</span>
))}
</div>
</div>
</Reveal>
);
}

function Services() {
return (
<section id="services" className="section section--off-white">
<div className="section__container">
<Reveal>
<div className="section__header">
<Separator />
<span className="section-label">Our Services</span>
<h2 className="heading">Everything under <em>one roof</em></h2>
</div>
</Reveal>

    <div className="service-grid">
      {SERVICES.map((service, i) => (
        <ServiceCard key={service.title} {...service} delay={i * 0.08} />
      ))}
    </div>
  </div>
</section>
);
}

// ─── Repairs ──────────────────────────────────────────────
function Repairs({ onEnquire }: { onEnquire: () => void }) {
return (
<section id="repairs" className="repairs">
<div className="repairs__inner">
<Reveal>
<div className="repairs__image-wrapper">
<img src={IMAGES.workshop} alt="Jewellery workshop" className="repairs__image" />
<div className="repairs__image-fade" />
</div>
</Reveal>

    <div className="repairs__content">
      <Reveal>
        <span className="section-label section-label--light">Repairs & Restoration</span>
        <h2 className="heading heading--light" style={{ marginBottom: 28 }}>
          Repair, restore, or create{" "}
          <em className="gold-light">something new</em>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="body-text body-text--light" style={{ marginBottom: 24 }}>
          With over 50 years of hands-on experience, John has repaired and restored
          countless pieces of fine jewellery — from everyday wear to genuine antique and
          vintage treasures. His classical training and meticulous approach ensure every
          piece receives the care and expertise it deserves.
        </p>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="repairs__list">
          {REPAIR_ITEMS.map((item) => (
            <span key={item} className="repairs__list-item">
              <Diamond size={3} /> {item}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div>
          <Button variant="outlineGold" onClick={onEnquire}>Ask About Repairs</Button>
        </div>
      </Reveal>
    </div>
  </div>
</section>
);
}

// ─── Feature CTA ──────────────────────────────────────────
function Feature({ onEnquire }: { onEnquire: () => void }) {
return (
<section className="section section--cream-gradient feature">
<div className="feature__decoration feature__decoration--top" />

  <div className="feature__inner">
    <Reveal>
      <div>
        <Separator />
        <span className="section-label">Something Special</span>
        <h2 className="heading" style={{ marginBottom: 28 }}>
          Looking for the <em>perfect piece?</em>
        </h2>
        <p className="body-text" style={{ marginBottom: 36 }}>
          Whether it's an engagement ring, a milestone gift, or transforming an
          heirloom into something new — John can bring your vision to life. As a
          classically trained goldsmith, he works with you personally to design and
          handcraft a piece that's truly one of a kind.
        </p>
        <Button variant="gold" onClick={onEnquire}>Start an Enquiry</Button>
      </div>
    </Reveal>

    <Reveal delay={0.15}>
      <div className="feature__image-wrapper">
        <div className="feature__image-frame" />
        <div className="feature__image">
          <img src={IMAGES.engagement} alt="Engagement ring" />
        </div>
      </div>
    </Reveal>
  </div>
</section>
);
}

// ─── Why Us (Stats) ───────────────────────────────────────
function WhyUs() {
return (
<section className="section section--warm-white">
<div className="section__container" style={{ maxWidth: 1000 }}>
<Reveal>
<div className="section__header">
<Separator />
<h2 className="heading">
Why choose <em className="gold">Innes Jewellers?</em>
</h2>
</div>
</Reveal>

    <div className="stats-grid">
      {STATS.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.08}>
          <div>
            <span className="stat__number">{stat.number}</span>
            <span className="stat__label">{stat.label}</span>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
</section>
);
}

// ─── Visit / Map ──────────────────────────────────────────
function Visit({ onEnquire }: { onEnquire: () => void }) {
return (
<section id="contact" className="visit">
<div className="visit__inner">
<div className="visit__content">
<Reveal>
<Separator />
<span className="section-label" style={{ marginTop: 4 }}>Get in Touch</span>
<h2 className="heading" style={{ marginBottom: 28 }}>
Now crafting from <em>Orewa</em>
</h2>
</Reveal>
<Reveal delay={0.1}>
<p className="body-text" style={{ marginBottom: 32 }}>
Get in touch to discuss your jewellery needs — whether it's a custom design,
a repair, a valuation, or buying and selling gold. John works by appointment,
giving you his full, personal attention.
</p>
</Reveal>
<Reveal delay={0.15}>
<div className="visit__details">
<div>
<span className="visit__detail-label">Location</span>
<span className="visit__detail-value">
Orewa<br />Auckland
</span>
</div>
<div>
<span className="visit__detail-label">Hours</span>
<span className="visit__detail-value">
By Appointment
</span>
</div>
</div>
</Reveal>
<Reveal delay={0.2}>
<div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
<a href="tel:+6494860250" className="visit__phone">(09) 486 0250</a>
<Button variant="outlineGold" onClick={onEnquire}>Enquire</Button>
</div>
</Reveal>
</div>

    <div className="visit__map">
      <iframe
        title="Innes Jewellers location"
        src={MAPS_EMBED_URL}
        allowFullScreen
        loading="lazy"
      />
    </div>
  </div>
</section>
);
}

// ─── Footer ───────────────────────────────────────────────
function Footer({ onEnquire }: { onEnquire: () => void }) {
return (
<footer className="footer">
<div className="footer__grid">
<div className="footer__brand">
<span className="footer__brand-name">Innes Jewellers</span>
<span className="footer__brand-tagline">
Manufacturing Jeweller · Orewa, Auckland
</span>
<p style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", maxWidth: 300, margin: 0 }}>
Master goldsmith with over 50 years' experience. One of New Zealand's few
classically trained goldsmiths.
</p>
</div>

    <div>
      <span className="footer__col-title">Jewellery</span>
      {["Custom Design", "Engagement Rings", "Estate Jewellery", "Repairs & Restoration", "Valuations"].map((item) => (
        <a key={item} href="#products" className="footer__link">{item}</a>
      ))}
    </div>

    <div>
      <span className="footer__col-title">Services</span>
      {["Custom Manufacturing", "Jewellery Repairs", "Antique Restoration", "Gold Dealing", "Valuations"].map((item) => (
        <a key={item} href="#services" className="footer__link">{item}</a>
      ))}
    </div>

    <div>
      <span className="footer__col-title">Contact</span>
      <a href="tel:+6494860250" className="footer__phone">(09) 486 0250</a>
      <p className="footer__link" style={{ cursor: "default" }}>Orewa, Auckland</p>
      <p className="footer__link" style={{ cursor: "default" }}>By Appointment</p>
      <div style={{ marginTop: 16 }}>
        <Button variant="outlineGold" onClick={onEnquire}>Enquire Now</Button>
      </div>
    </div>
  </div>

  <div className="footer__bar">
    <span className="footer__bar-text">
      © {new Date().getFullYear()} Innes Jewellers. All rights reserved.
    </span>
    <span className="footer__bar-text footer__bar-text--faded">
      Auckland's master goldsmith — over 50 years' experience
    </span>
  </div>
</footer>
);
}

// ─── Page Export ───────────────────────────────────────────
export default function InnesJewellersHomepage() {
const [enquiryOpen, setEnquiryOpen] = useState(false);
const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
const closeEnquiry = useCallback(() => setEnquiryOpen(false), []);

return (
<>
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
</>
);
}
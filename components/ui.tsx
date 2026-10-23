"use client";
import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Camera as Instagram,
  MessageCircle,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { EditorialNav, EditorialFooter } from "./editorial-chrome";
import { experiences, site, faqs, priceLabel } from "../content/site";
export { ArrowUpRight, ArrowRight, MapPin, Clock, Check, Instagram };
export function Pot({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 58"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 20h22c-2 7-1 8 3 14 6 10 0 16-14 16S4 44 10 34c4-6 5-7 3-14Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <ellipse
        cx="24"
        cy="20"
        rx="11"
        ry="3.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M11 35h26M10 40h28M13 45h22M18 5c-4 4 4 5 0 9m7-12c-4 4 4 5 0 9m7-6c-4 4 4 5 0 9"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Prajapati Ceramic home">
      <Pot />
      <span>
        PRAJAPATI<small>C E R A M I C</small>
      </span>
    </a>
  );
}
function LegacyNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        A little clay. A little creativity. A memory to take home.{" "}
        <span>Kathmandu, Nepal ↗</span>
      </div>
      <header className="header">
        <div className="nav-inner">
          <Brand />
          <nav
            aria-label="Main navigation"
            className={open ? "nav open" : "nav"}
          >
            {[
              ["Home", "/"],
              ["Experiences", "/experiences"],
              ["Ceramics", "/ceramics"],
              ["Our Story", "/about"],
              ["Visit Us", "/contact"],
            ].map(([label, url]) => (
              <a key={url} href={url}>
                {label}
              </a>
            ))}
            <a className="button small" href="/booking">
              Book an experience <ArrowUpRight size={16} />
            </a>
          </nav>
          <button
            className="menu"
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Button({
  href,
  children,
  outline = false,
}: {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <a className={`button ${outline ? "outline" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={18} />
    </a>
  );
}
export function WhatsApp({
  children = "Let’s talk on WhatsApp",
  message = "Hello Prajapati Ceramic! I would like to ask about a pottery experience.",
}: {
  children?: React.ReactNode;
  message?: string;
}) {
  return (
    <a
      className="text-link"
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={17} />
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
export function Photo({
  name,
  alt,
  className = "",
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <img
        src={`/images/${name}.jpg`}
        alt={
          name.startsWith("studio-")
            ? alt
            : `${alt} — temporary reference photograph`
        }
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      {!name.startsWith("studio-") && (
        <span className="photo-label">REFERENCE IMAGE</span>
      )}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function ExperienceGrid({ all = false }: { all?: boolean }) {
  const [filter, setFilter] = useState("All experiences");
  const categories = [
    "All experiences",
    "Experiences",
    "Courses",
    "Groups & private",
  ];
  const rows = (all ? experiences : experiences.slice(0, 3)).filter(
    (e) => filter === "All experiences" || e.category === filter,
  );
  return (
    <>
      {all && (
        <div className="filters" role="group" aria-label="Filter experiences">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={filter === c ? "active" : ""}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="experience-grid">
        {rows.map((e, i) => (
          <article className="experience-card" key={e.id}>
            <a
              href={`/experiences#${e.id}`}
              className="card-image-link"
              aria-label={`Explore ${e.formal}`}
            >
              <Photo name={e.image} alt={e.formal} />
              <span className="duration">
                <Clock size={13} />
                {e.duration}
              </span>
            </a>
            <div className="card-info" id={e.id}>
              <span className="eyebrow">{e.tag}</span>
              <h3>{e.name}</h3>
              <p>{e.description}</p>
              {all && (
                <div className="experience-details">
                  <p>
                    <strong>For</strong> {e.audience}
                  </p>
                  <p>
                    <strong>Learn</strong> {e.learn}
                  </p>
                  <p>
                    <strong>Included</strong> Guided making; materials and
                    finishing options confirmed before acceptance.
                  </p>
                  <p>
                    <strong>Studio</strong> Boudha or Thamel, subject to
                    availability.
                  </p>
                </div>
              )}
              <div className="card-bottom">
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello! Please share pricing for the ${e.formal}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {priceLabel(e.price)}
                </a>
                <a
                  href={`/booking?experience=${e.id}`}
                  className="circle-link"
                  aria-label={`Book ${e.formal}`}
                >
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function FAQ() {
  return (
    <div className="faq-list">
      {faqs.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <ChevronDown size={18} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function CTA() {
  return (
    <section className="cta">
      <div className="cta-pot">
        <Pot />
      </div>
      <span className="eyebrow">YOUR HANDS. YOUR MOMENT.</span>
      <h2>
        A little messy.
        <br />
        <em>A lot of memories.</em>
      </h2>
      <p>Come as you are. We’ll meet you at the wheel.</p>
      <Button href="/booking">Book your pottery experience</Button>
      <span className="cta-caption">
        No experience needed. Just a little curiosity.
      </span>
    </section>
  );
}
function LegacyFooter() {
  return (
    <>
      <footer>
        <div className="footer-main wrap">
          <div className="footer-brand">
            <Brand />
            <p>
              Rooted in heritage.
              <br />
              Shaped by your imagination.
            </p>
            <span>Kathmandu, Nepal</span>
          </div>
          <div>
            <h4>COME CREATE</h4>
            <a href="/experiences">Pottery experiences</a>
            <a href="/custom-ceramics">Custom ceramics</a>
            <a href="/glazing-firing">Glazing & firing</a>
            <a href="/booking">Book a session</a>
          </div>
          <div>
            <h4>TAKE A LOOK AROUND</h4>
            <a href="/about">Our story</a>
            <a href="/gallery">The gallery</a>
            <a href="/blog">Clay journal</a>
            <a href="/contact">Find our studios</a>
          </div>
          <div>
            <h4>SAY NAMASTE</h4>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:+${site.whatsapp}`}>+977 9869421616</a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight size={13} />
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div className="footer-bottom wrap">
          <span>
            © {new Date().getFullYear()} Prajapati Ceramic. Made with a little
            soul.
          </span>
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/booking-terms">Booking terms</a>
            <a href="/credits">Image credits</a>
            <a href="/admin">Studio staff</a>
          </div>
        </div>
      </footer>
      <div className="mobile-book">
        <span>Make a little memory.</span>
        <a className="button small" href="/booking">
          Book a session <ArrowUpRight size={16} />
        </a>
      </div>
      <a
        className="floating-whatsapp"
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Prajapati Ceramic on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}
const galleryItems = [
  {
    image: "studio-child",
    category: "Studio moments",
    caption: "Small hands. A big little moment.",
  },
  {
    image: "studio-group",
    category: "Studio moments",
    caption: "A shared memory at Prajapati Ceramic.",
  },
  {
    image: "studio-ceramics",
    category: "Studio moments",
    caption: "A warm welcome, a little creativity.",
  },
  {
    image: "hands-clay",
    category: "At the wheel",
    caption: "The beginning of something handmade.",
  },
  {
    image: "ceramics",
    category: "Ceramics",
    caption: "Every form has its own character.",
  },
  {
    image: "pottery-wheel",
    category: "At the wheel",
    caption: "Hands in clay. Mind in the moment.",
  },
];
export function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = galleryItems.filter(
    (x) => filter === "All" || x.category === filter,
  );
  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  return (
    <>
      <div className="notice">
        Studio moments come from our official Instagram. Images marked
        “Reference image” are temporary craft photography. Watch our studio
        videos on{" "}
        <a href={site.instagram} target="_blank" rel="noopener noreferrer">
          Instagram ↗
        </a>
        .
      </div>
      <div className="filters">
        {["All", "Studio moments", "At the wheel", "Ceramics"].map((x) => (
          <button
            key={x}
            className={filter === x ? "active" : ""}
            aria-pressed={filter === x}
            onClick={() => setFilter(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {list.map((x) => (
          <button
            key={x.image}
            onClick={() => setSelected(galleryItems.indexOf(x))}
          >
            <Photo name={x.image} alt={x.caption} />
            <span>
              {x.caption}
              <ArrowUpRight size={18} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        className="lightbox"
        ref={dialog}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setSelected(null);
        }}
      >
        <button
          className="lightbox-close"
          onClick={() => setSelected(null)}
          aria-label="Close enlarged photograph"
        >
          <X />
        </button>
        {selected !== null && (
          <>
            <img
              src={`/images/${galleryItems[selected].image}.jpg`}
              alt={`${galleryItems[selected].caption} ${galleryItems[selected].image.startsWith("studio-") ? "Prajapati Ceramic studio photograph." : "Temporary reference photograph."}`}
            />
            <p>
              {galleryItems[selected].caption} ·{" "}
              {galleryItems[selected].image.startsWith("studio-")
                ? "Prajapati Ceramic"
                : "Reference image"}
            </p>
            <div className="lightbox-controls">
              <button
                onClick={() =>
                  setSelected(
                    (selected + galleryItems.length - 1) % galleryItems.length,
                  )
                }
                aria-label="Previous photograph"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() =>
                  setSelected((selected + 1) % galleryItems.length)
                }
                aria-label="Next photograph"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

// Retain the existing homepage chrome; the approved homepage preview remains separate.
export function Nav(){ const path=usePathname(); return path === "/" ? <LegacyNav/> : <EditorialNav/>; }
export function Footer(){ const path=usePathname(); return path === "/" ? <LegacyFooter/> : <EditorialFooter/>; }

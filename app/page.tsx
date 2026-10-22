import {
  Button,
  Photo,
  SectionTitle,
  ExperienceGrid,
  FAQ,
  CTA,
  Pot,
  ArrowUpRight,
  MapPin,
  Instagram,
} from "../components/ui";
import { site } from "../content/site";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="little-line" />
            ROOTED IN NEPAL. MADE BY YOU.
          </span>
          <h1>
            A little clay.
            <br />A little pause.
            <br />
            <em>A lot of soul.</em>
          </h1>
          <p>
            Experience the art of pottery in Kathmandu.
            <br />
            Slow down, get your hands in clay, and make
            <br className="desktop-break" /> something that’s a little more you.
          </p>
          <div className="hero-actions">
            <Button href="/booking">Book your pottery experience</Button>
            <a className="underlink" href="/experiences">
              Explore our experiences <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-location">
            <MapPin size={16} />
            <span>BOUDHA & THAMEL, KATHMANDU</span>
            <span className="hero-location-dot" />
            EVERYONE’S A MAKER HERE
          </div>
        </div>
        <div className="hero-visual">
          <Photo
            priority
            name="studio-child"
            alt="A young guest enjoying the pottery wheel at Prajapati Ceramic"
          />
          <div className="hero-image-wash" />
          <div className="heritage-stamp">
            <Pot />
            <span>
              MADE WITH SOUL
              <br />
              IN KATHMANDU
            </span>
          </div>
          <span className="hero-photo-caption">
            A simple moment. Something to remember.
          </span>
          <a
            href="#experiences"
            className="hero-scroll"
            aria-label="Discover our experiences"
          >
            ↓
          </a>
        </div>
      </section>
      <div className="belief-strip">
        <span>Hands-on, heart-led experiences</span>
        <i>✳</i>
        <span>A family pottery heritage</span>
        <i>✳</i>
        <span>For first-timers & forever makers</span>
        <i>✳</i>
        <span>Made slowly. Remembered always.</span>
      </div>
      <section className="intro wrap">
        <div className="intro-left">
          <span className="eyebrow">NAMASTE. COME ON IN.</span>
          <h2>
            It’s not just pottery.
            <br />
            <em>It’s an experience.</em>
          </h2>
        </div>
        <div className="intro-right">
          <p>
            Some things are better made by hand. A cup. A connection. A memory
            of Kathmandu.
          </p>
          <p className="muted">
            At Prajapati Ceramic, we share our family’s pottery heritage through
            warm, hands-on experiences. A place to be curious, create freely,
            and feel the joy of clay—one beautiful imperfection at a time.
          </p>
          <a href="/about" className="text-link">
            A little about our story <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="experiences-section" id="experiences">
        <div className="wrap">
          <SectionTitle
            eyebrow="FIND YOUR MOMENT AT THE WHEEL"
            title="There’s a little maker in everyone."
            description="An hour of curiosity or a new creative practice. Make room for something hands-on."
          >
            <a className="text-link" href="/experiences">
              All experiences <ArrowUpRight size={17} />
            </a>
          </SectionTitle>
          <ExperienceGrid />
          <p className="section-footnote">
            No experience needed · Boudha & Thamel studios · Private & group
            sessions available
          </p>
        </div>
      </section>
      <section className="story-split wrap">
        <div className="story-image">
          <Photo
            name="studio-group"
            alt="A group enjoying a shared experience at Prajapati Ceramic"
          />
          <div className="handwritten">Clay connects us.</div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">OLD ROOTS. NEW POSSIBILITIES.</span>
          <h2>
            A family craft.
            <br />
            <em>An open invitation.</em>
          </h2>
          <p>
            For generations, pottery has been part of our family’s story. Today,
            we’re shaping its next chapter with you.
          </p>
          <p className="muted">
            Our Kathmandu studios bring traditional Nepali craftsmanship into a
            welcoming creative space. We guide, engage, and motivate—so you can
            discover what your hands can do.
          </p>
          <div className="gem-inline">
            <span>
              <b>G</b>Guide
            </span>
            <span>
              <b>E</b>Engage
            </span>
            <span>
              <b>M</b>Motivate
            </span>
          </div>
          <a className="text-link" href="/about">
            Meet the story behind the clay <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="process-section">
        <div className="wrap">
          <SectionTitle
            eyebrow="FROM A LITTLE CURIOSITY TO A LITTLE CREATION"
            title="Come curious. Leave connected."
          />
          <div className="steps">
            {[
              [
                "01",
                "Find your experience",
                "Choose your session, studio, and a moment that works for you.",
              ],
              [
                "02",
                "Get your hands in clay",
                "We’ll guide you. You’ll explore. Let the making happen.",
              ],
              [
                "03",
                "Make it a memory",
                "Ask about glazing and firing to turn a suitable piece into a keepsake.",
              ],
            ].map(([n, t, p]) => (
              <div key={n}>
                <span className="step-number">{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="custom-home wrap">
        <div className="custom-home-copy">
          <span className="eyebrow">THOUGHTFULLY MADE. UNIQUELY YOURS.</span>
          <h2>
            Your story,
            <br />
            <em>shaped in clay.</em>
          </h2>
          <p>
            A signature cup for your café. A gift with someone’s name on it. A
            keepsake for a moment that matters.
          </p>
          <p className="muted">
            From custom branded tableware to deeply personal pieces, let’s make
            something meaningful.
          </p>
          <div className="stack-links">
            <a href="/custom-ceramics#business">
              For your business <ArrowUpRight size={20} />
            </a>
            <a href="/custom-ceramics#personal">
              For someone special <ArrowUpRight size={20} />
            </a>
            <a href="/glazing-firing">
              Glazing & firing services <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
        <Photo name="ceramics" alt="Handmade ceramic forms and textures" />
      </section>
      <section className="instagram-section wrap">
        <SectionTitle
          eyebrow="LIFE AT THE STUDIO"
          title="Little moments. Lasting memories."
        >
          <a
            className="text-link"
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={17} />
            @prajapaticeramic <ArrowUpRight size={17} />
          </a>
        </SectionTitle>
        <div className="image-ribbon">
          {[
            "studio-child",
            "studio-ceramics",
            "hands-clay",
            "studio-group",
          ].map((n, i) => (
            <a key={n} href="/gallery" aria-label="Explore the pottery gallery">
              <Photo
                name={n}
                alt={
                  [
                    "A young guest enjoying pottery",
                    "Visitors at Prajapati Ceramic",
                    "The rhythm of shaping clay",
                    "A group at Prajapati Ceramic",
                  ][i]
                }
              />
            </a>
          ))}
        </div>
        <p className="section-footnote">
          Studio photographs from @prajapaticeramic. Temporary craft imagery is
          labeled. Watch our studio videos on Instagram.
        </p>
      </section>
      <section className="reviews-section wrap">
        <SectionTitle
          eyebrow="A FEW WORDS FROM OUR GUESTS"
          title="The memories go home with you."
        >
          <a
            className="text-link"
            href={site.locations[1].mapUrl!}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read guest reviews on Google <ArrowUpRight size={17} />
          </a>
        </SectionTitle>
        <div className="reviews-grid">
          <article>
            <span className="review-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </span>
            <blockquote>
              “The people were very friendly And welcoming.”
            </blockquote>
            <p>
              Pooja Manandhar <span>Google review · Thamel</span>
            </p>
          </article>
          <article>
            <span className="review-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </span>
            <blockquote>“The pottery class is amazing”</blockquote>
            <p>
              Yin LAU <span>Google review · Thamel</span>
            </p>
          </article>
        </div>
      </section>
      <section className="locations-home">
        <div className="wrap">
          <SectionTitle
            eyebrow="TWO STUDIOS. THE SAME WARM WELCOME."
            title="Find us in Kathmandu."
          />
          <div className="locations-row">
            {site.studios.map((s, i) => (
              <a href={`/contact#${s.toLowerCase()}`} key={s}>
                <span className="location-number">0{i + 1}</span>
                <div>
                  <span className="eyebrow">PRAJAPATI CERAMIC</span>
                  <h3>{s} Studio</h3>
                  <span>Kathmandu, Nepal</span>
                </div>
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="faq-section wrap">
        <div>
          <span className="eyebrow">A LITTLE GOOD TO KNOW</span>
          <h2>
            Curious?
            <br />
            <em>You’re in good company.</em>
          </h2>
          <p>Have something else on your mind?</p>
          <a href="/contact" className="text-link">
            Let’s have a conversation <ArrowUpRight size={17} />
          </a>
        </div>
        <FAQ />
      </section>
      <CTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: site.fullName,
            url: site.url,
            telephone: `+${site.whatsapp}`,
            email: site.email,
            description:
              "Pottery experiences, custom ceramic products, and ceramic glazing and firing services in Kathmandu.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kathmandu",
              addressCountry: "NP",
            },
            sameAs: [site.instagram],
          }),
        }}
      />
    </>
  );
}

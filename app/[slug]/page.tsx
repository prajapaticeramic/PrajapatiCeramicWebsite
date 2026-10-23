import { EditorialPage, editorialMetadata } from "../../components/editorial-pages";
import { notFound } from "next/navigation";
import {
  Button,
  Photo,
  SectionTitle,
  ExperienceGrid,
  Gallery,
  FAQ,
  CTA,
  WhatsApp,
  ArrowUpRight,
} from "../../components/ui";
import { InquiryForm } from "../../components/forms";
import { site, articles, imageCredits } from "../../content/site";
const pages: Record<
  string,
  {
    title: string;
    eyebrow: string;
    heading: React.ReactNode;
    description: string;
  }
> = {
  about: {
    title: "Our Story & Nepali Pottery Heritage",
    eyebrow: "A FAMILY CRAFT. AN OPEN INVITATION.",
    heading: (
      <>
        Old roots.
        <br />
        <em>New possibilities.</em>
      </>
    ),
    description:
      "A pottery heritage passed through generations. A creative space to share it with the world.",
  },
  experiences: {
    title: "Pottery Classes & Experiences in Kathmandu",
    eyebrow: "THERE’S A LITTLE MAKER IN EVERYONE",
    heading: (
      <>
        Find your moment
        <br />
        <em>at the wheel.</em>
      </>
    ),
    description:
      "An hour of curiosity, an afternoon together, or a new creative practice. There’s more than one way to connect with clay.",
  },
  "custom-ceramics": {
    title: "Custom Ceramics & Personalized Keepsakes",
    eyebrow: "THOUGHTFULLY MADE. UNIQUELY YOURS.",
    heading: (
      <>
        Your story,
        <br />
        <em>shaped in clay.</em>
      </>
    ),
    description:
      "Signature tableware for your business. A meaningful keepsake for someone special. Let’s make something that feels like you.",
  },
  "glazing-firing": {
    title: "Ceramic Glazing & Kiln Firing Services",
    eyebrow: "THE NEXT CHAPTER OF YOUR CREATION",
    heading: (
      <>
        From soft clay
        <br />
        <em>to something to keep.</em>
      </>
    ),
    description:
      "Drying, glaze, and a little heat. Discover the careful process that turns a suitable handmade piece into finished ceramic.",
  },
  gallery: {
    title: "The Pottery Gallery",
    eyebrow: "LIFE IN CLAY",
    heading: (
      <>
        Little moments.
        <br />
        <em>Lasting memories.</em>
      </>
    ),
    description:
      "A glimpse of the making, the materials, and the joy of getting your hands in clay.",
  },
  blog: {
    title: "The Clay Journal",
    eyebrow: "NOTES FROM THE WHEEL",
    heading: (
      <>
        A little inspiration.
        <br />
        <em>A slower perspective.</em>
      </>
    ),
    description:
      "Stories about making, finding your creative rhythm, and experiencing Kathmandu with curious hands.",
  },
  contact: {
    title: "Visit Our Boudha & Thamel Studios",
    eyebrow: "SAY NAMASTE",
    heading: (
      <>
        Two studios.
        <br />
        <em>One warm welcome.</em>
      </>
    ),
    description:
      "Find your way to a little creative pause in Kathmandu. Have a question? We’re happy to help.",
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "YOUR INFORMATION",
    heading: <>A little clarity.</>,
    description:
      "How we handle information you choose to share with Prajapati Ceramic.",
  },
  "booking-terms": {
    title: "Booking Terms",
    eyebrow: "BEFORE YOUR VISIT",
    heading: <>A little good to know.</>,
    description:
      "Practical details for booking a pottery experience or requesting custom ceramic work.",
  },
  credits: {
    title: "Image Credits",
    eyebrow: "THE PEOPLE BEHIND THE PICTURES",
    heading: <>A little gratitude.</>,
    description:
      "Photography sources and the distinction between studio photographs and temporary reference images.",
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (editorialMetadata[slug]) return editorialMetadata[slug];
  const p = pages[slug];
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (editorialMetadata[slug]) return <EditorialPage slug={slug} />;
  const p = pages[slug];
  if (!p) notFound();
  return (
    <>
      <div className="wrap">
        <div className="page-intro">
          <a className="breadcrumb" href="/">
            Home / {slug === "about" ? "Our story" : p.title}
          </a>
          <span className="eyebrow">{p.eyebrow}</span>
          <h1>{p.heading}</h1>
          <p>{p.description}</p>
        </div>
        {slug === "about" && (
          <div className="content-section">
            <div className="split-content">
              <Photo
                name="studio-ceramics"
                alt="Guests at Prajapati Ceramic studio"
              />
              <div className="prose">
                <span className="eyebrow">ROOTED IN NEPALI CRAFTSMANSHIP</span>
                <h2>
                  A legacy, brought
                  <br />
                  to life by you.
                </h2>
                <p>
                  At Prajapati Ceramic, pottery is part of our family’s story.
                  Our work carries a respect for traditional Nepali
                  craftsmanship and a belief that a living craft grows when it
                  is shared.
                </p>
                <p>
                  We welcome travelers, local makers, couples, families, and
                  teams into our Boudha and Thamel studios. Each session is an
                  invitation to slow down, try something unfamiliar, and create
                  a memory with your own hands.
                </p>
                <p>
                  Our mission is to keep that connection to craft alive through
                  thoughtful teaching, handmade ceramics, and experiences that
                  make creativity feel accessible.
                </p>
                <WhatsApp>Meet us at the studio</WhatsApp>
              </div>
            </div>
            <SectionTitle
              eyebrow="OUR TEACHING PHILOSOPHY"
              title="A little guidance goes a long way."
              description="Our GEM approach makes space for both learning and discovery."
            />
            <div className="feature-row">
              {[
                [
                  "Guide",
                  "Clear demonstrations and practical steps help you get started with confidence.",
                ],
                [
                  "Engage",
                  "Your hands do the exploring. We encourage curiosity, questions, and a little experimentation.",
                ],
                [
                  "Motivate",
                  "We celebrate progress, encourage practice, and help you enjoy the process of making.",
                ],
              ].map(([t, d]) => (
                <div key={t}>
                  <span className="eyebrow">{t[0]} — GEM TECHNIQUE</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <div className="quote">
              <p>
                “At Prajapati Ceramic, it’s not just pottery. It’s an
                experience.”
              </p>
            </div>
            <div className="prose">
              <h2>Our story, in the news.</h2>
              <p>
                The Kathmandu Post featured founder Riya Prajapati and the story
                of bringing her family’s pottery craft into a creative space in
                Boudha. The studio’s official Instagram also shares its Lord
                Paul Enterprise Award 2024 recognition.
              </p>
              <a
                href="https://kathmandupost.com/art-culture/2025/11/10/how-a-22-year-old-revived-her-family-craft"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Kathmandu Post feature <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        )}
        {slug === "experiences" && (
          <section className="content-section">
            <ExperienceGrid all />
            <div className="notice" style={{ marginTop: 35 }}>
              We share pricing directly, so you can discuss the right experience
              for your group.{" "}
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask us on WhatsApp ↗
              </a>
              . Finishing, schedule, materials, and age suitability are
              confirmed before acceptance.
            </div>
            <SectionTitle
              eyebrow="PLAN YOUR VISIT"
              title="A little good to know."
            />
            <FAQ />
          </section>
        )}
        {slug === "custom-ceramics" && (
          <div className="content-section">
            <section className="split-content" id="business">
              <Photo
                name="ceramics"
                alt="Ceramic forms as a reference for custom tableware"
              />
              <div className="prose">
                <span className="eyebrow">FOR YOUR BUSINESS</span>
                <h2>
                  A little of your brand,
                  <br />
                  in every piece.
                </h2>
                <p>
                  Your coffee deserves a cup with character. Your table deserves
                  pieces that feel at home. We create custom ceramics for cafés,
                  restaurants, hotels, offices, and organizations.
                </p>
                <ul>
                  <li>Coffee cups, mugs, plates, and bowls</li>
                  <li>Tableware shaped around your concept</li>
                  <li>Logos and personalized brand details</li>
                  <li>Corporate gifts, merchandise, and bulk orders</li>
                </ul>
                <p>
                  Share your product, quantity, logo requirements, and preferred
                  date. We’ll discuss feasibility, samples, and a custom
                  quotation before any order is agreed.
                </p>
                <Button href="#business-inquiry">
                  Request a custom ceramic quote
                </Button>
              </div>
            </section>
            <section id="business-inquiry" style={{ paddingBottom: 70 }}>
              <InquiryForm kind="business" title="Let’s shape your brand." />
            </section>
            <section className="split-content" id="personal">
              <div className="prose">
                <span className="eyebrow">FOR SOMEONE SPECIAL</span>
                <h2>
                  Some memories
                  <br />
                  deserve a little clay.
                </h2>
                <p>
                  A name, a milestone, a moment you want to hold on to. A
                  handmade ceramic piece can carry a story that is entirely
                  yours.
                </p>
                <ul>
                  <li>Pregnancy memory vases</li>
                  <li>Personalized gifts and name-engraved pieces</li>
                  <li>Birthday and anniversary keepsakes</li>
                  <li>Custom designs for a meaningful occasion</li>
                </ul>
                <p>
                  Tell us the story behind your idea. We’ll explore the shape,
                  finish, timing, and price together.
                </p>
                <Button href="#personal-inquiry">
                  Create something personal
                </Button>
              </div>
              <Photo
                name="ceramics"
                alt="Handmade ceramic textures as a keepsake reference"
              />
            </section>
            <section id="personal-inquiry">
              <InquiryForm
                kind="personal"
                title="What would you like to remember?"
              />
            </section>
          </div>
        )}
        {slug === "glazing-firing" && (
          <div className="content-section">
            <div className="split-content">
              <Photo
                name="hands-clay"
                alt="A clay piece being formed before drying and firing"
              />
              <div className="prose">
                <h2>
                  A finish worth
                  <br />
                  waiting for.
                </h2>
                <p>
                  Glaze adds surface color and character. Kiln firing transforms
                  a suitable clay body into ceramic. Together, they take your
                  creation through an important next stage.
                </p>
                <p>
                  Workshop pieces and other handmade pottery need assessment
                  before finishing. Please share the clay body, any existing
                  glaze, dimensions, and intended use. Unknown materials may be
                  unsuitable for our kiln.
                </p>
                <p>
                  Food use depends on compatible materials, a suitable glaze and
                  firing process, and the final condition. Every handmade item
                  is not automatically food-safe. We’ll assess whether a piece
                  is appropriate for its intended use.
                </p>
                <WhatsApp message="Hello! I would like to inquire about glazing and firing.">
                  Inquire about glazing & firing
                </WhatsApp>
              </div>
            </div>
            <div className="feature-row">
              {[
                [
                  "01 / ASSESS & DRY",
                  "First, a little patience.",
                  "We assess the piece and allow it to dry properly before agreeing on a firing process.",
                ],
                [
                  "02 / FIRE & GLAZE",
                  "Color meets character.",
                  "Suitable pieces are fired and finished with compatible glaze and the appropriate kiln cycle.",
                ],
                [
                  "03 / CHECK & COLLECT",
                  "Ready for its next chapter.",
                  "We check the finished piece and agree on collection. Delivery is discussed separately.",
                ],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span className="eyebrow">{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <div className="notice">
              Timing and additional charges depend on the piece, drying
              conditions, finish, and kiln schedule. Ask us for a current
              estimate before you commit, particularly if you’re traveling.
              Collection or delivery is agreed individually. Cracking or glaze
              changes can occur during firing; the studio will discuss
              suitability and risks.
            </div>
            <div className="split-content">
              <div className="prose">
                <h2>
                  A few details
                  <br />
                  make all the difference.
                </h2>
                <p>
                  Tell us when and where the piece was made, its approximate
                  size, and whether you want a decorative finish or a piece
                  intended for food use. The more we know about the clay and
                  glaze, the better we can advise you.
                </p>
                <FAQ />
              </div>
              <InquiryForm kind="firing" title="Let’s talk finishing." />
            </div>
          </div>
        )}
        {slug === "gallery" && (
          <div className="content-section">
            <Gallery />
          </div>
        )}
        {slug === "blog" && (
          <div className="blog-grid content-section">
            {articles.map((a) => (
              <article key={a.slug}>
                <a href={`/blog/${a.slug}`}>
                  <Photo name={a.image} alt={a.title} />
                  <span className="eyebrow">{a.category}</span>
                  <h2>{a.title}</h2>
                </a>
                <p>{a.excerpt}</p>
                <a className="text-link" href={`/blog/${a.slug}`}>
                  A little more <ArrowUpRight size={16} />
                </a>
              </article>
            ))}
          </div>
        )}
        {slug === "contact" && (
          <div className="content-section">
            <div className="studio-grid">
              {site.locations.map((s) => (
                <section
                  className="studio-card"
                  id={s.name.toLowerCase()}
                  key={s.name}
                >
                  <span className="eyebrow">PRAJAPATI CERAMIC · KATHMANDU</span>
                  <h2>{s.name} Studio</h2>
                  <p>{s.address ?? `${s.name}, Kathmandu, Nepal`}</p>
                  <p>
                    {s.hours ??
                      "Please confirm your visit time with us on WhatsApp."}
                  </p>
                  <a
                    className="text-link"
                    href={
                      s.mapUrl ??
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Prajapati Pottery Studio ${s.name} Kathmandu`)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions on Google Maps <ArrowUpRight size={15} />
                  </a>
                  <a className="text-link" href={`/booking?studio=${s.name}`}>
                    Request a session <ArrowUpRight size={15} />
                  </a>
                  <iframe
                    title={`${s.name} studio on Google Maps`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`Prajapati Pottery Studio ${s.name} Kathmandu`)}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </section>
              ))}
            </div>
            <div className="split-content">
              <div className="prose">
                <span className="eyebrow">LET’S HAVE A CONVERSATION</span>
                <h2>
                  A question.
                  <br />
                  An idea. A namaste.
                </h2>
                <p>
                  Planning your first session? Organizing a group? Wondering
                  what’s possible in clay? Tell us a little about it.
                </p>
                <p>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  <br />
                  <a href="tel:+9779869421616">+977 9869421616</a>
                </p>
                <WhatsApp />
                <p style={{ marginTop: 22 }}>
                  For real studio moments, behind-the-scenes glimpses, and
                  videos, visit{" "}
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @prajapaticeramic
                  </a>
                  .
                </p>
              </div>
              <InquiryForm />
            </div>
            <SectionTitle
              eyebrow="BEFORE YOU VISIT"
              title="A little good to know."
            />
            <FAQ />
          </div>
        )}
        {slug === "privacy" && (
          <div className="prose legal">
            <h2>What we collect</h2>
            <p>
              When you submit a booking or inquiry, we collect your name, email,
              contact number, message, and any session or product details you
              provide. We use them to respond, arrange your request, and manage
              studio sessions.
            </p>
            <h3>Storage and access</h3>
            <p>
              Requests are stored in the website’s Cloudflare D1 database. Staff
              access requires an authorized ChatGPT sign-in. Your private
              tracking link shows the status and relevant session details; keep
              it private.
            </p>
            <h3>Third-party services</h3>
            <p>
              Google Maps embeds, Google Fonts, Instagram links, WhatsApp, and
              email links connect to external services. These services have
              their own privacy policies and may receive technical information
              when loaded or opened. After saving your request, we send the details you provide to FormSubmit (formsubmit.co) to forward them to prajapaticeramics@gmail.com. FormSubmit processes this information under its own privacy policy. We do not automatically send your form submission to WhatsApp or Instagram.
            </p>
            <h3>Cookies and analytics</h3>
            <p>
              The site does not run advertising analytics by default. Hosting
              and staff sign-in may use essential authentication cookies.
              Analytics can be added later with an appropriate notice and
              consent where required.
            </p>
            <h3>Retention and your requests</h3>
            <p>
              Contact <a href={`mailto:${site.email}`}>{site.email}</a> to
              request access, correction, or deletion of your information. Staff
              review retained inquiries and delete data no longer required,
              subject to applicable recordkeeping obligations. Do not include
              payment card details or sensitive personal information in
              messages.
            </p>
            <p>
              Basic spam protection uses a short-lived hash of a network
              address, a submission counter, form timing, and a hidden field. We
              do not store the raw network address in application records.
            </p>
          </div>
        )}
        {slug === "booking-terms" && (
          <div className="prose legal">
            <h2>A request comes first</h2>
            <p>
              Submitting the form creates a pending request. It does not reserve
              a place or charge a payment. The studio must accept the request
              before the reservation is confirmed. Check your private tracking
              link and contact us if you need a prompt response.
            </p>
            <h3>Pricing and arrangements</h3>
            <p>
              Contact us on WhatsApp for pricing. The studio confirms the fee,
              duration, materials, age suitability, and anything included before
              accepting your session. Glazing, firing, delivery, and other
              extras are agreed separately.
            </p>
            <h3>Changes and cancellations</h3>
            <p>
              If your plans change, contact the studio as soon as possible with
              your reference number. Any cancellation, rescheduling, or refund
              conditions will be explained by the studio before you agree to a
              paid reservation. No payment or refund is processed by this
              website.
            </p>
            <h3>Finishing your piece</h3>
            <p>
              Drying, firing, and glazing require time. Finishing suitability,
              charges, and collection or delivery arrangements must be agreed
              with the studio. Clay and glaze may change in the kiln, and pieces
              can crack. A handmade piece is not automatically suitable for food
              use.
            </p>
            <h3>Groups, children, and accessibility</h3>
            <p>
              Tell us the group size, children’s ages, and any access
              requirements before visiting. We’ll discuss suitability and
              arrangements directly. All session times shown are in Nepal time,
              UTC+5:45.
            </p>
            <h3>Custom ceramic orders</h3>
            <p>
              An inquiry is not a purchase order. Product specifications,
              samples, logo permissions, quantities, lead times, payment,
              delivery, and any revision conditions are agreed in a separate
              quotation.
            </p>
          </div>
        )}
        {slug === "credits" && (
          <div className="prose legal">
            <h2>Studio moments</h2>
            <p>
              Studio photographs are sourced from{" "}
              <a href={site.instagram}>@prajapaticeramic</a> at the business
              owner’s request. Studio media is identified separately from
              temporary reference imagery.
            </p>
            <h3>Temporary reference photography</h3>
            <p>
              Images marked “Reference image” illustrate the craft and are not
              photographs of Prajapati Ceramic’s studios, guests, or products.
              Replace them with original media when available.
            </p>
            <ul className="credits-list">
              {imageCredits.map((c) => (
                <li key={c.file}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.file} — {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {!["privacy", "booking-terms", "credits"].includes(slug) && <CTA />}
    </>
  );
}

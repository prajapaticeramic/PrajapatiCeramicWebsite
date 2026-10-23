import type { Metadata } from "next";
import { Nav, Footer } from "../components/ui";
import "./editorial.css";
import { site } from "../content/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Prajapati Ceramic | Pottery Experiences in Kathmandu",
    template: "%s | Prajapati Ceramic",
  },
  description:
    "Get your hands in clay at Prajapati Ceramic. Discover pottery experiences in Boudha and Thamel, Kathmandu, custom handmade ceramics, and glazing and firing.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.fullName,
    title: "A little clay. A lot of memories.",
    description:
      "Pottery experiences, handmade ceramics and Nepali craftsmanship in Kathmandu.",
    images: ["/images/pottery-wheel.jpg"],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

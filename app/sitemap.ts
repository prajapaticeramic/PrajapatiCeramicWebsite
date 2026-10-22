import { site, articles } from "../content/site";
export default function sitemap() {
  return [
    "",
    "/about",
    "/experiences",
    "/custom-ceramics",
    "/glazing-firing",
    "/gallery",
    "/blog",
    "/contact",
    "/booking",
    "/privacy",
    "/booking-terms",
    ...articles.map((a) => `/blog/${a.slug}`),
  ].map((path) => ({
    url: site.url + path,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}

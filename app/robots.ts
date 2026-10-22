import { site } from "../content/site";
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/booking/status"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

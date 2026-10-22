import { notFound } from "next/navigation";
import { articles } from "../../../content/site";
import { Photo, CTA } from "../../../components/ui";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = await params;
  const a = articles.find((a) => a.slug === article);
  return a
    ? {
        title: a.title,
        description: a.excerpt,
        alternates: { canonical: `/blog/${a.slug}` },
      }
    : {};
}
export default async function Article({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = await params;
  const a = articles.find((a) => a.slug === article);
  if (!a) notFound();
  return (
    <>
      <div className="wrap page-intro">
        <a className="breadcrumb" href="/blog">
          ← Back to the clay journal
        </a>
        <span className="eyebrow">{a.category}</span>
        <h1>{a.title}</h1>
        <p>{a.excerpt}</p>
      </div>
      <article className="article-body">
        <Photo name={a.image} alt={a.title} />
        {a.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <a className="text-link" href="/experiences">
          Find your pottery experience ↗
        </a>
      </article>
      <CTA />
    </>
  );
}

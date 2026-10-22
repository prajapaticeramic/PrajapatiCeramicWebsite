import { Button } from "../components/ui";
export default function NotFound() {
  return (
    <section className="wrap error-page">
      <span className="eyebrow">A LITTLE OFF THE PATH</span>
      <h1>
        This piece is
        <br />
        <em>still taking shape.</em>
      </h1>
      <p>We couldn’t find that page. Let’s get you back to the studio.</p>
      <Button href="/">Back to the homepage</Button>
    </section>
  );
}

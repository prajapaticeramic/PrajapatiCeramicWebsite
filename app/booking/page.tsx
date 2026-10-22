import { BookingForm } from "../../components/forms";
export const metadata = {
  title: "Book Your Pottery Experience",
  description:
    "Request your pottery experience in Boudha or Thamel, Kathmandu. Select a class, preferred date, and number of participants.",
  alternates: { canonical: "/booking" },
};
export default function Booking() {
  return (
    <div className="wrap">
      <div className="page-intro">
        <span className="eyebrow">LET’S MAKE A MEMORY</span>
        <h1>
          Your hands.
          <br />
          <em>Your little moment.</em>
        </h1>
        <p>Pick an experience and send a request. We’ll help with the rest.</p>
      </div>
      <BookingForm />
    </div>
  );
}

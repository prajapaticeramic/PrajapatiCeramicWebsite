import { BookingStatus } from "../../../components/forms";
export const metadata = {
  title: "Your Request Status",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function Status() {
  return (
    <>
      <div className="wrap page-intro">
        <span className="eyebrow">YOUR PRIVATE REQUEST</span>
        <h1>A little update.</h1>
      </div>
      <BookingStatus />
    </>
  );
}

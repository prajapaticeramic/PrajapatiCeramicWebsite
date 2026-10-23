import { ApprovedHome } from "../components/approved-home";
import { site } from "../content/site";
import "./approved-home.css";
export const metadata={title:{absolute:"Prajapati Ceramic | It’s Not Just Pottery. It’s an Experience."},description:"Not just a memory. Something you can use every day. Make pottery at Prajapati Ceramic in Boudha and Thamel, Kathmandu.",alternates:{canonical:"/"},openGraph:{title:"It’s not just pottery. It’s an experience.",images:["/images/studio-friends.jpg"]}};
export default function Home(){return <><ApprovedHome/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"LocalBusiness",name:site.fullName,url:site.url,telephone:`+${site.whatsapp}`,email:site.email,description:"Pottery experiences, handmade ceramics and Nepali craftsmanship in Kathmandu.",address:{"@type":"PostalAddress",addressLocality:"Kathmandu",addressCountry:"NP"},sameAs:[site.instagram]})}}/></>}

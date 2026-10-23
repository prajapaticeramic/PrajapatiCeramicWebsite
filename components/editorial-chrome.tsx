"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site } from "../content/site";
const links = [["Home", "/"], ["Experiences", "/experiences"], ["Ceramics", "/ceramics"], ["Our Story", "/about"], ["Visit Us", "/contact"]];
export function EditorialNav() {
 const [open,setOpen]=useState(false);const pathname=usePathname();
 return <header className="ed-nav"><a className="ed-brand" href="/" aria-label="Prajapati Ceramic home"><span>PRAJAPATI</span><small>CERAMIC</small></a><button type="button" className="ed-menu" aria-expanded={open} aria-controls="editorial-navigation" aria-label={open?"Close navigation":"Open navigation"} onClick={()=>setOpen(!open)}>{open?"Close":"Menu"}</button><nav id="editorial-navigation" className={open?"is-open":""} aria-label="Main navigation">{links.map(([label,url])=><a key={url} href={url} aria-current={pathname===url?"page":undefined} onClick={()=>setOpen(false)}>{label}</a>)}<a className="ed-button" href="/booking" aria-current={pathname==="/booking"?"page":undefined} onClick={()=>setOpen(false)}>Book a Session ↗</a></nav></header>;
}
export function EditorialFooter(){return <footer className="ed-footer"><div><a className="ed-brand" href="/"><span>PRAJAPATI</span><small>CERAMIC</small></a><p>Experience pottery. Discover our heritage.<br/>Create something meaningful.</p></div><nav aria-label="Footer navigation">{links.map(([label,url])=><a key={url} href={url}>{label}</a>)}<a href="/booking">Book a Session</a></nav><div><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={`mailto:${site.email}`}>{site.email}</a><p>Boudha · Thamel, Kathmandu</p></div><div className="ed-footer-bottom"><span>© {new Date().getFullYear()} Prajapati Ceramic</span><a href="/privacy">Privacy</a><a href="/booking-terms">Booking terms</a><a href="/credits">Photography</a><a href="/admin">Studio staff</a></div></footer>}

export function InquiryDisclosure({id,title,children}:{id:string;title:string;children:React.ReactNode}){
 const details=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const reveal=()=>{if(window.location.hash===`#${id}`&&details.current)details.current.open=true;};reveal();window.addEventListener("hashchange",reveal);return()=>window.removeEventListener("hashchange",reveal);},[id]);
 return <details id={id} ref={details}><summary>{title}<span aria-hidden="true">+</span></summary>{children}</details>;
}

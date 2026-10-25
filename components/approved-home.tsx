"use client";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, KeyboardEvent } from "react";
const photos=[
 ["studio-friends","Guests enjoying pottery together in the Prajapati Ceramic studio"],
 ["studio-workshop","Visitors shaping clay at pottery wheels in the studio"],
 ["studio-celebration","A group celebrating their pottery experience"],
 ["studio-making","A shared pottery session at Prajapati Ceramic"],
 ["studio-moments","Guests making pottery with the studio dog nearby"],
 ["studio-proud-maker","A guest with the pottery pieces she made"],
];
const trackLength=18;
export function ApprovedHome(){
 const [track,setTrack]=useState(6),[playing,setPlaying]=useState(true),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[visible,setVisible]=useState(true),[inView,setInView]=useState(true),[ready,setReady]=useState(false),[reduced,setReduced]=useState(false),[menu,setMenu]=useState(false),[announcement,setAnnouncement]=useState("");
 const stage=useRef<HTMLDivElement>(null),touch=useRef<{x:number;y:number;id:number}|null>(null),lastMove=useRef(0);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPlaying(false);};update();setReady(true);media.addEventListener('change',update);const visibility=()=>setVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.15});if(stage.current)observer.observe(stage.current);return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);observer.disconnect();};},[]);
 useEffect(()=>{if(!ready||!playing||hovered||focused||!visible||!inView)return;const timer=setTimeout(()=>setTrack(t=>(t+1)%trackLength),1000);return()=>clearTimeout(timer);},[track,ready,playing,hovered,focused,visible,inView]);
 function move(direction:number){if(performance.now()-lastMove.current<(reduced?50:950))return;lastMove.current=performance.now();setPlaying(false);const next=(track+direction+trackLength)%trackLength;setTrack(next);setAnnouncement(`Photograph ${next%photos.length+1} of ${photos.length}. ${photos[next%photos.length][1]}`);}
 function swipeStart(e:PointerEvent<HTMLDivElement>){if(e.pointerType!=='mouse'){touch.current={x:e.clientX,y:e.clientY,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);}}
 function swipeEnd(e:PointerEvent<HTMLDivElement>){const start=touch.current;touch.current=null;if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.3)move(dx<0?1:-1);}
 function key(e:KeyboardEvent<HTMLElement>){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}
 const index=track%photos.length;
 return <section className="approved-home" aria-label="Welcome to Prajapati Ceramic">
 <div className="ah-canvas">
  <header className="ah-header"><a className="ah-brand" href="/" aria-label="Prajapati Ceramic home"><span>PRAJAPATI</span><small>CERAMIC</small></a><button className="ah-menu" type="button" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="approved-home-nav" onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'}</button><nav className={menu?'ah-nav open':'ah-nav'} id="approved-home-nav" aria-label="Main navigation"><a href="/" aria-current="page">Home</a><a href="/experiences">Experiences</a><a href="/ceramics">Ceramics</a><a href="/about">Our Story</a><a href="/contact">Visit Us</a><a className="ah-button" href="/booking">Book a session ↗</a></nav></header>
  <div className="ah-heading"><p className="ah-eyebrow">AT PRAJAPATI CERAMIC</p><h1><span>It’s not just pottery.</span><em>It’s an experience.</em></h1><p className="ah-subtitle">Not Just a Memory. Something You Can Use Every Day.</p><a className="ah-button ah-book" href="/booking">Book your experience ↗</a></div>
  <section className="ah-gallery" aria-roledescription="carousel" aria-label="Prajapati Ceramic studio photographs" onKeyDown={key} onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(true);}} onPointerLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
   <div className="ah-stage" ref={stage} onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={()=>{touch.current=null;}}>
    {Array.from({length:trackLength},(_,i)=>{let pos=(i-track+trackLength)%trackLength;if(pos>trackLength/2)pos-=trackLength;const depth=Math.abs(pos),sign=Math.sign(pos);const photo=photos[i%photos.length];const style={"--ah-shift":`calc(var(--ah-card-width, 62.64706cqi) * ${sign*(depth?286+(depth-1)*46:0)/852})`,"--ah-mobile-shift":`${sign*(depth?28+(depth-1)*6:0)}cqi`,"--ah-scale":depth?Math.max(.4,.758-(depth-1)*.05):1,zIndex:100-depth,opacity:depth>5?0:1} as CSSProperties;return <figure style={style} data-position={pos} key={i} role="group" aria-roledescription="slide" aria-label={`${i%photos.length+1} of ${photos.length}`} aria-hidden={pos!==0}><img src={`/images/${photo[0]}.jpg`} alt={photo[1]} width={1100} height={825} draggable={false} decoding="async" fetchPriority={i===6?'high':'auto'}/></figure>;})}
   </div>
   <div className="ah-controls"><button type="button" aria-label="Previous photograph" onClick={()=>move(-1)}>←</button><span aria-hidden="true">{String(index+1).padStart(2,'0')} / 06</span><button type="button" aria-label="Next photograph" onClick={()=>move(1)}>→</button><button className="ah-toggle" type="button" aria-label={playing?'Pause automatic slideshow':'Play automatic slideshow'} onClick={()=>{if(!playing)setFocused(false);setPlaying(!playing);}}>{playing?'Ⅱ Pause':'▷ Play'}</button></div>
   <p className="ah-live" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>
 </div></section>;
}

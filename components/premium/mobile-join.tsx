'use client';
import {useEffect,useState} from 'react';
import CheckoutButton from './checkout-button';
import {ArrowUpRight,X} from 'lucide-react';
import styles from '@/app/premium/sales.module.css';
export default function MobileJoin({href,enabled,trial=false}:{href:string;enabled:boolean;trial?:boolean}){
 const [pastHero,setPastHero]=useState(false);const [dismissed,setDismissed]=useState(false);const [videoVisible,setVideoVisible]=useState(false);
 useEffect(()=>{const hero=document.getElementById('premium-hero-copy');const video=document.getElementById('premium-introduction');if(!hero||!video)return;
 const update=()=>{setPastHero(hero.getBoundingClientRect().bottom<90);const rect=video.getBoundingClientRect();setVideoVisible(rect.top<window.innerHeight&&rect.bottom>0);};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};},[]);
 if(!pastHero||dismissed||videoVisible)return null;
 return <div className={styles.mobileJoin}><div><strong>Sacco Premium</strong><span>$10/month · $100/year</span></div><CheckoutButton trial={trial} className="button" href={href}>{enabled?'Join Premium':'Sign in'}<ArrowUpRight size={16}/></CheckoutButton><button type="button" className={styles.dismissJoin} aria-label="Dismiss subscription banner" onClick={()=>setDismissed(true)}><X size={18}/></button></div>;
}

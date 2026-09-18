'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {resolveTheme,themeStorageKey,type ColorTheme} from '@/lib/theme';
const ThemeContext=createContext<{theme:ColorTheme|null;setTheme:(theme:ColorTheme)=>void}>({theme:null,setTheme:()=>{}});
export function useColorTheme(){return useContext(ThemeContext);}
export default function ThemeProvider({children}:{children:ReactNode}){
 const[theme,setCurrent]=useState<ColorTheme|null>(null);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const sync=()=>{let stored=null;try{stored=localStorage.getItem(themeStorageKey);}catch{}const next=resolveTheme(stored,media.matches);document.documentElement.dataset.theme=next;setCurrent(next);};
  const onStorage=(event:StorageEvent)=>{if(event.key===themeStorageKey||event.key===null)sync();};
  sync();media.addEventListener('change',sync);window.addEventListener('storage',onStorage);
  return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',onStorage);};
 },[]);
 function setTheme(next:ColorTheme){document.documentElement.dataset.theme=next;setCurrent(next);try{localStorage.setItem(themeStorageKey,next);}catch{/* Theme still works when browser storage is unavailable. */}}
 return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>;
}

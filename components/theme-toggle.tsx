'use client';
import {Sun,Moon} from 'lucide-react';
import {useColorTheme} from './theme-provider';
export default function ThemeToggle(){
 const{theme,setTheme}=useColorTheme();
 return <div className="theme-toggle" role="group" aria-label="Color theme"><button type="button" aria-label="Use light mode" title="Light mode" aria-pressed={theme==='light'} onClick={()=>setTheme('light')}><Sun size={18} aria-hidden="true"/></button><button type="button" aria-label="Use dark mode" title="Dark mode" aria-pressed={theme==='dark'} onClick={()=>setTheme('dark')}><Moon size={18} aria-hidden="true"/></button></div>;
}

export type ColorTheme='light'|'dark';
export const themeStorageKey='sacco-theme';
export function resolveTheme(stored:string|null,prefersDark:boolean):ColorTheme{
 return stored==='light'||stored==='dark'?stored:prefersDark?'dark':'light';
}
// Runs before paint; only the theme attribute is changed, never account/session data.
export const themeBootstrap=`(function(){var t=null;try{t=localStorage.getItem('sacco-theme')}catch(e){}var dark=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)').matches:true;document.documentElement.dataset.theme=t==='light'||t==='dark'?t:dark?'dark':'light'})()`;

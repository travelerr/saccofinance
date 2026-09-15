import type {Metadata} from 'next';
import {absoluteUrl,defaultOgImagePath} from './site';
export function pageMetadata(title:string,description:string,path:string,noindex=false):Metadata{return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | Sacco Financial`,description,url:absoluteUrl(path),type:'website',images:[defaultOgImagePath]},twitter:{card:'summary_large_image',title:`${title} | Sacco Financial`,description,images:[defaultOgImagePath]},...(noindex?{robots:{index:false,follow:false}}:{})};}

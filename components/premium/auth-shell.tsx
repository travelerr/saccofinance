import PremiumNavigation from './navigation';
import type {ReactNode} from 'react';
import {Eyebrow} from '@/components/brand/editorial';
import './auth.css';
export default function AuthShell({title,description,children,productNavigation=false}:{title:string;description:string;children:ReactNode;productNavigation?:boolean}){
 return <main id="main-content" className="container premium-auth">{productNavigation&&<PremiumNavigation/>}<section className="page-hero"><Eyebrow>Sacco Premium / Member access</Eyebrow><h1>{title}</h1><p>{description}</p></section><div className="premium-auth-body">{children}</div></main>;
}

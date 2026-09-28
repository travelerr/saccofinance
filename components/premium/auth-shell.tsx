import type {ReactNode} from 'react';
import {Eyebrow} from '@/components/brand/editorial';
import './auth.css';
export default function AuthShell({title,description,children}:{title:string;description:string;children:ReactNode}){
 return <main id="main-content" className="container premium-auth"><section className="page-hero"><Eyebrow>Sacco Premium / Member access</Eyebrow><h1>{title}</h1><p>{description}</p></section><div className="premium-auth-body">{children}</div></main>;
}

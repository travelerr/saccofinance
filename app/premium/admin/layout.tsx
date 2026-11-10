import type {ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {requireOffersAdmin} from './offers/access';
import AdminNavigation from '@/components/premium/admin-navigation';
export default async function AdminLayout({children}:{children:ReactNode}){
 try{await requireOffersAdmin();}catch{notFound();}
 return <><AdminNavigation/>{children}</>;
}

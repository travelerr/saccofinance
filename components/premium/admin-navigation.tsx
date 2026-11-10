'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import './admin-navigation.css';
const destinations=[
 ['Analytics','/premium/admin/analytics'],
 ['Notifications','/premium/admin/notifications'],
 ['Sample requests','/premium/admin/leads'],
 ['Membership offers','/premium/admin/offers'],
 ['Outlook email preview','/premium/admin/outlook-008-preview'],
] as const;
export default function AdminNavigation(){
 const pathname=usePathname();
 return <div className="premium-admin-bar"><div className="container premium-admin-bar-inner"><span className="premium-admin-label">Admin</span><nav aria-label="Premium administration">{destinations.map(([label,href])=><Link key={href} href={href} aria-current={pathname===href||pathname.startsWith(href+'/')?'page':undefined}>{label}</Link>)}</nav></div></div>;
}

import {requirePremium} from '@/lib/premium-access';
import ToolsIUse from '@/components/premium/tools-i-use';
import './tools.css';
export const metadata={title:'Tools I Use | Sacco Premium',robots:{index:false,follow:false}};
export default async function ToolsPage(){
 await requirePremium();
 return <main id="main-content" className="container premium-tools-page"><h1>Tools I Use</h1><ToolsIUse/></main>;
}

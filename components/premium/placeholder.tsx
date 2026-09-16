import {Eyebrow} from '@/components/brand/editorial';
import PremiumNavigation from './navigation';
export default function PremiumPlaceholder({title,description}:{title:string;description:string}){
 return <main id="main-content" className="container"><PremiumNavigation/><section className="page-hero"><Eyebrow>Sacco Premium / Research preview</Eyebrow><h1>{title}</h1><p>{description}</p></section></main>;
}

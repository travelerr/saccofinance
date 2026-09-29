import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import {SectionHeader} from '@/components/brand/editorial';
import {affiliateTools,affiliateDisclosure} from '@/lib/affiliate-tools';
import './tools-i-use.css';
export default function ToolsIUse(){
 return <section id="tools-i-use" className="section tools-i-use" aria-label="Tools I Use"><SectionHeader label="Tools I Use" title="The platforms behind my research."/><p className="tools-intro">These are tools I personally use to analyze charts and research companies. You don’t need either to use Premium—they’re separate, optional products for anyone who wants to go deeper into my process.</p><div className="tools-grid">{affiliateTools.map(tool=><article key={tool.id} className="tool-card"><div className={`tool-logo tool-logo-${tool.id}`}>
 {tool.logoLight===tool.logoDark?<Image src={tool.logoLight} alt={`${tool.name} logo`} width={tool.width} height={tool.height}/>:<><Image className="tool-logo-light" src={tool.logoLight} alt={`${tool.name} logo`} width={tool.width} height={tool.height}/><Image className="tool-logo-dark" src={tool.logoDark} alt={`${tool.name} logo`} width={tool.width} height={tool.height}/></>}
 </div><h3>{tool.name}</h3><p className="tool-category">{tool.category}</p><p className="tool-description">{tool.description}</p><div className="tool-access"><a className="text-link" href={tool.url} target="_blank" rel="noopener noreferrer sponsored" data-affiliate-placement="premium_tools" aria-label={`${tool.cta} (opens in a new tab)`}>{tool.cta}<ArrowUpRight size={16} aria-hidden="true"/></a><p className="tool-disclosure">{affiliateDisclosure}</p></div></article>)}</div></section>;
}

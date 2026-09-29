/** Exact partner URLs live here; analytics uses only fixed, non-identifying labels. */
export const affiliateTools=[{
 id:'trendspider',name:'TrendSpider',url:'https://trendspider.com?_go=justin-4f7fc2',destination:'trendspider.com',
 category:'Technical analysis, scanning & trade setups',
 description:'I use TrendSpider for charting, scanning for setups, Stage Analysis, Bottom Catcher signals, and backtesting ideas. Many of the technical charts and signals inside Premium come from this workflow.',
 cta:'View current TrendSpider deals',logoLight:'/images/tools/trendspider-light.png',logoDark:'/images/tools/trendspider-dark.png',width:2379,height:304,
},{
 id:'seeking_alpha',name:'Seeking Alpha',url:'https://link.seekingalpha.com/5FNXWBJ/4G6SHH/',destination:'seekingalpha.com',
 category:'Fundamentals, earnings & company research',
 description:'I use Seeking Alpha to dig into financial statements, earnings history, analyst estimates, earnings-call transcripts, valuation metrics, and company research—to move beyond the chart and understand the business.',
 cta:'View Seeking Alpha’s current offer',logoLight:'/images/tools/seeking-alpha.jpg',logoDark:'/images/tools/seeking-alpha.jpg',width:271,height:55,
}] as const;
export const affiliateDisclosure='Affiliate link — I may earn a commission if you sign up through this link, at no additional cost to you.';
export function affiliateClickParams(href:string,placement:string|undefined){
 if(placement!=='premium_tools')return null;
 const tool=affiliateTools.find(t=>new URL(t.url).href===href);if(!tool)return null;
 return {affiliate_partner:tool.id,placement:'premium_tools',destination:tool.destination};
}

export const lessons = [{
 id:'lesson-1', number:1, title:'How I Find Stocks — My Complete Process', videoId:'0mrQeujmpMw', duration:'About 24 minutes',
 description:'Learn how I research the broader market, identify strong sectors using the Sector Gauge, examine ETF holdings, recognize Weinstein Stage 1-to-Stage 2 transitions, evaluate company fundamentals, and turn my research into potential opportunities. This lesson demonstrates the process behind Sacco Premium using real examples.',
 chapters:[['00:00','Welcome to Sacco Premium'],['00:30','Why I Built Sacco Premium'],['03:26','Getting Started With the Dashboard'],['03:43','The Weekly Market Outlook'],['04:51','Using the Sector Gauge'],['10:46','Finding Stocks Through ETFs'],['13:15',"Weinstein’s Four Market Stages"],['19:28','Putting the Strategy Together'],['20:17','Checking Company Fundamentals'],['20:55','Seeking Alpha and InvestingPro'],['22:05','Analyzing Revenue With TrendSpider'],['23:19','The Opportunity Board'],['23:50',"Final Thoughts and What’s Next"]]
}] as const;
export function chapterSeconds(time:string){const [minutes,seconds]=time.split(':').map(Number);return minutes*60+seconds;}

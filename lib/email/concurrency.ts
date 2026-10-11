/** Bound upstream traffic while retaining input order and propagating failures. */
export async function mapLimited<T,R>(items:T[],limit:number,fn:(item:T)=>Promise<R>):Promise<R[]>{
 if(!Number.isInteger(limit)||limit<1)throw new Error('INVALID_CONCURRENCY');
 const results:R[]=new Array(items.length);let cursor=0;
 await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(cursor<items.length){const i=cursor++;results[i]=await fn(items[i]);}}));
 return results;
}

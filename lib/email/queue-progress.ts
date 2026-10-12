type Batch={status:string;attempts:number;prepared_count:number;updated_at:string;lease_until:string|null;error_code:string|null};
export function aggregateEmailJobs(rows:Batch[]){
 if(!rows.length)return null;
 const active=rows.find(r=>['sending','preparing','queued'].includes(r.status));
 const problem=rows.find(r=>r.status==='uncertain')||rows.find(r=>r.status==='failed')||rows.find(r=>r.status==='cancelled');
 const status=active?.status||problem?.status||(rows.every(r=>r.status==='sent')?'sent':'dry_run');
 return {status,attempts:Math.max(...rows.map(r=>r.attempts)),prepared_count:rows.reduce((n,r)=>n+r.prepared_count,0),sent_count:rows.filter(r=>r.status==='sent').reduce((n,r)=>n+r.prepared_count,0),completed_batches:rows.filter(r=>['sent','dry_run'].includes(r.status)).length,batch_count:rows.length,failed_batches:rows.filter(r=>r.status==='failed').length,updated_at:rows.map(r=>r.updated_at).sort().at(-1)!,lease_until:active?.lease_until||null,error_code:problem?.error_code||null};
}

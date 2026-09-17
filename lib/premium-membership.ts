export type Membership={enabled:boolean;access_expires_at:string|null};
export function hasPremiumAccess(membership:Membership|null|undefined,now=Date.now()):boolean{
 if(membership?.enabled!==true)return false;
 if(membership.access_expires_at===null)return true;
 const expires=Date.parse(membership.access_expires_at);
 return Number.isFinite(expires)&&expires>now;
}

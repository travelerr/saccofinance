export type DeveloperEmailConfig={apiKey:string;from:string;recipient:string};
export function validateDeveloperEmailConfig(value:unknown):DeveloperEmailConfig{
 const c=value as DeveloperEmailConfig;
 const address=/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
 if(!c||typeof c.apiKey!=='string'||!/^re_[A-Za-z0-9_-]+$/.test(c.apiKey))throw new Error('Add a Resend sending API key to the private test configuration.');
 if(typeof c.recipient!=='string'||!address.test(c.recipient)||/[\r\n]/.test(c.recipient))throw new Error('Configure exactly one developer recipient email address.');
 if(typeof c.from!=='string'||/[\r\n]/.test(c.from))throw new Error('Configure a verified Resend sender.');
 const sender=c.from.match(/^[^<>]+<([^<>]+)>$/)?.[1]||c.from;
 if(!address.test(sender))throw new Error('Configure a verified Resend sender.');
 return {apiKey:c.apiKey,from:c.from,recipient:c.recipient};
}

// Amplify build variables must be copied into Next.js's server runtime environment.
// Whitelist public project credentials and the trusted site origin; never copy secrets.
const fs=require('node:fs');
const keys=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','AUTH_SITE_URL'];
const values=keys.map(key=>{
 const value=process.env[key]?.trim();
 if(!value || /[\r\n]/.test(value))throw new Error(`Missing or invalid Amplify environment variable: ${key}`);
 return [key,value];
});
const env=Object.fromEntries(values);
const site=new URL(env.AUTH_SITE_URL);
if(site.protocol!=='https:' || site.origin!=='https://saccofinancial.com')throw new Error('AUTH_SITE_URL must be https://saccofinancial.com for production');
const project=new URL(env.NEXT_PUBLIC_SUPABASE_URL);
if(project.protocol!=='https:' || !project.hostname.endsWith('.supabase.co'))throw new Error('Invalid Supabase project URL');
if(!env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_'))throw new Error('Use the Supabase publishable key, never a secret or service-role key');
fs.writeFileSync('.env.production',values.map(([key,value])=>`${key}=${JSON.stringify(value)}`).join('\n')+'\n');
console.log('Configured the three required Premium runtime variables.');

// Amplify build variables must be copied into Next.js's server runtime environment.
// Whitelist public project credentials and billing settings; secrets are fetched at runtime.
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
for(const key of ['STRIPE_MODE','STRIPE_BILLING_ENABLED','STRIPE_MONTHLY_PRICE_ID','STRIPE_ANNUAL_PRICE_ID','STRIPE_PORTAL_CONFIGURATION_ID','BILLING_SECRETS_ARN','BILLING_AWS_REGION']){const value=process.env[key]?.trim();if(value){if(/[\r\n]/.test(value))throw new Error('Invalid billing environment setting');values.push([key,value]);}}
if(process.env.STRIPE_BILLING_ENABLED==='true'){
 for(const key of ['STRIPE_MODE','STRIPE_MONTHLY_PRICE_ID','STRIPE_ANNUAL_PRICE_ID','STRIPE_PORTAL_CONFIGURATION_ID','BILLING_SECRETS_ARN','BILLING_AWS_REGION'])if(!process.env[key]?.trim())throw new Error(`Missing production billing setting: ${key}`);
 if(!['test','live'].includes(process.env.STRIPE_MODE))throw new Error('Invalid Stripe billing mode');
 if(!process.env.BILLING_SECRETS_ARN.startsWith('arn:aws:secretsmanager:'))throw new Error('Billing secrets must be provided via AWS Secrets Manager');
}
fs.writeFileSync('.env.production',values.map(([key,value])=>`${key}=${JSON.stringify(value)}`).join('\n')+'\n');
console.log('Configured required Premium runtime variables and available billing settings.');

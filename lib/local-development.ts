/** Validated local mode: database and origin always remain loopback-only. */
export function localDevelopment(){
 if(process.env.SACCO_LOCAL_DEVELOPMENT!=='true')return false;
 const sandbox=process.env.SACCO_LOCAL_STRIPE==='true';
 if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||process.env.AUTH_SITE_URL!=='http://localhost:3082'||process.env.STRIPE_MODE!=='test'||process.env.BILLING_SECRETS_ARN||process.env.EMAIL_SECRETS_ARN||process.env.RESEND_API_KEY||(sandbox?!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'):Boolean(process.env.STRIPE_SECRET_KEY)))throw new Error('UNSAFE_LOCAL_CONFIGURATION');
 return true;
}
export function localStripeEnabled(){return localDevelopment()&&process.env.SACCO_LOCAL_STRIPE==='true';}

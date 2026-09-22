/** An opt-in LOCAL fixture mode. Never enables a remote/test/live billing client. */
export function localDevelopment(){
 if(process.env.SACCO_LOCAL_DEVELOPMENT!=='true')return false;
 if(process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||process.env.AUTH_SITE_URL!=='http://localhost:3082'||process.env.STRIPE_MODE!=='test'||process.env.STRIPE_SECRET_KEY||process.env.BILLING_SECRETS_ARN||process.env.RESEND_API_KEY)throw new Error('UNSAFE_LOCAL_CONFIGURATION');
 return true;
}

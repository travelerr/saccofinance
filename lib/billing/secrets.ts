import 'server-only';
import {GetSecretValueCommand,SecretsManagerClient} from '@aws-sdk/client-secrets-manager';
type Secrets={STRIPE_SECRET_KEY?:string;STRIPE_WEBHOOK_SECRET?:string;SUPABASE_SECRET_KEY?:string};
let cached:{until:number;value:Secrets}|undefined;
export async function billingSecrets():Promise<Secrets>{
 const arn=process.env.BILLING_SECRETS_ARN;
 if(!arn)return {STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET,SUPABASE_SECRET_KEY:process.env.SUPABASE_SECRET_KEY};
 if(cached&&cached.until>Date.now())return cached.value;
 const client=new SecretsManagerClient({region:process.env.BILLING_AWS_REGION});
 const result=await client.send(new GetSecretValueCommand({SecretId:arn}));
 if(!result.SecretString)throw new Error('BILLING_UNAVAILABLE');
 const value=JSON.parse(result.SecretString) as Secrets;
 cached={value,until:Date.now()+300000};return value;
}

import 'server-only';
import {GetSecretValueCommand,SecretsManagerClient} from '@aws-sdk/client-secrets-manager';
import {assertResearchInfrastructure} from './policy';
type EmailSecrets={RESEND_API_KEY?:string;RESEND_WEBHOOK_SECRET?:string;SUPABASE_SECRET_KEY?:string};
let cached:{key:string;until:number;value:EmailSecrets}|undefined;
/** Production secrets stay out of build artifacts. Local simulation never calls AWS. */
export async function emailSecrets():Promise<EmailSecrets>{
 assertResearchInfrastructure(process.env);
 if(process.env.RESEARCH_EMAIL_LOCAL_ENABLED==='true'||process.env.SACCO_LOCAL_DEVELOPMENT==='true')return {SUPABASE_SECRET_KEY:process.env.SUPABASE_SECRET_KEY};
 const arn=process.env.EMAIL_SECRETS_ARN||process.env.BILLING_SECRETS_ARN;
 const region=process.env.EMAIL_AWS_REGION||process.env.BILLING_AWS_REGION;
 if(!arn?.startsWith('arn:aws:secretsmanager:')||!region)throw new Error('EMAIL_SECRETS_CONFIG_REQUIRED');
 const key=region+':'+arn;
 if(cached?.key===key&&cached.until>Date.now())return cached.value;
 try{
  const result=await new SecretsManagerClient({region}).send(new GetSecretValueCommand({SecretId:arn}));
  const parsed=JSON.parse(result.SecretString||'null');
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error();
  const value:EmailSecrets={RESEND_API_KEY:undefined,RESEND_WEBHOOK_SECRET:undefined,SUPABASE_SECRET_KEY:undefined};
  for(const name of ['RESEND_API_KEY','RESEND_WEBHOOK_SECRET','SUPABASE_SECRET_KEY'] as const){
   if(parsed[name]!==undefined){if(typeof parsed[name]!=='string'||!parsed[name].trim()||/[\r\n]/.test(parsed[name]))throw new Error();value[name]=parsed[name];}
  }
  cached={key,until:Date.now()+60000,value};
  return value;
 }catch{throw new Error('EMAIL_SECRETS_UNAVAILABLE');}
}

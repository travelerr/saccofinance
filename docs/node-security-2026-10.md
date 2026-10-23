# Node.js security baseline — October 23, 2026

Official advisory: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases

CVE-2026-111497 affects the Node.js Brotli decoder and permits remote code execution under affected conditions. A version warning is not evidence of compromise.

## Repository changes
Amplify builds and .nvmrc select Node 22.23.4. Supported engines are patched Node 22 (22.23.4+) or Node 24 (24.22.1+). Other majors require compatibility review.
The npm install, dev, build, start, email worker and Lambda packaging commands check the security floor. Direct execution outside npm can bypass these lifecycle checks. Dependencies and application behavior are unchanged.

## Local use
Run `nvm install` then `nvm use` from this directory, and restart existing local processes. This does not replace the machine-wide Node installation.
Isolated verification: `npm exec --yes --package=node@22.23.4 -- npm run build`.

## Production follow-up — still required
1. Verify the actual Node patch version serving Amplify SSR requests, not only the build log. Confirm managed runtime patching with AWS. Selecting a build version is not proof.
2. Check Lambda runtime management mode and actual deployed runtime version. AWS normally updates managed runtimes, but rollout must be verified. Uploading an application ZIP alone is not proof of patching.
3. Review application/CloudWatch and Stripe request/security logs. Preserve evidence if suspicious activity is found.
4. After securing environments, rotate Stripe secret API keys in the established secret store, verify consumers use replacements, test billing/checkout, then retire old keys. Do not print secrets or rotate unrelated webhook signing secrets casually.
5. Check other Node services separately, including any trading-bot deployment. This change covers only social-media.

No production deployment, key rotation, database migration, or Lambda upload is performed by this change.

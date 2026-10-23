/** Server-only version evidence for managed hosting; never logs credentials. */
export function register() {
 if (process.env.NEXT_RUNTIME === 'nodejs') {
  console.info('[sacco-runtime] Node.js ' + process.version);
 }
}

import 'server-only';
import {createHash,timingSafeEqual} from 'node:crypto';

// Unlisted invitation: only the digest is stored in source. Rotate to revoke the link.
const invitationDigest = '785187b19f9145c84ca3bea33ecec038e9a1bd353c32bc5c663eac957162d6d4';
export function validPrivateOffer(token: unknown): token is string {
 if(typeof token !== 'string' || token.length !== 43)return false;
 return timingSafeEqual(createHash('sha256').update(token).digest(), Buffer.from(invitationDigest,'hex'));
}

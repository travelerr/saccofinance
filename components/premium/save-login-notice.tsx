import Link from 'next/link';
import {KeyRound} from 'lucide-react';
import './save-login-notice.css';

export default function SaveLoginNotice(){
 return <section className="save-login-notice" aria-labelledby="save-login-heading">
  <KeyRound className="save-login-icon" size={28} aria-hidden="true"/>
  <div><p className="save-login-label">Finish setting up your login</p><h2 id="save-login-heading">Save your login.</h2><p>You have access in this browser. <strong>Save your login so you can sign back in from another browser or device.</strong> Use your welcome email to finish setup and set your password.</p></div>
  <Link className="button save-login-button" href="/premium/account/setup">Save my login →</Link>
 </section>;
}

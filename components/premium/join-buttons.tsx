import CheckoutButton from './checkout-button';
import styles from './join-buttons.module.css';
export default function JoinButtons({join,trial=0}:{join:string;trial?:number}) {
 return <div className={styles.actions}>
  <CheckoutButton href={join.startsWith('/premium/join')?'/premium/join?plan=annual':join} className="button" trial={trial}>Join annual — $100/year</CheckoutButton>
  <CheckoutButton href={join.startsWith('/premium/join')?'/premium/join?plan=monthly':join} className={`button ${styles.monthly}`} trial={trial}>{trial?`Start your ${trial}-day trial`:'Join monthly — $10/month'}</CheckoutButton>
 </div>;
}

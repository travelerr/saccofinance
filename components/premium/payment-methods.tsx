import {siVisa, siMastercard, siAmericanexpress, siDiscover, siApplepay} from 'simple-icons';
import styles from './payment-methods.module.css';

const methods = [
  {icon: siVisa, name: 'Visa', color: '#1434CB'},
  {icon: siMastercard, name: 'Mastercard', color: '#EB001B'},
  {icon: siAmericanexpress, name: 'American Express', color: '#006FCF'},
  {icon: siDiscover, name: 'Discover', color: '#C95100'},
  {icon: siApplepay, name: 'Apple Pay', color: '#111111'},
];

export default function PaymentMethods() {
  return <div className={styles.paymentMethods} role="list" aria-label="Accepted payment methods">
    {methods.map(({icon, name, color}) => <span className={styles.badge} role="listitem" key={name}>
      <svg viewBox="0 0 24 24" role="img" aria-label={name} style={{color}}><path fill="currentColor" d={icon.path}/></svg>
    </span>)}
  </div>;
}

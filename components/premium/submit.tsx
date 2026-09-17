'use client';
import {useFormStatus} from 'react-dom';
export default function Submit({children}:{children:string}){const{pending}=useFormStatus();return <button className="button" type="submit" disabled={pending}>{pending?'Please wait…':children}</button>;}

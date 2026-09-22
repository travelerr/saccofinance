'use client';
import {useActionState,useState} from 'react';
import {saveResearchPreference,type PreferenceResult} from './research-actions';
const initialState:PreferenceResult={status:'idle',message:''};
export default function ResearchPreferenceForm({initialEnabled}:{initialEnabled:boolean}){
 const [enabled,setEnabled]=useState(initialEnabled);
 const [state,action,pending]=useActionState(saveResearchPreference,initialState);
 const [edited,setEdited]=useState(false);
 return <form action={action} onSubmit={()=>setEdited(false)}>
  <label><input key={state.message} type="checkbox" name="enabled" checked={enabled} disabled={pending} onChange={event=>{setEnabled(event.target.checked);setEdited(true);}}/> Receive Premium research notifications</label>
  <p>Off unless you choose to enable it. You can turn this off at any time. Account, security, and billing emails are unaffected.</p>
  <button type="submit" className="button" disabled={pending}>{pending?'Saving…':'Save email preference'}</button>
  {!pending&&!edited&&state.message&&<p role={state.status==='error'?'alert':'status'}>{state.message}</p>}
 </form>;
}

'use client';
import {createContext,useContext,useState,type ReactNode} from 'react';
import styles from '@/app/premium/sales.module.css';
type Plan='monthly'|'annual';
const PlanContext=createContext<{plan:Plan;setPlan:(plan:Plan)=>void}>({plan:'annual',setPlan:()=>{}});
export function PremiumPlanProvider({children}:{children:ReactNode}){const [plan,setPlan]=useState<Plan>('annual');return <PlanContext.Provider value={{plan,setPlan}}>{children}</PlanContext.Provider>;}
export function usePremiumPlan(){return useContext(PlanContext);}
export function PlanChoice(){const {plan,setPlan}=usePremiumPlan();return <fieldset className={styles.planChoice}><legend>Choose your plan</legend><div>{(['annual','monthly'] as const).map(value=><label key={value} className={plan===value?styles.chosenPlan:''}><input type="radio" name="landing-plan" value={value} checked={plan===value} onChange={()=>setPlan(value)}/><span>{value==='annual'&&<span className={styles.planValue}>Best value · Save $20/year</span>}<b>{value==='annual'?'Annual':'Monthly'}</b><strong>{value==='annual'?'$8.33':'$10'}<small>/month</small></strong></span></label>)}</div></fieldset>;}

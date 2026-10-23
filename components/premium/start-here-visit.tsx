'use client';
import {useEffect} from 'react';
import {completeStartHereStep} from '@/app/premium/dashboard/start-here-actions';
/** Runs after the actual page mounts, never during route prefetch. */
export default function StartHereVisit({step}:{step:'sector-gauge'|'opportunity'|'outlook'}){
 useEffect(()=>{void completeStartHereStep(step).catch(()=>{});},[step]);
 return null;
}

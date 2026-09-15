'use client';
import {useState} from 'react';
import {stories} from '@/lib/editorial';
import {StoryCard} from './editorial';
export default function MediaGrid(){const[category,setCategory]=useState('All');const items=stories.filter(s=>category==='All'||s.category===category);return <><div className="category-nav" role="group" aria-label="Filter media">{['All','Interviews','IPOs'].map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="editorial-grid" aria-live="polite">{items.map(story=><StoryCard story={story} key={story.id}/>)}</div></>}

// Public, immutable editorial charts only. No private chart endpoints or tracking URLs.
export const researchImagePaths=Array.from({length:6},(_,i)=>`/images/premium/weekly-outlook/issue-008/chart-${i+1}.jpg`);
export function researchImageUrl(path:string,origin:string){
 if(!researchImagePaths.includes(path))throw Error('INVALID_RESEARCH_IMAGE');
 return new URL(path,new URL(origin).origin).href;
}

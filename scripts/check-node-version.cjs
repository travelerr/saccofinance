'use strict';
// Security floors for the October 21, 2026 Node.js releases.
// Keep supported majors explicit; newer majors need compatibility review.
function supportedNode(version) {
 const match=/^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
 if(!match)return false;
 const [,major,minor,patch]=match.map(Number);
 const floor={22:[23,4],24:[22,1]}[major];
 return !!floor&&(minor>floor[0]||(minor===floor[0]&&patch>=floor[1]));
}
if(require.main===module){
 if(!supportedNode(process.versions.node)){
  console.error('Unsupported or unpatched Node.js '+process.version+'. Use Node 22.23.4+ (22.x) or 24.22.1+ (24.x). Run nvm install && nvm use in this project.');
  process.exitCode=1;
 }else console.log('Node.js security baseline passed: '+process.version);
}
module.exports={supportedNode};

'use strict';
const path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process');
const root=path.join(__dirname,'..');
const possible=[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),path.join(process.env.ProgramFiles||'C:/Program Files','nodejs/node_modules/npm/bin/npm-cli.js')];
const npm=possible.find(fs.existsSync);
if(!npm){console.error('NPM_NOT_FOUND: cần Node.js kèm npm');process.exitCode=1;}else{
 for(const command of [[process.execPath,[npm,'ci','--omit=dev','--no-audit','--no-fund']],[process.execPath,[path.join(root,'node_modules/playwright/cli.js'),'install','chromium']]]){
  const r=cp.spawnSync(command[0],command[1],{cwd:root,stdio:'inherit',windowsHide:true,shell:false,timeout:600000});if(r.error||r.status!==0){console.error('ENGINE_SETUP_FAILED');process.exitCode=1;break;}
 }
}

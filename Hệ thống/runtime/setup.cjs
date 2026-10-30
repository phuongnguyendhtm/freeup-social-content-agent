'use strict';
const path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process'),{safeLog}=require('./diagnostics.cjs');
const root=path.join(__dirname,'..');
const possible=[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),path.resolve(path.dirname(process.execPath),'../node_modules/npm/bin/npm-cli.js'),path.resolve(path.dirname(process.execPath),'../lib/node_modules/npm/bin/npm-cli.js'),path.join(process.env.ProgramFiles||'C:/Program Files','nodejs/node_modules/npm/bin/npm-cli.js')];
async function main(){
 const report={mediaReady:false,status:'running',commands:[]},reportPath=path.join(root,'media-setup-report.json');
 const write=()=>fs.writeFileSync(reportPath,JSON.stringify(report,null,2));write();
 try{
  if(Number(process.versions.node.split('.')[0])<22)throw Error('NODE_22_REQUIRED');
  const npm=possible.find(fs.existsSync);if(!npm)throw Error('NPM_NOT_FOUND: cần Node.js kèm npm');
  const env={...process.env,PLAYWRIGHT_SKIP_BROWSER_GC:'1'};const key=Object.keys(env).find(k=>k.toLowerCase()==='path')||'PATH';env[key]=path.dirname(process.execPath)+path.delimiter+(env[key]||'');
  for(const args of [[npm,'ci','--omit=dev','--include=optional','--no-audit','--no-fund'],[path.join(root,'node_modules/playwright/cli.js'),'install','chromium']]){
   report.step=args[0].includes('npm-cli')?'npm':'chromium';write();
   if(!fs.existsSync(args[0]))throw Error('ENGINE_PACKAGE_MISSING: npm chưa tải đủ công cụ; kiểm tra mạng và log npm, chạy lại setup.cjs.');
   const r=cp.spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8',windowsHide:true,shell:false,timeout:600000,maxBuffer:10e6});
   const command={args,exitCode:r.status,error:r.error?.message,stdout:safeLog(r.stdout),stderr:safeLog(r.stderr)};report.commands.push(command);write();
   if(r.error||r.status!==0)throw Error('ENGINE_SETUP_FAILED: '+[command.error,command.stderr.slice(-4000),command.stdout.slice(-4000)].filter(Boolean).join('\n'));
  }
  report.step='probe';write();const result=await require('./doctor.cjs').doctor({root,probe:true});report.doctor=result;write();
  if(!result.ready)throw Error('ENGINE_NOT_READY: '+Object.entries(result.engines).filter(([,v])=>!v.available).map(([name,v])=>name+' '+v.error).join('; '));
  Object.assign(report,{mediaReady:true,status:'completed'});write();return {mediaReady:true,report:reportPath};
 }catch(error){Object.assign(report,{status:'failed',error:safeLog(error.message)});write();throw Error(error.message+'\nBáo cáo công cụ: '+reportPath);}
}
if(require.main===module)main().then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={main};

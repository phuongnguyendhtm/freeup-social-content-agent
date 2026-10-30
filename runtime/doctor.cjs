'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),{createRequire}=require('node:module');
const ENGINES=['playwright','ffmpeg-static','@remotion/bundler','@remotion/renderer'];
async function doctor({root=path.join(__dirname,'..'),probe=false}={}){
 root=path.resolve(root);const req=createRequire(path.join(root,'package.json'));
 const result={node:process.version,nodeReady:Number(process.versions.node.split('.')[0])>=22,skill:'freeup-social-content',mode:'local-content',engines:{},probed:probe};
 for(const name of ENGINES){
  try{
   const entry=req.resolve(name),relative=path.relative(path.join(root,'node_modules'),entry);
   if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('ENGINE_NOT_INSTALLED_LOCALLY');
   const details={available:true,path:entry};
   if(name==='ffmpeg-static'){
    const binary=req(name);if(typeof binary!=='string'||!fs.existsSync(binary))throw Error('FFMPEG_BINARY_MISSING');details.binary=binary;
    if(probe){const r=cp.spawnSync(binary,['-version'],{encoding:'utf8',windowsHide:true,timeout:15000});if(r.error||r.status!==0)throw Error('FFMPEG_CANNOT_RUN: '+(r.error?.message||r.stderr));details.runs=true;}
   }
   if(name==='playwright'){
    const {chromium}=req(name),executablePath=process.env.FREEUP_CHROMIUM_PATH||chromium.executablePath();
    if(!fs.existsSync(executablePath))throw Error('CHROMIUM_BINARY_MISSING');details.binary=executablePath;
    if(probe){
     const launches=process.env.FREEUP_CHROMIUM_PATH?[{executablePath}]:[{}, {executablePath}];
     for(const options of launches){const browser=await chromium.launch({headless:true,timeout:30000,...options});try{const page=await browser.newPage();await page.setContent('<main>FreeUp</main>');if(await page.locator('main').textContent()!=='FreeUp')throw Error('CHROMIUM_PROBE_FAILED');}finally{await browser.close();}}
     details.runs=true;
    }
   }
   if(name.startsWith('@remotion/'))req(name);
   if(name==='@remotion/renderer'){
    details.binaries={};
    for(const type of ['compositor','ffmpeg','ffprobe']){
     const binary=req(name).RenderInternals.getExecutablePath({type,indent:false,logLevel:'error',binariesDirectory:null});
     const rel=path.relative(path.join(root,'node_modules'),binary);
     if(rel.startsWith('..')||path.isAbsolute(rel)||!fs.existsSync(binary))throw Error('REMOTION_BINARY_MISSING: '+type);
     if(probe&&type!=='compositor'){const r=cp.spawnSync(binary,['-version'],{encoding:'utf8',windowsHide:true,timeout:15000});if(r.error||r.status!==0)throw Error('REMOTION_BINARY_CANNOT_RUN: '+type);}
     details.binaries[type]=binary;
    }
   }
   result.engines[name]=details;
  }catch(error){result.engines[name]={available:false,error:error.code==='MODULE_NOT_FOUND'?'ENGINE_PACKAGE_MISSING':error.message};}
 }
 result.ready=result.nodeReady&&ENGINES.every(name=>result.engines[name].available);return result;
}
module.exports={doctor};

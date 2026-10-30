const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const base=path.join(__dirname,'../verification');fs.mkdirSync(base,{recursive:true});
function run(root,probe=false){fs.cpSync(path.join(__dirname,'../runtime'),path.join(root,'runtime'),{recursive:true,filter:()=>true});const r=cp.spawnSync(process.execPath,[path.join(root,'runtime/cli.cjs'),'doctor',...probe?['--probe','true']:[]],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);}
test('doctor does not borrow packages from an ancestor when a student install is empty',async t=>{
 const root=fs.mkdtempSync(path.join(base,'doctor-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const result=run(root);
 for(const engine of Object.values(result.engines))assert.equal(engine.available,false);assert.equal(result.ready,false);
});
test('doctor rejects a Remotion renderer whose native compositor was not downloaded',t=>{
 const root=fs.mkdtempSync(path.join(base,'doctor-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const pkg=path.join(root,'node_modules/@remotion/renderer');fs.mkdirSync(pkg,{recursive:true});
 fs.writeFileSync(path.join(pkg,'index.js'),"module.exports.RenderInternals={getExecutablePath:()=>__dirname+'/missing-compositor'};");
 const result=run(root);assert.equal(result.engines['@remotion/renderer'].available,false);
});
test('doctor launches the same default headless browser used by image production',t=>{
 const root=fs.mkdtempSync(path.join(base,'doctor-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const pkg=path.join(root,'node_modules/playwright');fs.mkdirSync(pkg,{recursive:true});fs.writeFileSync(path.join(pkg,'full-chromium'),'exists');
 fs.writeFileSync(path.join(pkg,'index.js'),"module.exports.chromium={executablePath:()=>__dirname+'/full-chromium',launch:async o=>{if(!o.executablePath)throw Error('HEADLESS_SHELL_MISSING');return {newPage:async()=>({setContent:async()=>{},locator:()=>({textContent:async()=>'FreeUp'})}),close:async()=>{}};}};");
 const result=run(root,true);assert.equal(result.engines.playwright.available,false);assert.match(result.engines.playwright.error,/HEADLESS_SHELL_MISSING/);
});
test('a resolvable ffmpeg package without its downloaded executable is not ready',async t=>{
 const root=fs.mkdtempSync(path.join(base,'doctor-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const pkg=path.join(root,'node_modules/ffmpeg-static');fs.mkdirSync(pkg,{recursive:true});
 fs.writeFileSync(path.join(pkg,'index.js'),"module.exports=__dirname+'/not-downloaded.exe';");
 const result=run(root);
 assert.equal(result.engines['ffmpeg-static'].available,false);assert.match(result.engines['ffmpeg-static'].error,/FFMPEG_BINARY_MISSING/);
});

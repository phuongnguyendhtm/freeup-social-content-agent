'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),{randomUUID}=require('node:crypto');
const core=require('./runtime/core.cjs');
const NAME='freeup-social-content',HOSTS=['openclaw','9bizclaw','claude','codex'];
const VERSION=require('./package.json').version;
const RETIRED=['references-schema.cjs','runtime/sheets.cjs','runtime/scheduler.cjs','references/sheet-mau.md','references/sheet-schema.json','references/dong-bo-sheet.md','references/dang-bai.md','assets/templates/FreeUp-Content-Dashboard.xlsx'];
function detectHost({currentHost,candidates=[]}={}){if(currentHost&&HOSTS.includes(currentHost))return currentHost;if(candidates.length===1&&HOSTS.includes(candidates[0]))return candidates[0];throw Error('HOST_CHOICE_REQUIRED: '+HOSTS.join(', '));}
function agentEntry(cfg,id){const a=cfg.agents||{};if(a.entries?.[id])return {entry:a.entries[id],configPath:`agents.entries.${id}.skills`};const i=a.list?.findIndex(v=>v.id===id);if(i>=0)return {entry:a.list[i],configPath:`agents.list[${i}].skills`};if(id==='main'&&a.defaults&&!a.entries&&!a.list)return {entry:a.defaults,configPath:'agents.defaults.skills'};throw Error('AGENT_NOT_FOUND: '+id);}
function mergeAllowlist(cfg,id,names=[NAME]){
 const c=structuredClone(cfg),selected=agentEntry(c,id),defaults=c.agents.defaults||{};
 const source=Object.hasOwn(selected.entry,'skills')?selected.entry:Object.hasOwn(defaults,'skills')?defaults:null;
 if(source){if(!Array.isArray(source.skills)||source.skills.some(s=>typeof s!=='string'))throw Error('INVALID_ALLOWLIST');selected.entry.skills=[...new Set([...source.skills,...names])];}
 return c;
}
function copyFile(a,b){projectInstall.checkAncestors(path.dirname(b));const stat=fs.lstatSync(b,{throwIfNoEntry:false});if(stat&&(stat.isSymbolicLink()||!stat.isFile()||stat.nlink!==1))throw Error('DESTINATION_UNSAFE: '+b);const src=fs.lstatSync(a);if(!src.isFile()||src.isSymbolicLink()||src.nlink!==1)throw Error('SYMLINK_NOT_ALLOWED');fs.copyFileSync(a,b);}
function copyDir(a,b){projectInstall.checkAncestors(b);fs.mkdirSync(b,{recursive:true});for(const e of fs.readdirSync(a,{withFileTypes:true})){if(['node_modules','.git','verification'].includes(e.name))continue;const from=path.join(a,e.name),to=path.join(b,e.name);if(e.isSymbolicLink())throw Error('SYMLINK_NOT_ALLOWED');if(e.isDirectory())copyDir(from,to);else copyFile(from,to);}}
function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));}
const {safeLog}=require('./runtime/diagnostics.cjs');
const {stageDigest,recoverFinalRename}=require('./runtime/install-recovery.cjs');
const projectInstall=require('./runtime/project-install.cjs');
function nativeRuntime(root,{node,cli,stateDir}={}){
 const runtime={node:node||(root?path.join(root,'vendor/node',process.platform==='win32'?'node.exe':'node'):process.execPath),cli:cli||(root?path.join(root,'vendor/node_modules/openclaw/openclaw.mjs'):null),state:stateDir||(root?path.join(root,'openclaw-state'):null)};
 if(!runtime.cli||!runtime.state)throw Error('NATIVE_CLI_AND_STATE_REQUIRED');
 for(const key of ['node','cli','state'])runtime[key]=path.resolve(runtime[key]);
 if(!fs.existsSync(runtime.node))throw Error('NATIVE_NODE_NOT_FOUND: '+runtime.node);
 if(!fs.existsSync(runtime.cli))throw Error('NATIVE_CLI_NOT_FOUND: '+runtime.cli);
 const manifest=path.join(path.dirname(runtime.cli),'package.json');if(fs.existsSync(manifest))runtime.version=readJson(manifest).version;
 return runtime;
}
function native(runtime,args,report){
 const r=cp.spawnSync(runtime.node,[runtime.cli,...args],{cwd:path.dirname(runtime.cli),encoding:'utf8',windowsHide:true,shell:false,timeout:180000,maxBuffer:5e6,env:{...process.env,OPENCLAW_STATE_DIR:runtime.state,OPENCLAW_CONFIG_PATH:path.join(runtime.state,'openclaw.json'),OPENCLAW_NO_BANNER:'1',NO_COLOR:'1'}});
 const command={args,exitCode:r.status,signal:r.signal,error:r.error?.message,stdout:safeLog(r.stdout),stderr:safeLog(r.stderr)};report.commands.push(command);
 if(r.error||r.status!==0){const detail=[command.error,command.stderr.slice(-4000),command.stdout.slice(-4000)].filter(Boolean).join('\n');const code=r.error?.code==='ETIMEDOUT'?'NATIVE_COMMAND_TIMEOUT':'NATIVE_INSTALL_FAILED';const error=Error(`${code} [${report.step}; exit ${r.status}]: ${detail||'No output from native CLI'}`);error.nativeCommand=command;throw error;}
 return r.stdout;
}
function owns(destination,{host,workspace,project},name){try{const previous=readJson(path.join(destination,'runtime.json'));if(previous.host!==host||path.resolve(previous.workspace)!==workspace||path.resolve(previous.project)!==project)return false;if(name===NAME&&readJson(path.join(destination,'package.json')).name!==require('./package.json').name)return false;return true;}catch{return false;}}
function repairable(error){const output=error.nativeCommand;return process.platform==='win32'&&output&&!output.error&&/failed to install skill[\s\S]*\b(?:EPERM|EBUSY)\b[\s\S]*\brename\b/i.test(output.stderr+'\n'+output.stdout)&&!/policy|blocked|denied|scan failed/i.test(output.stderr+'\n'+output.stdout);}
function readNativeInventory(output){try{const result=JSON.parse(String(output).replace(/^\uFEFF/,'').trim());if(Array.isArray(result.skills))return result;}catch{}throw Error('NATIVE_INVENTORY_INVALID: native skills list did not return a JSON skills array');}
function install({host,workspace,project,defaultProject,packageRoot=__dirname,native:useNative=true,root,agent='main',plan=false,stateDir,cli,node,withMedia=false,onProgress=()=>{}}){
 if(!HOSTS.includes(host))throw Error('INVALID_HOST');let cfg;
 const isNative=['9bizclaw','openclaw'].includes(host)&&useNative;
 const configFile=stateDir?path.join(stateDir,'openclaw.json'):root?path.join(root,'openclaw-state/openclaw.json'):null;
 if(isNative){if(!configFile)throw Error('NATIVE_ROOT_REQUIRED');cfg=readJson(configFile);const selected=agentEntry(cfg,agent);workspace=selected.entry.workspace||cfg.agents.defaults?.workspace;if(!workspace)throw Error('WORKSPACE_REQUIRED');}
 if(!workspace)throw Error('WORKSPACE_REQUIRED');workspace=path.resolve(workspace);core.safePath(workspace);
 const skillRoot=path.join(workspace,host==='claude'?'.claude/skills':host==='codex'?'.agents/skills':'skills');
 const target=core.safePath(workspace,path.relative(workspace,path.join(skillRoot,NAME)));let previous;
 try{const candidate=readJson(path.join(target,'runtime.json'));if(typeof candidate.project==='string'&&owns(target,{host,workspace,project:path.resolve(candidate.project)},NAME))previous=candidate;}catch{}
 project=path.resolve(project||previous?.project||defaultProject||path.join(workspace,'freeup-social-content-data'));
 const previousProject=previous?.migrationFrom||previous?.project;
 const engineSkill=path.join(project,'Hệ thống');
 const names=[NAME,...readJson(path.join(packageRoot,'skills/catalog.json')).skills.map(s=>s.name)];
 const receipt={host,agent,workspace,skillRoot,project,engineSkill,skill:NAME,skills:names,version:VERSION,mode:isNative?'native':'local',verified:false,mediaReady:false,updateModes:{}};
 if(plan)return {...receipt,plan:true};
 fs.mkdirSync(workspace,{recursive:true});
 const reportPath=core.safePath(workspace,'.freeup-install-reports',Date.now()+'-'+randomUUID()+'.json');
 const report={...receipt,status:'running',step:'preflight',commands:[],installed:[],startedAt:new Date().toISOString()};let stages,runtime,pendingReceipt,releaseMigration;
 const checkpoint=step=>{report.step=step;core.atomic(reportPath,report);onProgress(step);};
 const runNative=args=>{try{return native(runtime,args,report);}finally{core.atomic(reportPath,report);}};
 const backup=(destination,name)=>{const to=core.safePath(workspace,'.freeup-backups',Date.now()+'-'+randomUUID()+'-'+name);copyDir(destination,to);(receipt.backups??=[]).push(to);report.backups=receipt.backups;};
 try{
  checkpoint('preflight');for(const name of names)if(!fs.existsSync(path.join(packageRoot,'skills',name,'SKILL.md')))throw Error('PACKAGE_INCOMPLETE: '+name);
  const projectOptions={project,previousProject:previous?.project,packageRoot:path.resolve(packageRoot),skillRoot,host,workspace,agent};
  let projectPlan=projectInstall.prepare(projectOptions);
  releaseMigration=projectInstall.lockMigration(projectPlan);
  if(projectPlan.migratedFrom)projectPlan=projectInstall.prepare(projectOptions);
  projectInstall.copyData(projectPlan);if(previous?.migrationFrom||projectPlan.migratedFrom)receipt.migratedFrom=previous?.migrationFrom||projectPlan.migratedFrom;
  pendingReceipt=core.safePath(project,'Dữ liệu vận hành/install-receipt.json');
  if(fs.existsSync(pendingReceipt)){const archive=core.safePath(project,'Dữ liệu vận hành/Lịch sử cài đặt',Date.now()+'-'+randomUUID()+'.json');fs.mkdirSync(path.dirname(archive),{recursive:true});fs.copyFileSync(pendingReceipt,archive,fs.constants.COPYFILE_EXCL);}
  core.atomic(pendingReceipt,{...receipt,verified:false,status:'installing',reportPath});
  if(isNative){runtime=nativeRuntime(root,{stateDir,cli,node});report.runtime=runtime;const help=runNative(['skills','install','--help']);if(!help.includes('--agent')||!help.includes('--as'))throw Error('NATIVE_CLI_INCOMPATIBLE: cập nhật 9BizClaw; CLI cần skills install --agent --as.');}
  stages=fs.mkdtempSync(path.join(os.tmpdir(),'freeup-stage-'));let inventory;
  if(isNative){checkpoint('inventory:before');inventory=readNativeInventory(runNative(['skills','list','--agent',agent,'--json']));}
  for(const name of names){
   checkpoint('install:'+name);
   const source=path.join(packageRoot,'skills',name),destination=core.safePath(workspace,path.relative(workspace,path.join(skillRoot,name))),stage=path.join(stages,name);copyDir(source,stage);
   if(name===NAME){for(const dir of ['runtime','assets','workflows'])if(fs.existsSync(path.join(packageRoot,dir)))copyDir(path.join(packageRoot,dir),path.join(stage,dir));for(const file of ['package.json','package-lock.json'])fs.copyFileSync(path.join(packageRoot,file),path.join(stage,file));fs.mkdirSync(path.join(stage,'skills'),{recursive:true});fs.copyFileSync(path.join(packageRoot,'skills/catalog.json'),path.join(stage,'skills/catalog.json'));}
   fs.writeFileSync(path.join(stage,'runtime.json'),JSON.stringify({project,workspace,engineSkill,skillRoot,host,agent,version:VERSION,...receipt.migratedFrom?{migrationFrom:receipt.migratedFrom}:{}},null,2));
   const exists=fs.existsSync(destination);if(exists){if(!owns(destination,receipt,name)&&!(previousProject&&owns(destination,{...receipt,project:path.resolve(previousProject)},name)))throw Error('EXISTING_SKILL_OWNER_MISMATCH: '+destination);backup(destination,name);}
   if(isNative){const existing=inventory.skills.find(s=>s.name===name);
    if(exists&&existing){copyDir(stage,destination);receipt.updateModes[name]='update-owned-registered';}
    else{const digest=exists?null:stageDigest(stage);try{runNative(['skills','install',stage,'--agent',agent,'--as',name,...exists?['--force']:[]]);receipt.updateModes[name]=exists?'native-repair':'native-install';}
     catch(error){
      // A native Windows rename may leave an identifiable, partially published FreeUp package.
      // Never recover policy denials or overwrite an unidentified destination.
      if(repairable(error)&&owns(destination,receipt,name)){backup(destination,name);copyDir(stage,destination);receipt.updateModes[name]='repair-owned-native-rename';}
      else if(recoverFinalRename({error,version:runtime.version,stage,destination,wasPresent:exists,digest}))receipt.updateModes[name]='repair-native-final-rename';
      else throw error;
      (report.recoveredErrors??=[]).push({skill:name,mode:receipt.updateModes[name],error:safeLog(error.message)});
     }
    }
   }else{copyDir(stage,destination);receipt.updateModes[name]='local';}
   report.installed.push(name);
  }
  if(isNative){
   checkpoint('allowlist');const current=readJson(configFile),merged=mergeAllowlist(current,agent,names),sel=agentEntry(current,agent),batch=[];
   if(JSON.stringify(current.agents.defaults?.skills)!==JSON.stringify(merged.agents.defaults?.skills))batch.push({path:'agents.defaults.skills',value:merged.agents.defaults.skills});
   if(sel.configPath!=='agents.defaults.skills'&&JSON.stringify(sel.entry.skills)!==JSON.stringify(agentEntry(merged,agent).entry.skills))batch.push({path:sel.configPath,value:agentEntry(merged,agent).entry.skills});
   if(batch.length){const file=path.join(stages,'allowlist-batch.json');fs.writeFileSync(file,JSON.stringify(batch));runNative(['config','set','--batch-file',file,'--dry-run','--json']);runNative(['config','set','--batch-file',file,'--json']);}
   checkpoint('inventory:verify');let pending=names;
   for(let attempt=0;attempt<3;attempt++){const after=readNativeInventory(runNative(['skills','list','--agent',agent,'--json']));pending=names.filter(name=>{const found=after.skills.find(s=>s.name===name);return !found||!found.eligible||found.modelVisible===false||found.disabled||found.blockedByAgentFilter||found.blockedByAllowlist;});if(!pending.length)break;}
   if(pending.length)throw Error('NATIVE_SKILL_NOT_READY: '+pending.join(', '));
  }
  receipt.verified=report.installed.length===9;checkpoint('data');
  const binding={project,workspace,engineSkill,skillRoot,host,agent,version:VERSION};
  core.atomic(core.safePath(engineSkill,'runtime.json'),binding);
  if(path.resolve(packageRoot)!==engineSkill){
   for(const dir of ['runtime','assets','skills','workflows','scripts','tests'])if(fs.existsSync(path.join(packageRoot,dir)))copyDir(path.join(packageRoot,dir),path.join(engineSkill,dir));
   for(const file of ['package.json','package-lock.json','release.json','install.cjs'])copyFile(path.join(packageRoot,file),path.join(engineSkill,file));
  }
  for(const name of names)core.atomic(core.safePath(engineSkill,'skills',name,'runtime.json'),binding);
  for(const file of RETIRED){const retired=core.safePath(target,file);if(fs.existsSync(retired))fs.unlinkSync(retired);}
  releaseMigration();
  core.init(project);require('./runtime/folder-guides.cjs').ensure(project);require('./runtime/assets.cjs').syncBundled(packageRoot,project);
  if(withMedia){
   for(const [step,file]of [['media:setup','setup.cjs'],['media:selftest','selftest.cjs']]){
    checkpoint(step);const args=[path.join(engineSkill,'runtime',file)];
    const result=cp.spawnSync(runtime?.node||process.execPath,args,{cwd:engineSkill,encoding:'utf8',windowsHide:true,shell:false,timeout:1200000,maxBuffer:10e6});
    const command={args,exitCode:result.status,error:result.error?.message,stdout:safeLog(result.stdout),stderr:safeLog(result.stderr)};report.commands.push(command);core.atomic(reportPath,report);
    if(result.error||result.status!==0)throw Error('MEDIA_SETUP_FAILED ['+step+']: '+[command.error,command.stderr.slice(-4000),command.stdout.slice(-4000)].filter(Boolean).join('\n'));
   }
   receipt.mediaReady=true;receipt.selfTestReport=path.join(project,'Dữ liệu vận hành/kiem-tra-cai-dat.json');
   if(!readJson(receipt.selfTestReport).passed)throw Error('MEDIA_SELFTEST_NOT_PASSED');
  }
  for(const name of names)core.atomic(core.safePath(skillRoot,name,'runtime.json'),binding);
  receipt.reportPath=reportPath;core.atomic(core.safePath(project,'Dữ liệu vận hành/install-receipt.json'),receipt);
  Object.assign(report,receipt,{status:'completed',step:'completed',finishedAt:new Date().toISOString()});core.atomic(reportPath,report);return receipt;
 }catch(error){Object.assign(report,{status:'failed',verified:false,mediaReady:false,failedStep:report.step,error:safeLog(error.message),finishedAt:new Date().toISOString()});core.atomic(reportPath,report);if(pendingReceipt)core.atomic(pendingReceipt,{...receipt,verified:false,mediaReady:false,status:'failed',reportPath});error.reportPath=reportPath;error.message+='\nBáo cáo: '+reportPath;throw error;}
 finally{if(releaseMigration)releaseMigration();if(stages){const rel=path.relative(os.tmpdir(),stages);if(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel))try{fs.rmSync(stages,{recursive:true,force:true,maxRetries:3});}catch{}}}
}
function parse(argv){const o={};for(let i=0;i<argv.length;i++){const a=argv[i];if(a==='--plan'){o.plan=true;continue;}if(a==='--with-media'){o.withMedia=true;continue;}if(!['--host','--workspace','--project','--root','--agent','--state-dir','--cli','--node'].includes(a)||!argv[i+1])throw Error('INVALID_INSTALL_ARGUMENT');o[a==='--state-dir'?'stateDir':a.slice(2)]=argv[++i];}return o;}
function runCLI(argv=process.argv.slice(2),defaultProject=path.resolve(__dirname,'..')){try{const o=parse(argv);o.defaultProject=defaultProject;o.onProgress=step=>console.error('FreeUp: '+step);if(!o.host||o.host==='auto')o.host=process.env.FREEUP_HOST||'9bizclaw';if(['9bizclaw','openclaw'].includes(o.host)&&!o.root&&!o.stateDir){const pointer=path.join(process.env.APPDATA||os.homedir(),'9BizClaw-v3/install-root.json');if(fs.existsSync(pointer))o.root=readJson(pointer).path;}if(!o.workspace&&['claude','codex'].includes(o.host))o.workspace=process.cwd();console.log(JSON.stringify(install(o),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
if(require.main===module)runCLI();
module.exports={detectHost,install,mergeAllowlist,agentEntry,parse,runCLI};

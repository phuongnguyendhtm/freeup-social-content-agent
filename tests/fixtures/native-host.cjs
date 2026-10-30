'use strict';
// Boundary fixture for native CLI failures. Actual 9BizClaw is also exercised in release verification.
const fs=require('node:fs'),path=require('node:path');
const state=process.env.OPENCLAW_STATE_DIR,config=JSON.parse(fs.readFileSync(process.env.OPENCLAW_CONFIG_PATH,'utf8'));
const workspace=config.agents.entries.main.workspace,root=path.join(workspace,'skills');
const scenarioFile=path.join(state,'scenario.json'),scenario=fs.existsSync(scenarioFile)?JSON.parse(fs.readFileSync(scenarioFile,'utf8')):{};
const args=process.argv.slice(2);
if(args[0]==='--version'){console.log('OpenClaw fixture');process.exit(0);}
if(args.includes('--help')){console.log('Usage: skills '+args[1]+' --agent <id> --as <slug> --force --json');process.exit(0);}
if(args[0]==='skills'&&args[1]==='list'){
 if(scenario.hideInventory){console.log(JSON.stringify({workspaceDir:workspace,skills:[]}));process.exit(0);}
 console.log(JSON.stringify({workspaceDir:workspace,skills:fs.existsSync(root)?fs.readdirSync(root).filter(name=>fs.existsSync(path.join(root,name,'SKILL.md'))).map(name=>({name,source:'openclaw-workspace',eligible:true,modelVisible:true,disabled:false,blockedByAllowlist:false})):[]}));
}else if(args[0]==='skills'&&args[1]==='install'){
 const name=args[args.indexOf('--as')+1],dest=path.join(root,name);
 if(scenario.policyBlock){console.error('security.installPolicy: blocked by policy');process.exit(1);}
 if(scenario.noisyFailure){console.error('A startup warning. '.repeat(60));console.log('NATIVE_SPECIFIC_FAILURE: original root cause');process.exit(7);}
 fs.mkdirSync(root,{recursive:true});
 if(scenario.finalRename&&name==='freeup-social-content'){
  const from=path.join(scenario.outsideStage?state:root,'.fs-safe-move-22940-ece461e5-9d72-423c-935f-56975499dd48.tmp');
  const to=scenario.wrongTarget?path.join(root,'another-skill'):dest;
  if(scenario.foreignTarget){fs.mkdirSync(dest);fs.writeFileSync(path.join(dest,'customer.txt'),'keep foreign data');}
  if(scenario.changedSource)fs.appendFileSync(path.join(args[2],'SKILL.md'),'\nChanged after native scan');
  if(scenario.policyWithRename)console.error('security.installPolicy: blocked by policy');
  console.log(JSON.stringify({time:'2026-10-30T18:43:36.374+07:00',level:'info',message:'Installing to '+dest+'…'}));
  // Native 2026.9.9 JSON logging escapes the Windows path once inside the message too.
  const message="failed to install skill: Error: EPERM: operation not permitted, rename '"+from.replaceAll('\\','\\\\')+"' -> '"+to.replaceAll('\\','\\\\')+"'";
  console.error(JSON.stringify({level:'error',message}));process.exit(1);
 }
 if(scenario.partialRename&&name==='freeup-social-content'){
  fs.cpSync(args[2],dest,{recursive:true,filter:()=>true});fs.unlinkSync(path.join(dest,'SKILL.md'));
  console.error('failed to install skill: Error: EPERM: operation not permitted, rename staging -> '+dest);process.exit(1);
 }
 if(scenario.missingExecutable&&name==='freeup-social-content')throw Error('unreachable');
 // Keep the fixture independent of Node 22's Windows no-filter cpSync fast path.
 // Production staging copies individual files; real native CLI is verified separately.
 fs.cpSync(args[2],dest,{recursive:true,filter:()=>true});console.log('Installed '+name);
}else if(args[0]==='config'&&args[1]==='set'){
 if(!args.includes('--dry-run')){
  const batch=JSON.parse(fs.readFileSync(args[args.indexOf('--batch-file')+1],'utf8'));
  for(const item of batch){const keys=item.path.split('.');let obj=config;for(const key of keys.slice(0,-1))obj=obj[key]??={};obj[keys.at(-1)]=item.value;}
  fs.writeFileSync(process.env.OPENCLAW_CONFIG_PATH,JSON.stringify(config));
 }
 console.log('{"ok":true}');
}else{console.error('unknown command: '+args.join(' '));process.exit(1);}

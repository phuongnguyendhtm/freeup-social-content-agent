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
 console.log(JSON.stringify({workspaceDir:workspace,skills:fs.existsSync(root)?fs.readdirSync(root).filter(name=>fs.existsSync(path.join(root,name,'SKILL.md'))).map(name=>({name,source:'openclaw-workspace',eligible:true,modelVisible:true,disabled:false,blockedByAllowlist:false})):[]}));
}else if(args[0]==='skills'&&args[1]==='install'){
 const name=args[args.indexOf('--as')+1],dest=path.join(root,name);
 if(scenario.policyBlock){console.error('security.installPolicy: blocked by policy');process.exit(1);}
 if(scenario.noisyFailure){console.error('A startup warning. '.repeat(60));console.log('NATIVE_SPECIFIC_FAILURE: original root cause');process.exit(7);}
 fs.mkdirSync(root,{recursive:true});
 if(scenario.partialRename&&name==='freeup-social-content'){
  fs.cpSync(args[2],dest,{recursive:true});fs.unlinkSync(path.join(dest,'SKILL.md'));
  console.error('failed to install skill: Error: EPERM: operation not permitted, rename staging -> '+dest);process.exit(1);
 }
 if(scenario.missingExecutable&&name==='freeup-social-content')throw Error('unreachable');
 fs.cpSync(args[2],dest,{recursive:true});console.log('Installed '+name);
}else if(args[0]==='config'&&args[1]==='set'){
 if(!args.includes('--dry-run')){
  const batch=JSON.parse(fs.readFileSync(args[args.indexOf('--batch-file')+1],'utf8'));
  for(const item of batch){const keys=item.path.split('.');let obj=config;for(const key of keys.slice(0,-1))obj=obj[key]??={};obj[keys.at(-1)]=item.value;}
  fs.writeFileSync(process.env.OPENCLAW_CONFIG_PATH,JSON.stringify(config));
 }
 console.log('{"ok":true}');
}else{console.error('unknown command: '+args.join(' '));process.exit(1);}

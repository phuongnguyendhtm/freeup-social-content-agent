'use strict';
const fs=require('node:fs'),path=require('node:path'),{randomUUID}=require('node:crypto'),core=require('./core.cjs');
const DATA=['Tài nguyên đầu vào','Nội dung đã tạo','Dữ liệu vận hành'];
function checkAncestors(file){let p=path.resolve(file);while(true){const s=fs.lstatSync(p,{throwIfNoEntry:false});if(s&&(s.isSymbolicLink()||!s.isDirectory()))throw Error('PROJECT_PATH_UNSAFE: '+p);const parent=path.dirname(p);if(parent===p)break;p=parent;}}
function inside(root,file){const r=path.relative(root,file);return !r||r!=='..'&&!r.startsWith('..'+path.sep)&&!path.isAbsolute(r);}
function prepare({project,previousProject,packageRoot,skillRoot,host,workspace,agent}){
 project=path.resolve(project);const engine=path.join(project,'Hệ thống');
 if(project===path.parse(project).root||inside(skillRoot,project)||inside(packageRoot,project))throw Error('PROJECT_LOCATION_UNSAFE');
 checkAncestors(project);checkAncestors(engine);
 if(previousProject&&!fs.existsSync(previousProject))throw Error('PROJECT_BINDING_MISSING: '+previousProject);
 if(previousProject&&previousProject!==project&&(inside(previousProject,project)||inside(project,previousProject)))throw Error('PROJECT_MIGRATION_NESTED');
 const marker=core.safePath(engine,'runtime.json');
 if(fs.existsSync(engine)&&fs.readdirSync(engine).length&&(path.resolve(packageRoot)!==engine||fs.existsSync(marker))){
  let own;try{own=JSON.parse(fs.readFileSync(marker));}catch{}
  if(!own||own.host!==host||own.agent!==agent||typeof own.workspace!=='string'||typeof own.project!=='string'||path.resolve(own.workspace)!==workspace||![project,previousProject].includes(path.resolve(own.project)))throw Error('EXISTING_ENGINE_OWNER_MISMATCH');
 }
 const files=[];
 if(previousProject&&previousProject!==project){
  checkAncestors(previousProject);
  function walk(relative){
   if(['install-receipt.json','.lock'].some(name=>relative===path.join('Dữ liệu vận hành',name)))return;
   const from=core.safePath(previousProject,relative),to=core.safePath(project,relative),stat=fs.lstatSync(from);if(stat.isSymbolicLink())throw Error('PROJECT_PATH_UNSAFE');
   const target=fs.lstatSync(to,{throwIfNoEntry:false});if(target?.isSymbolicLink())throw Error('PROJECT_PATH_UNSAFE');
   if(stat.isDirectory()){if(target&&!target.isDirectory())throw Error('PROJECT_MIGRATION_CONFLICT: '+relative);for(const e of fs.readdirSync(from))walk(path.join(relative,e));}
   else{if(!stat.isFile()||stat.nlink!==1)throw Error('PROJECT_PATH_UNSAFE');const bytes=fs.readFileSync(from);if(target&&(!target.isFile()||!fs.readFileSync(to).equals(bytes)))throw Error('PROJECT_MIGRATION_CONFLICT: '+relative);files.push({from,to,hash:core.hash(bytes),exists:!!target});}
  }
  for(const name of DATA)if(fs.existsSync(path.join(previousProject,name)))walk(name);
 }
 return {project,engine,files,migratedFrom:previousProject&&previousProject!==project?previousProject:null};
}
function copyData(plan){
 checkAncestors(plan.project);fs.mkdirSync(plan.project,{recursive:true});
 const probe=path.join(plan.project,'.freeup-write-'+randomUUID());fs.writeFileSync(probe,'',{flag:'wx'});fs.unlinkSync(probe);
 for(const file of plan.files){if(core.hash(fs.readFileSync(file.from))!==file.hash)throw Error('PROJECT_CHANGED_DURING_MIGRATION');checkAncestors(path.dirname(file.to));fs.mkdirSync(path.dirname(file.to),{recursive:true});if(!file.exists)fs.copyFileSync(file.from,file.to,fs.constants.COPYFILE_EXCL);}
 for(const file of plan.files)if(core.hash(fs.readFileSync(file.from))!==file.hash||core.hash(fs.readFileSync(file.to))!==file.hash)throw Error('PROJECT_CHANGED_DURING_MIGRATION');
}
function lockMigration(plan){const releases=[];try{if(plan.migratedFrom)for(const root of [plan.migratedFrom,plan.project].sort()){checkAncestors(root);releases.push(core.acquireLock(root));}}catch(error){for(const release of releases.reverse())release();throw error;}return ()=>{for(const release of releases.splice(0).reverse())release();};}
module.exports={prepare,copyData,checkAncestors,lockMigration};

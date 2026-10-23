#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),core=require('./core.cjs'),sheets=require('./sheets.cjs');
function args(argv){const o={command:argv[0]||'doctor'};for(let i=1;i<argv.length;i++){if(!argv[i].startsWith('--')||!argv[i+1])throw Error('EXPECTED_NAMED_ARGUMENT');o[argv[i].slice(2)]=argv[++i];}return o;}
function project(o){if(o.project)return path.resolve(o.project);const runtime=path.join(__dirname,'../runtime.json');if(fs.existsSync(runtime))return JSON.parse(fs.readFileSync(runtime,'utf8')).project;throw Error('PROJECT_REQUIRED: --project <workspace/freeup-social-content-data>');}
function readInput(o){if(!o.input)throw Error('INPUT_JSON_REQUIRED');return JSON.parse(fs.readFileSync(path.resolve(o.input),'utf8'));}
async function main(argv){const o=args(argv),cmd=o.command;if(cmd==='template')return {source:`https://docs.google.com/spreadsheets/d/${sheets.schema.sourceTemplateId}/edit`,template:`https://docs.google.com/spreadsheets/d/${sheets.schema.freeupTemplateId}/copy`,mustCopy:true,schema:sheets.schema};
 if(cmd==='doctor'){const result={node:process.version,nodeReady:Number(process.versions.node.split('.')[0])>=22,skill:'freeup-social-content',templateId:sheets.schema.freeupTemplateId,engines:{},liveConnections:'Check with native host tools; not inferred from local files.'};for(const name of ['playwright','ffmpeg-static'])try{result.engines[name]={available:true,path:require.resolve(name)};}catch{result.engines[name]={available:false};}try{const p=project(o);result.project=p;result.pendingSync=core.pending(p).length;result.boundSheet=fs.existsSync(core.safePath(p,'Dữ liệu vận hành/sheet.json'));}catch{}return result;}
 const p=project(o);if(cmd==='init')return core.init(p);
 if(cmd==='save')return core.save(p,readInput(o));
 if(cmd==='list')return core.list(p);
 if(cmd==='get')return core.get(p,o.key);
 if(cmd==='pending')return core.pending(p);
 if(cmd==='approve')return core.approve(p,o.key,o.type,Number(o.revision));
 if(cmd==='prepare-publish')return core.preparePublish(p,o.key);
 if(cmd==='confirm-publish')return core.confirmPublish(p,o.key,readInput(o));
 if(cmd==='uncertain')return core.uncertain(p,o.key);
 if(cmd==='reconcile-absent')return core.reconcileAbsent(p,o.key,o.operation);
 if(cmd==='bind-sheet')return sheets.bind(p,readInput(o));
 if(cmd==='sheet-plan')return sheets.plan(p,readInput(o));
 if(cmd==='sheet-pull')return sheets.pull(p,readInput(o));
 if(cmd==='sheet-verify'){const d=readInput(o);return sheets.verifyWrites(p,d.snapshot,d.expected);}
 if(cmd==='render')return {media:await require('./render.cjs').render(p,readInput(o))};
 if(cmd==='assets-sync')return require('./assets.cjs').syncBundled(path.join(__dirname,'..'),p);
 if(cmd==='scheduler-plan')return require('./scheduler.cjs').schedulePlan(p,readInput(o));
 throw Error('UNKNOWN_COMMAND');
}
if(require.main===module)main(process.argv.slice(2)).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={main,args};

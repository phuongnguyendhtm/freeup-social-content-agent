'use strict';
const fs=require('node:fs'),path=require('node:path'),core=require('./core.cjs');
const schema=require('../references-schema.cjs');
const FORMATS={image:'Image',carousel:'Carousel',infographic:'Infographic',video:'Video B-Roll',idea:'Idea'};
const fingerprint=values=>core.hash(JSON.stringify(values));
function validateTemplate(snapshot){if(!snapshot||!Array.isArray(snapshot.sheets))throw Error('TEMPLATE_SCHEMA_MISMATCH');for(const rule of Object.values(schema.tabs)){const tab=snapshot.sheets.find(s=>s.title===rule.title);if(!tab||!Number.isInteger(tab.sheetId)||JSON.stringify(tab.headers)!==JSON.stringify(rule.headers)||JSON.stringify(tab.statuses)!==JSON.stringify(rule.statuses))throw Error('TEMPLATE_SCHEMA_MISMATCH: '+rule.title);}return true;}
function bind(root,snapshot){validateTemplate(snapshot);if(!snapshot.spreadsheetId||[schema.sourceTemplateId,schema.freeupTemplateId].includes(snapshot.spreadsheetId))throw Error('CUSTOMER_COPY_REQUIRED');const config={spreadsheetId:snapshot.spreadsheetId,templateId:schema.freeupTemplateId,boundAt:new Date().toISOString()};core.atomic(core.safePath(root,'Dữ liệu vận hành/sheet.json'),config);return config;}
function config(root,snapshot){validateTemplate(snapshot);const cfg=JSON.parse(fs.readFileSync(core.safePath(root,'Dữ liệu vận hành/sheet.json'),'utf8'));if(cfg.spreadsheetId!==snapshot.spreadsheetId||[schema.sourceTemplateId,schema.freeupTemplateId].includes(cfg.spreadsheetId))throw Error('SHEET_BINDING_MISMATCH');return cfg;}
function rowFor(t){const idea=t.format==='idea',d=t.details||{};const status=idea?(t.status==='production_approved'?schema.tabs.ideas.statuses[1]:schema.tabs.ideas.statuses[0]):t.status==='published'?schema.tabs.pipeline.statuses[2]:t.approval?.type==='publish'?schema.tabs.pipeline.statuses[1]:schema.tabs.pipeline.statuses[0];const values=idea?[t.id,d.source||'9BizClaw/OpenClaw',t.caption,d.hook||'',d.angle||'',d.pillar||'',d.funnel||'',d.mediaType||'',status,t.updatedAt]:[t.id,FORMATS[t.format],t.caption,(t.media||[]).join('\n'),t.channel,t.postTime||'',status];const meta={key:core.key(t),revision:t.revision,generation:t.syncGeneration,hash:fingerprint(values),permalink:t.published?.permalink||null};return {values,note:'freeup:v1:'+JSON.stringify(meta)};}
function parseNote(note){if(!String(note||'').startsWith('freeup:v1:'))return null;try{return JSON.parse(note.slice(10));}catch{return null;}}
function rowKey(values,idea=false){if(idea)return values[0]+'|idea|ideas';const format=Object.keys(FORMATS).find(k=>FORMATS[k]===values[1]);return [values[0],format,values[4]].join('|');}
function findRow(tab,t){const k=core.key(t);const hits=(tab.rows||[]).filter(r=>parseNote(r.note)?.key===k||rowKey(r.values,t.format==='idea')===k);if(hits.length>1)throw Error('DUPLICATE_SHEET_KEY');return hits[0];}
function plan(root,snapshot){
 const cfg=config(root,snapshot),requests=[],expected=[],bases=core.state(root).remoteBases||{};
 const nextRows=new Map(snapshot.sheets.map(t=>[t.sheetId,Math.max(1,...(t.rows||[]).map(r=>r.rowIndex+1))]));
 for(const q of core.pending(root)){
  const t=core.get(root,q.key),rule=t.format==='idea'?schema.tabs.ideas:schema.tabs.pipeline,tab=snapshot.sheets.find(s=>s.title===rule.title),existing=findRow(tab,t),want=rowFor(t);
  if(existing){const m=parseNote(existing.note),fp=fingerprint(existing.values),accepted=bases[q.key];if(!m||(m.hash!==fp&&!(accepted?.hash===fp&&accepted.revision===t.revision&&accepted.generation===t.syncGeneration)))throw Error('SHEET_CONFLICT: '+q.key);if(m.revision>t.revision||(m.generation||0)>t.syncGeneration)throw Error('REVISION_CONFLICT');}
  const rowIndex=existing?.rowIndex??nextRows.get(tab.sheetId);if(!existing)nextRows.set(tab.sheetId,rowIndex+1);
  const values=want.values.map(text=>({userEnteredValue:{stringValue:String(text??'')}}));
  requests.push({updateCells:{range:{sheetId:tab.sheetId,startRowIndex:rowIndex,endRowIndex:rowIndex+1,startColumnIndex:0,endColumnIndex:values.length},rows:[{values}],fields:'userEnteredValue'}});
  requests.push({updateCells:{range:{sheetId:tab.sheetId,startRowIndex:rowIndex,endRowIndex:rowIndex+1,startColumnIndex:0,endColumnIndex:1},rows:[{values:[{note:want.note}]}],fields:'note'}});
  expected.push({key:q.key,revision:t.revision,generation:t.syncGeneration,sheetId:tab.sheetId,rowIndex,values:want.values,note:want.note});
 }
 return {spreadsheetId:cfg.spreadsheetId,requests,expected};
}
function verifyWrites(root,snapshot,expected){config(root,snapshot);for(const e of expected){const tab=snapshot.sheets.find(t=>t.sheetId===e.sheetId),row=tab?.rows.find(r=>r.rowIndex===e.rowIndex);if(!row||JSON.stringify(row.values)!==JSON.stringify(e.values)||row.note!==e.note)throw Error('SHEET_READBACK_MISMATCH');core.ackSync(root,e.key,e.revision,e.sheetId+':'+e.rowIndex,e.generation);}return {verified:expected.length};}
function remoteBase(root,k,revision,values){core.transaction(root,s=>{if(s.tickets[k]?.revision!==revision)throw Error('REVISION_CONFLICT');s.remoteBases??={};s.remoteBases[k]={revision,generation:s.tickets[k].syncGeneration,hash:fingerprint(values)};return true;});}
function pull(root,snapshot){
 config(root,snapshot);const results=[];
 for(const tab of snapshot.sheets){const idea=tab.title===schema.tabs.ideas.title;
  for(const row of tab.rows||[]){
   const meta=parseNote(row.note);if(!meta)continue;let t;try{t=core.get(root,meta.key);}catch{continue;}
   const v=row.values,changed=meta.hash!==fingerprint(v);
   if(!changed)continue;
   if(t.revision!==meta.revision||t.syncGeneration!==meta.generation){const base=core.state(root).remoteBases?.[meta.key];if(base?.revision!==t.revision||base.generation!==t.syncGeneration||base.hash!==fingerprint(v))throw Error('SHEET_CONFLICT: '+meta.key);continue;}
   if(t.status==='published')continue;
   const caption=String(v[2]||''),media=idea?t.media:String(v[3]||'').split('\n').filter(Boolean),postTime=idea?t.postTime:String(v[5]||'')||null;
   const id=String(v[0]),channel=idea?t.channel:String(v[4]),format=idea?'idea':Object.keys(FORMATS).find(k=>FORMATS[k]===v[1]);
   if(id!==t.id||channel!==t.channel||format!==t.format)throw Error('IDENTITY_CHANGE_REVIEW_REQUIRED');
   const details=idea?{source:String(v[1]||''),hook:String(v[3]||''),angle:String(v[4]||''),pillar:String(v[5]||''),funnel:String(v[6]||''),mediaType:String(v[7]||'')}:t.details;
   const detailChanged=idea&&Object.keys(details).some(k=>details[k]!==((t.details||{})[k]||(k==='source'?'9BizClaw/OpenClaw':'')));
   const contentChanged=caption!==t.caption||JSON.stringify(media)!==JSON.stringify(t.media)||postTime!==(t.postTime||null);
   if(contentChanged||detailChanged){t=core.save(root,{...t,caption,media,details,postTime,expectedRevision:t.revision});remoteBase(root,meta.key,t.revision,v);results.push({key:meta.key,action:'edited',revision:t.revision});if(!idea||v[8]!==schema.tabs.ideas.statuses[1])continue;}
   const status=v[idea?8:6];
   if(status===(idea?schema.tabs.ideas.statuses[1]:schema.tabs.pipeline.statuses[1])&&t.approval?.type!==(idea?'produce':'publish')){core.approve(root,meta.key,idea?'produce':'publish',t.revision);remoteBase(root,meta.key,t.revision,v);results.push({key:meta.key,action:'approved'});}
   else if(!idea&&status===schema.tabs.pipeline.statuses[0]&&t.approval?.type==='publish'){t=core.save(root,{...t,expectedRevision:t.revision});remoteBase(root,meta.key,t.revision,v);results.push({key:meta.key,action:'approval_revoked'});}
  }
 }
 return results;
}
async function presentAndSync(root,key,adapter){let syncState='pending';try{await adapter.sync();syncState=core.pending(root).some(q=>q.key===key)?'pending':'synced';}catch{}const t=core.get(root,key);return {key,revision:t.revision,caption:t.caption,media:t.media,permalink:t.published?.permalink||null,syncState};}
module.exports={schema,FORMATS,validateTemplate,bind,rowFor,plan,verifyWrites,pull,presentAndSync,parseNote,fingerprint};

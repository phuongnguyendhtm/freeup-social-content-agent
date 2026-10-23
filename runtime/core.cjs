'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const FORMATS=new Set(['idea','image','carousel','infographic','video']);
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function fail(code){throw new Error(code);}
function safePath(root,...parts){root=path.resolve(root);const p=path.resolve(root,...parts),r=path.relative(root,p);if(r==='..'||r.startsWith('..'+path.sep)||path.isAbsolute(r))fail('OUTSIDE_PROJECT');let current=p;while(true){if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())fail('SYMLINK_NOT_ALLOWED');if(current===root)break;const parent=path.dirname(current);if(parent===current)fail('OUTSIDE_PROJECT');current=parent;}return p;}
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.'+crypto.randomUUID()+'.tmp';try{fs.writeFileSync(tmp,JSON.stringify(value,null,2));fs.renameSync(tmp,file);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}}
function init(root){root=path.resolve(root);fs.mkdirSync(root,{recursive:true});for(const dir of ['Tài nguyên đầu vào/Ảnh mẫu','Tài nguyên đầu vào/Video mẫu','Tài nguyên đầu vào/Nhạc nền','Tài nguyên đầu vào/Thương hiệu của tôi','Nội dung đã tạo','Dữ liệu vận hành'])fs.mkdirSync(safePath(root,dir),{recursive:true});const file=safePath(root,'Dữ liệu vận hành/state.json');try{fs.writeFileSync(file,JSON.stringify({version:1,tickets:{},outbox:{}},null,2),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}return {project:root,stateFile:file};}
function state(root){return JSON.parse(fs.readFileSync(safePath(root,'Dữ liệu vận hành/state.json'),'utf8'));}
function recoverLock(lock){
 const owner=path.join(lock,'owner.json');
 if(!fs.existsSync(lock))return;
 if(fs.existsSync(owner)){
  let metadata;try{metadata=JSON.parse(fs.readFileSync(owner,'utf8'));}catch{fail('LOCK_RECOVERY_REVIEW_REQUIRED');}
  if(!Number.isSafeInteger(metadata.pid)||metadata.pid<=0)fail('LOCK_RECOVERY_REVIEW_REQUIRED');
  try{process.kill(metadata.pid,0);fail('BUSY_RETRY_LATER');}catch(e){if(e.code!=='ESRCH')throw e;}
  fs.unlinkSync(owner);fs.rmdirSync(lock);
 }else{if(Date.now()-fs.statSync(lock).birthtimeMs<30000)fail('BUSY_RETRY_LATER');fs.rmdirSync(lock);}
}
function transaction(root,fn){
 init(root);const lock=safePath(root,'Dữ liệu vận hành/.lock'),owner=path.join(lock,'owner.json');
 try{fs.mkdirSync(lock);}catch(e){if(e.code!=='EEXIST')throw e;recoverLock(lock);try{fs.mkdirSync(lock);}catch{fail('BUSY_RETRY_LATER');}}
 const token=crypto.randomUUID();fs.writeFileSync(owner,JSON.stringify({pid:process.pid,token,createdAt:new Date().toISOString()}),{flag:'wx'});
 try{const s=state(root),result=fn(s);atomic(safePath(root,'Dữ liệu vận hành/state.json'),s);return structuredClone(result);}
 finally{if(fs.existsSync(owner)&&JSON.parse(fs.readFileSync(owner,'utf8')).token===token){fs.unlinkSync(owner);fs.rmdirSync(lock);}}
}
function validate(t){if(!/^[a-zA-Z0-9_-]{1,100}$/.test(t.id||''))fail('INVALID_TICKET_ID');if(!FORMATS.has(t.format))fail('INVALID_FORMAT');if(typeof t.channel!=='string'||!t.channel.trim()||t.channel.length>200||/[|\r\n]/.test(t.channel))fail('INVALID_CHANNEL');if(typeof t.caption!=='string'||t.caption.length>60000)fail('INVALID_CAPTION');if(t.postTime){if(!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(t.postTime))fail('TIMEZONE_REQUIRED');if(!Number.isFinite(Date.parse(t.postTime)))fail('INVALID_POST_TIME');}}
function key(t){return [t.id,t.format,t.channel].join('|');}
function mediaHashes(root,media=[]){if(!Array.isArray(media)||media.length>30)fail('INVALID_MEDIA');return media.map(p=>{const f=safePath(root,p);if(!fs.existsSync(f)||!fs.statSync(f).isFile())fail('MEDIA_NOT_FOUND');return {path:path.relative(root,f),sha256:hash(fs.readFileSync(f))};});}
function digestOf(t,media){return hash(JSON.stringify({caption:t.caption,format:t.format,channel:t.channel,postTime:t.postTime||null,media}));}
function digest(root,t){return digestOf(t,mediaHashes(root,t.media));}
function enqueue(s,t){t.syncGeneration=(t.syncGeneration||0)+1;const k=key(t);s.outbox[k]={key:k,revision:t.revision,generation:t.syncGeneration,attempts:0};}
function save(root,input){return transaction(root,s=>{const k=key(input),old=s.tickets[k];if(old&&input.expectedRevision!==old.revision)fail('REVISION_CONFLICT');if(!old&&input.expectedRevision!=null&&input.expectedRevision!==0)fail('REVISION_CONFLICT');if(old&&['publishing','uncertain'].includes(old.status))fail('RECONCILE_REQUIRED');if(old?.status==='published')fail('ALREADY_PUBLISHED_CREATE_NEW_TICKET');const t={...old,id:input.id,format:input.format,channel:input.channel,topic:input.topic??old?.topic??'',caption:input.caption??old?.caption??'',media:input.media??old?.media??[],details:{...old?.details,...input.details},postTime:Object.hasOwn(input,'postTime')?input.postTime:old?.postTime??null,revision:(old?.revision||0)+1,status:'draft',approval:null,updatedAt:new Date().toISOString()};validate(t);t.media=mediaHashes(root,t.media).map(m=>m.path);s.tickets[k]=t;enqueue(s,t);return t;});}
function get(root,k){const t=state(root).tickets[k];if(!t)fail('TICKET_NOT_FOUND');return structuredClone(t);}
function list(root){return Object.values(state(root).tickets);}
function approve(root,k,type,revision){if(!['produce','publish'].includes(type))fail('INVALID_APPROVAL_TYPE');return transaction(root,s=>{const t=s.tickets[k];if(!t)fail('TICKET_NOT_FOUND');if(t.revision!==revision)fail('REVISION_CONFLICT');if(['publishing','uncertain','published'].includes(t.status))fail('RECONCILE_OR_NEW_TICKET_REQUIRED');if(type==='publish'&&(!t.caption.trim()||!/^\d{5,30}$/.test(t.channel)))fail('CAPTION_AND_PAGE_REQUIRED');t.approval={type,revision,digest:digest(root,t),at:new Date().toISOString()};t.status=type==='publish'?'approved':'production_approved';enqueue(s,t);return t;});}
function preparePublish(root,k,now=Date.now()){return transaction(root,s=>{
 const t=s.tickets[k];if(!t)fail('TICKET_NOT_FOUND');if(t.status==='published')fail('ALREADY_PUBLISHED');if(['publishing','uncertain'].includes(t.status))fail('RECONCILE_REQUIRED');if(t.approval?.type!=='publish'||t.approval.revision!==t.revision)fail('PUBLISH_APPROVAL_REQUIRED');
 const files=(t.media||[]).map(p=>({path:p,bytes:fs.readFileSync(safePath(root,p))})),media=files.map(f=>({path:f.path,sha256:hash(f.bytes)}));
 if(t.approval.digest!==digestOf(t,media))fail('APPROVED_CONTENT_CHANGED');if(t.postTime&&Date.parse(t.postTime)>now)fail('NOT_DUE');if(t.postTime&&now-Date.parse(t.postTime)>15*60*1000)fail('MISSED_SCHEDULE_REVIEW_REQUIRED');if(!files.length)fail('MEDIA_REQUIRED');
 t.status='publishing';t.operationId=crypto.randomUUID();t.startedAt=new Date(now).toISOString();
 const dir=safePath(root,'Dữ liệu vận hành/publish-snapshots',t.operationId);fs.mkdirSync(dir,{recursive:true});t.uploadMedia=files.map((f,i)=>{const dst=path.join(dir,i+'-'+path.basename(f.path));fs.writeFileSync(dst,f.bytes,{flag:'wx'});return path.relative(root,dst);});
 return {operationId:t.operationId,key:k,revision:t.revision,pageId:t.channel,caption:t.caption,format:t.format,media:t.uploadMedia.map(p=>safePath(root,p)),digest:t.approval.digest};
 });}
function confirmPublish(root,k,result){return transaction(root,s=>{const t=s.tickets[k];if(!t||!['publishing','uncertain'].includes(t.status)||t.operationId!==result.operationId)fail('OPERATION_MISMATCH');if(result.verified!==true||typeof result.postId!=='string'||!result.postId)fail('VERIFIED_PROVIDER_RESULT_REQUIRED');let url;try{url=new URL(result.permalink);}catch{fail('INVALID_FACEBOOK_URL');}if(url.protocol!=='https:'||!['facebook.com','www.facebook.com','m.facebook.com'].includes(url.hostname))fail('INVALID_FACEBOOK_URL');t.status='published';t.published={postId:result.postId,permalink:url.href,verifiedAt:new Date().toISOString()};enqueue(s,t);return t;});}
function uncertain(root,k){return transaction(root,s=>{const t=s.tickets[k];if(!t||t.status!=='publishing')fail('OPERATION_MISMATCH');t.status='uncertain';return t;});}
function reconcileAbsent(root,k,operationId){return transaction(root,s=>{const t=s.tickets[k];if(!t||t.operationId!==operationId||!['publishing','uncertain'].includes(t.status))fail('OPERATION_MISMATCH');t.status='draft';t.approval=null;t.operationId=null;enqueue(s,t);return t;});}
function pending(root){return Object.values(state(root).outbox);}
function ackSync(root,k,revision,rowKey,generation){return transaction(root,s=>{const t=s.tickets[k];if(!t||revision!==t.revision)fail('REVISION_CONFLICT');if(t.syncGeneration!==generation)fail('SYNC_GENERATION_CONFLICT');if(typeof rowKey!=='string'||!rowKey)fail('SHEET_RECEIPT_REQUIRED');t.sheetRowKey=rowKey;delete s.outbox[k];return t;});}
module.exports={safePath,atomic,init,key,save,get,list,approve,preparePublish,confirmPublish,uncertain,reconcileAbsent,pending,ackSync,hash,digest,transaction,state};

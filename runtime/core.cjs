'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const FORMATS=new Set(['idea','text','image','carousel','infographic','video','broll','reels','comment_chain']);
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function fail(code){throw new Error(code);}
function safePath(root,...parts){root=path.resolve(root);const p=path.resolve(root,...parts),r=path.relative(root,p);if(r==='..'||r.startsWith('..'+path.sep)||path.isAbsolute(r))fail('OUTSIDE_PROJECT');let current=p;while(true){if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())fail('SYMLINK_NOT_ALLOWED');if(current===root)break;const parent=path.dirname(current);if(parent===current)fail('OUTSIDE_PROJECT');current=parent;}return p;}
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.'+crypto.randomUUID()+'.tmp';try{fs.writeFileSync(tmp,JSON.stringify(value,null,2));fs.renameSync(tmp,file);}finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}}
function ensure(root){root=path.resolve(root);fs.mkdirSync(root,{recursive:true});for(const dir of ['Tài nguyên đầu vào/Ảnh cá nhân','Tài nguyên đầu vào/Ảnh danh nhân','Tài nguyên đầu vào/Ảnh minh họa','Tài nguyên đầu vào/Video nền','Tài nguyên đầu vào/Ảnh mẫu','Tài nguyên đầu vào/Video mẫu','Tài nguyên đầu vào/Nhạc nền','Tài nguyên đầu vào/Thương hiệu của tôi','Nội dung đã tạo','Dữ liệu vận hành'])fs.mkdirSync(safePath(root,dir),{recursive:true});const file=safePath(root,'Dữ liệu vận hành/state.json');try{fs.writeFileSync(file,JSON.stringify({version:2,tickets:{}},null,2),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}return {project:root,stateFile:file};}
function readState(root){return JSON.parse(fs.readFileSync(safePath(root,'Dữ liệu vận hành/state.json'),'utf8'));}
function init(root){const result=ensure(root);if(readState(root).version===1)transaction(root,()=>true);return result;}
function state(root){init(root);return readState(root);}
function recoverLock(lock){const owner=path.join(lock,'owner.json');if(!fs.existsSync(lock))return;if(fs.existsSync(owner)){let metadata;try{metadata=JSON.parse(fs.readFileSync(owner,'utf8'));}catch{fail('LOCK_RECOVERY_REVIEW_REQUIRED');}if(!Number.isSafeInteger(metadata.pid)||metadata.pid<=0)fail('LOCK_RECOVERY_REVIEW_REQUIRED');try{process.kill(metadata.pid,0);fail('BUSY_RETRY_LATER');}catch(e){if(e.code!=='ESRCH')throw e;}fs.unlinkSync(owner);fs.rmdirSync(lock);}else{if(Date.now()-fs.statSync(lock).birthtimeMs<30000)fail('BUSY_RETRY_LATER');fs.rmdirSync(lock);}}
function transaction(root,fn){ensure(root);const lock=safePath(root,'Dữ liệu vận hành/.lock'),owner=path.join(lock,'owner.json');try{fs.mkdirSync(lock);}catch(e){if(e.code!=='EEXIST')throw e;recoverLock(lock);try{fs.mkdirSync(lock);}catch{fail('BUSY_RETRY_LATER');}}const token=crypto.randomUUID();fs.writeFileSync(owner,JSON.stringify({pid:process.pid,token,createdAt:new Date().toISOString()}),{flag:'wx'});try{const s=readState(root);if(s.version===1)migrateLegacy(root,s);if(s.version!==2)fail('UNSUPPORTED_DATA_VERSION');const result=fn(s);atomic(safePath(root,'Dữ liệu vận hành/state.json'),s);return structuredClone(result);}finally{if(fs.existsSync(owner)&&JSON.parse(fs.readFileSync(owner,'utf8')).token===token){fs.unlinkSync(owner);fs.rmdirSync(lock);}}}
function validate(t){if(!/^[a-zA-Z0-9_-]{1,100}$/.test(t.id||''))fail('INVALID_TICKET_ID');if(!FORMATS.has(t.format))fail('INVALID_FORMAT');if(typeof t.channel!=='string'||!t.channel.trim()||t.channel.length>200||/[|\r\n]/.test(t.channel))fail('INVALID_CHANNEL');if(typeof t.caption!=='string'||t.caption.length>60000)fail('INVALID_CAPTION');}
function key(t){return [t.id,t.format,t.channel].join('|');}
function mediaHashes(root,media=[]){if(!Array.isArray(media)||media.length>30)fail('INVALID_MEDIA');return media.map(p=>{const f=safePath(root,p);if(!fs.existsSync(f)||!fs.statSync(f).isFile())fail('MEDIA_NOT_FOUND');return {path:path.relative(root,f),sha256:hash(fs.readFileSync(f))};});}
function contentDir(root,t){const date=(t.createdAt||new Date().toISOString()).slice(0,10),channel=String(t.channel||'Facebook').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_');return safePath(root,'Nội dung đã tạo',date,channel,t.id,t.format);}
function renderDir(root,t){const normalized={...t,format:t.format||'image',channel:t.channel||'Facebook'},old=state(root).tickets[key(normalized)];const dir=safePath(contentDir(root,{...normalized,createdAt:old?.createdAt||t.createdAt}),'Bản dựng',crypto.randomUUID());fs.mkdirSync(dir,{recursive:true});return dir;}
function writeContent(root,t){const dir=contentDir(root,t);fs.mkdirSync(dir,{recursive:true});const caption=path.join(dir,'caption.txt'),document=path.join(dir,'noi-dung.md');fs.writeFileSync(caption,t.caption);fs.writeFileSync(document,`# ${t.topic||t.id}\n\n${t.caption}\n\n---\nMã: ${t.id} · Định dạng: ${t.format} · Phiên bản: ${t.revision}\n${(t.media||[]).map(p=>'- '+p).join('\n')}\n`);const master=path.join(path.dirname(dir),'master_content.md');if(t.masterContent||t.format==='text'||!fs.existsSync(master))fs.writeFileSync(master,t.masterContent||t.caption);t.masterFile=path.relative(root,master);t.captionFile=path.relative(root,caption);t.documentFile=path.relative(root,document);return t;}
function migrateLegacy(root,s){
 const backup=safePath(root,'Dữ liệu vận hành/archive-v1');fs.mkdirSync(backup,{recursive:true});
 if(!fs.existsSync(path.join(backup,'state.json')))atomic(path.join(backup,'state.json'),s);
 for(const [relative,name] of [['Dữ liệu vận hành/sheet.json','sheet.json'],['Tài nguyên đầu vào/Mẫu Sheet/FreeUp-Content-Dashboard.xlsx','FreeUp-Content-Dashboard.xlsx']]){
  const source=safePath(root,relative);if(!fs.existsSync(source))continue;
  let destination=path.join(backup,name);if(fs.existsSync(destination))destination=path.join(backup,crypto.randomUUID()+'-'+name);
  fs.renameSync(source,destination);
  const dir=path.dirname(source);if(relative.startsWith('Tài nguyên đầu vào/')&&!fs.readdirSync(dir).length)fs.rmdirSync(dir);
 }
 const tickets={};
 for(const old of Object.values(s.tickets||{})){
  const t={id:old.id,format:old.format,channel:old.channel,topic:old.topic||'',caption:old.caption||'',media:old.media||[],details:old.details||{},revision:old.revision||1,createdAt:old.createdAt||old.updatedAt||new Date().toISOString(),updatedAt:old.updatedAt||new Date().toISOString()};
  validate(t);writeContent(root,t);tickets[key(t)]=t;
 }
 for(const field of Object.keys(s))delete s[field];Object.assign(s,{version:2,tickets});
}
function save(root,input){return transaction(root,s=>{const normalized={...input,format:input.format||'text',channel:input.channel||(input.format==='idea'?'ideas':'Facebook')};validate({...normalized,caption:normalized.caption||''});const k=key(normalized),old=s.tickets[k];if(old&&input.expectedRevision!==old.revision)fail('REVISION_CONFLICT');if(!old&&input.expectedRevision!=null&&input.expectedRevision!==0)fail('REVISION_CONFLICT');const now=new Date().toISOString(),t={id:normalized.id,format:normalized.format,channel:normalized.channel,masterContent:input.masterContent??old?.masterContent,topic:input.topic??old?.topic??'',caption:input.caption??old?.caption??'',media:input.media??old?.media??[],details:{...old?.details,...input.details},revision:(old?.revision||0)+1,createdAt:old?.createdAt||now,updatedAt:now};validate(t);t.media=mediaHashes(root,t.media).map(m=>m.path);writeContent(root,t);s.tickets[k]=t;return t;});}
function get(root,k){const t=state(root).tickets[k];if(!t)fail('TICKET_NOT_FOUND');return structuredClone(t);}
function list(root){return Object.values(state(root).tickets);}
module.exports={safePath,atomic,init,key,save,get,list,hash,transaction,state,contentDir,renderDir};

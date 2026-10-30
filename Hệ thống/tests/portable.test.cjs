const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const installer=require('../install.cjs'),core=require('../runtime/core.cjs');
const base=path.join(__dirname,'../../verification');fs.mkdirSync(base,{recursive:true});
function fixture(t){const dir=fs.mkdtempSync(path.join(base,'portable-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return {host:'9bizclaw',native:false,workspace:path.join(dir,'host workspace'),project:path.join(dir,'FreeUp của học viên')};}
test('a selected FreeUp folder owns media, engine and all nine persistent skill pointers',t=>{
 const opts=fixture(t),r=installer.install(opts);assert.equal(r.project,opts.project);assert.equal(r.engineSkill,path.join(opts.project,'Hệ thống'));
 for(const name of r.skills){const pointer=JSON.parse(fs.readFileSync(path.join(r.skillRoot,name,'runtime.json')));assert.equal(pointer.project,opts.project);assert.equal(pointer.engineSkill,r.engineSkill);assert.equal(pointer.skillRoot,r.skillRoot);}
 assert.ok(fs.existsSync(path.join(r.engineSkill,'workflows/tao-noi-dung.md')));
 fs.writeFileSync(path.join(r.project,'Tài nguyên đầu vào/Ảnh cá nhân/ảnh của tôi.txt'),'keep');
 const again=installer.install({host:opts.host,native:false,workspace:opts.workspace});assert.equal(again.project,opts.project);assert.equal(fs.readFileSync(path.join(r.project,'Tài nguyên đầu vào/Ảnh cá nhân/ảnh của tôi.txt'),'utf8'),'keep');
});
test('changing from legacy data folder copies customer data and retains the original',t=>{
 const opts=fixture(t),old=installer.install({host:opts.host,native:false,workspace:opts.workspace});
 const saved=core.save(old.project,{id:'bai-cu',format:'text',channel:'Facebook',caption:'Bài học viên'});
 const r=installer.install(opts);assert.equal(r.project,opts.project);assert.equal(core.get(r.project,core.key(saved)).caption,'Bài học viên');assert.equal(core.get(old.project,core.key(saved)).caption,'Bài học viên');
 assert.equal(r.migratedFrom,old.project);
});
test('migration conflicts stop before changing registered pointers or customer files',t=>{
 const opts=fixture(t),old=installer.install({host:opts.host,native:false,workspace:opts.workspace});core.init(opts.project);
 core.save(old.project,{id:'old',format:'text',caption:'old'});core.save(opts.project,{id:'new',format:'text',caption:'new'});
 const pointerFile=path.join(old.skillRoot,'freeup-social-content/runtime.json'),before=fs.readFileSync(pointerFile);
 assert.throws(()=>installer.install(opts),/PROJECT_MIGRATION_CONFLICT/);assert.deepEqual(fs.readFileSync(pointerFile),before);assert.equal(core.list(opts.project)[0].caption,'new');
});
test('customer output folder and article filenames are Vietnamese while format keys stay stable',t=>{
 const opts=fixture(t),saved=core.save(opts.project,{id:'bai',format:'carousel',channel:'Facebook',caption:'Nội dung'});
 assert.equal(saved.format,'carousel');assert.equal(path.basename(saved.captionFile),'Bài viết.txt');assert.equal(path.basename(saved.masterFile),'Bài gốc.md');assert.equal(path.basename(path.dirname(saved.captionFile)),'Ảnh trượt');
});
test('a failed media reinstall invalidates the previous successful receipt',t=>{
 const opts=fixture(t),r=installer.install(opts),cp=require('node:child_process');
 t.mock.method(cp,'spawnSync',()=>({status:23,stderr:'MEDIA_TEST_FAILURE',stdout:''}));
 assert.throws(()=>installer.install({...opts,withMedia:true}),/MEDIA_TEST_FAILURE/);
 const receipt=JSON.parse(fs.readFileSync(path.join(r.project,'Dữ liệu vận hành/install-receipt.json')));assert.equal(receipt.verified,false);assert.equal(receipt.status,'failed');
});
test('an unavailable remembered project fails instead of silently creating an empty replacement',t=>{
 const opts=fixture(t),r=installer.install(opts);fs.renameSync(r.project,r.project+' moved');
 assert.throws(()=>installer.install({host:opts.host,native:false,workspace:opts.workspace}),/PROJECT_BINDING_MISSING/);assert.equal(fs.existsSync(r.project),false);
});
for(const stage of ['early','third-skill','engine'])test('migration can retry after an interrupted '+stage+' update',t=>{
 const opts=fixture(t),old=installer.install({host:opts.host,native:false,workspace:opts.workspace});core.save(old.project,{id:'kept',format:'text',caption:'Giữ bài'});
 const copy=fs.copyFileSync,read=fs.readdirSync;let failed=false;
 const mocked=stage==='early'?t.mock.method(fs,'readdirSync',function(dir,...args){if(!failed&&String(dir).includes('freeup-stage-')){failed=true;throw Error('INTERRUPTED_INSTALL');}return read(dir,...args);}):t.mock.method(fs,'copyFileSync',function(from,to,...args){
  if(!failed&&((stage==='third-skill'&&String(to).includes(path.join('skills','freeup-viet-bai'))&&String(from).includes('freeup-stage-'))||(stage==='engine'&&String(to).startsWith(path.join(opts.project,'Hệ thống')+path.sep)))){failed=true;throw Error('INTERRUPTED_INSTALL');}return copy(from,to,...args);
 });
 assert.throws(()=>installer.install(opts),/INTERRUPTED_INSTALL/);assert.equal(failed,true);mocked.mock.restore();
 const r=installer.install(opts);assert.equal(r.verified,true);assert.equal(core.list(r.project)[0].caption,'Giữ bài');
 for(const name of r.skills)assert.equal(JSON.parse(fs.readFileSync(path.join(r.skillRoot,name,'runtime.json'))).project,opts.project);
});
for(const location of ['Dữ liệu vận hành','Hệ thống/runtime'])test('installation refuses destination directory links at '+location,t=>{
 const opts=fixture(t);if(location.startsWith('Hệ thống'))installer.install(opts);else fs.mkdirSync(opts.project,{recursive:true});
 const external=path.join(path.dirname(opts.project),'outside'),dest=path.join(opts.project,location);fs.mkdirSync(external);
 if(fs.existsSync(dest))fs.renameSync(dest,dest+'.saved');fs.symlinkSync(external,dest,process.platform==='win32'?'junction':'dir');
 assert.throws(()=>installer.install(opts),/SYMLINK_NOT_ALLOWED|PROJECT_PATH_UNSAFE|DESTINATION_UNSAFE/);assert.deepEqual(fs.readdirSync(external),[]);
});
test('installing from an already bound folder cannot replace another workspace binding',t=>{
 const opts=fixture(t),r=installer.install(opts),before=fs.readFileSync(path.join(r.engineSkill,'runtime.json'));
 assert.throws(()=>installer.install({...opts,workspace:path.join(path.dirname(opts.workspace),'other workspace'),packageRoot:r.engineSkill}),/EXISTING_ENGINE_OWNER_MISMATCH/);
 assert.deepEqual(fs.readFileSync(path.join(r.engineSkill,'runtime.json')),before);
});
test('CLI refuses a missing selected data folder instead of creating an empty profile',async t=>{
 const opts=fixture(t);await assert.rejects(()=>require('../runtime/cli.cjs').main(['profile-status','--project',opts.project]),/PROJECT_BINDING_MISSING/);assert.equal(fs.existsSync(opts.project),false);
});
test('migration retries after state upgrade and media failure without comparing the transformed state to its old source',t=>{
 const opts=fixture(t),old=installer.install({host:opts.host,native:false,workspace:opts.workspace});
 core.atomic(path.join(old.project,'Dữ liệu vận hành/state.json'),{version:1,tickets:{}});
 const cp=require('node:child_process'),mock=t.mock.method(cp,'spawnSync',()=>({status:23,stderr:'MEDIA_TEST_FAILURE',stdout:''}));
 assert.throws(()=>installer.install({...opts,withMedia:true}),/MEDIA_TEST_FAILURE/);mock.mock.restore();
 const r=installer.install(opts);assert.equal(r.verified,true);
 assert.equal(JSON.parse(fs.readFileSync(path.join(r.project,'Dữ liệu vận hành/state.json'))).version,2);
 assert.equal(JSON.parse(fs.readFileSync(path.join(old.project,'Dữ liệu vận hành/state.json'))).version,1);
});
test('migration blocks normal content writes until all skill pointers have switched and releases locks on completion',t=>{
 const opts=fixture(t),old=installer.install({host:opts.host,native:false,workspace:opts.workspace});let attempted=false;
 const r=installer.install({...opts,onProgress(step){if(step==='install:freeup-social-content'){
  attempted=true;
  for(const project of [old.project,opts.project])assert.throws(()=>core.save(project,{id:'during',format:'text',caption:'Concurrent'}),/BUSY_RETRY_LATER/);
 }}});
 assert.equal(attempted,true);assert.equal(r.verified,true);
 for(const project of [old.project,opts.project])assert.equal(fs.existsSync(path.join(project,'Dữ liệu vận hành/.lock')),false);
 assert.equal(core.save(opts.project,{id:'after',format:'text',caption:'After'}).caption,'After');
});
test('installer resolves the operating system temporary directory alias before staging and cleans its stage',t=>{
 const opts=fixture(t),os=require('node:os'),parent=path.dirname(opts.project),temp=path.join(parent,'real-temp'),alias=path.join(parent,'temp-alias');
 fs.mkdirSync(temp);fs.symlinkSync(temp,alias,process.platform==='win32'?'junction':'dir');t.mock.method(os,'tmpdir',()=>alias);
 assert.equal(installer.install(opts).verified,true);assert.deepEqual(fs.readdirSync(temp),[]);
});

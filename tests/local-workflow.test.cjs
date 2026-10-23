const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const core=require('../runtime/core.cjs'),cli=require('../runtime/cli.cjs'),installer=require('../install.cjs');
const root=path.join(__dirname,'../verification');fs.mkdirSync(root,{recursive:true});
function project(){const p=fs.mkdtempSync(path.join(root,'local-workflow-'));test.after(()=>fs.rmSync(p,{recursive:true,force:true}));core.init(p);return p;}
test('customer can save a text article without a Page, connection or approval and open its caption file',()=>{
 const p=project(),caption='Giao quyền rõ ràng.\nĐội ngũ chủ động hơn.';
 const t=core.save(p,{id:'bai-001',format:'text',caption});
 assert.equal(t.channel,'Facebook');assert.equal(fs.readFileSync(core.safePath(p,t.captionFile),'utf8'),caption);
 assert.ok(fs.readFileSync(core.safePath(p,t.documentFile),'utf8').includes(caption));
 assert.equal(core.get(p,core.key(t)).caption,caption);assert.equal(core.list(p).length,1);
 const s=core.state(p);assert.equal(s.version,2);assert.equal(s.outbox,undefined);assert.equal(t.approval,undefined);
});
test('editing a saved article keeps its ID and updates the file with the new revision',()=>{
 const p=project(),t=core.save(p,{id:'bai-002',format:'text',caption:'Bản đầu'});
 assert.throws(()=>core.save(p,{...t,caption:'Ghi đè',expectedRevision:0}),/REVISION_CONFLICT/);
 const edited=core.save(p,{...t,caption:'Bản sửa',expectedRevision:1});
 assert.equal(edited.revision,2);assert.equal(edited.captionFile,t.captionFile);assert.equal(fs.readFileSync(core.safePath(p,t.captionFile),'utf8'),'Bản sửa');
});
test('upgrading an old project preserves content and lets the customer edit it without old publishing locks',()=>{
 const p=project(),file=core.safePath(p,'Dữ liệu vận hành/state.json'),key='cu-001|image|123456';
 fs.writeFileSync(file,JSON.stringify({version:1,tickets:{[key]:{id:'cu-001',format:'image',channel:'123456',caption:'Bài cũ',media:[],revision:3,status:'published',approval:{type:'publish'},postTime:'2099-01-01T00:00:00Z',createdAt:'2026-10-23T00:00:00Z'}},outbox:{[key]:{revision:3}}}));
 fs.writeFileSync(core.safePath(p,'Dữ liệu vận hành/sheet.json'),'{"spreadsheetId":"old-customer-sheet"}');
 const legacyTemplate=core.safePath(p,'Tài nguyên đầu vào/Mẫu Sheet/FreeUp-Content-Dashboard.xlsx');fs.mkdirSync(path.dirname(legacyTemplate),{recursive:true});fs.writeFileSync(legacyTemplate,'Mẫu cũ của khách');
 core.init(p);const t=core.get(p,key);assert.equal(t.caption,'Bài cũ');assert.equal(t.approval,undefined);assert.equal(t.postTime,undefined);
 const edited=core.save(p,{...t,caption:'Bài cũ đã sửa',expectedRevision:3});assert.equal(edited.revision,4);
 assert.equal(fs.existsSync(core.safePath(p,'Dữ liệu vận hành/sheet.json')),false);
 assert.ok(fs.existsSync(core.safePath(p,'Dữ liệu vận hành/archive-v1/state.json')));
 assert.equal(fs.existsSync(legacyTemplate),false);assert.equal(fs.readFileSync(core.safePath(p,'Dữ liệu vận hành/archive-v1/FreeUp-Content-Dashboard.xlsx'),'utf8'),'Mẫu cũ của khách');
});
test('removed integration commands cannot connect, schedule or publish',async()=>{
 const p=project();core.save(p,{id:'a',format:'idea',channel:'ideas',caption:'Một ý tưởng'});
 for(const command of ['template','bind-sheet','sheet-plan','sheet-pull','sheet-verify','pending','approve','prepare-publish','confirm-publish','uncertain','reconcile-absent','scheduler-plan'])
  await assert.rejects(()=>cli.main([command,'--project',p,'--key','a|idea|ideas','--type','produce','--revision','1']),/UNKNOWN_COMMAND/);
});
test('upgrading an installed skill removes retired integration code but keeps customer content',()=>{
 const p=project(),options={host:'codex',workspace:p,native:false},a=installer.install(options),skill=path.join(a.skillRoot,'freeup-social-content');
 fs.writeFileSync(path.join(skill,'runtime/sheets.cjs'),'retired');fs.writeFileSync(path.join(skill,'references/dang-bai.md'),'retired');
 core.save(a.project,{id:'keep',format:'idea',channel:'ideas',caption:'Giữ nội dung của khách'});
 installer.install(options);assert.equal(fs.existsSync(path.join(skill,'runtime/sheets.cjs')),false);assert.equal(fs.existsSync(path.join(skill,'references/dang-bai.md')),false);
 assert.equal(core.get(a.project,'keep|idea|ideas').caption,'Giữ nội dung của khách');
});

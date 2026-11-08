const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),core=require('../runtime/core.cjs'),assets=require('../runtime/assets.cjs');
fs.mkdirSync(path.join(__dirname,'../../verification'),{recursive:true});
test('downloaded gift contains usable input samples before installation and preserves learner replacements',t=>{
 const gift=path.resolve(__dirname,'../..'),engine=path.join(gift,'Hệ thống'),manifest=require('../assets/manifest.json');
 const project=fs.mkdtempSync(path.join(gift,'verification/preloaded-assets-'));
 t.after(()=>fs.rmSync(project,{recursive:true,force:true}));
 for(const asset of manifest.assets){
  const relative=path.join('Tài nguyên đầu vào',asset.destination),source=path.join(gift,relative);
  assert.ok(fs.existsSync(source),'Visible before install: '+relative);
  assert.equal(core.hash(fs.readFileSync(source)),asset.sha256,relative);
  const dest=path.join(project,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(source,dest);
 }
 const changed=manifest.assets.find(a=>a.kind==='personal-example'),file=path.join(project,'Tài nguyên đầu vào',changed.destination);
 fs.writeFileSync(file,'learner photo replaced before installation');
 core.init(project);
 const first=assets.syncBundled(engine,project);assert.equal(first.added.length,0);assert.deepEqual(first.preserved,[changed.destination]);
 assert.equal(fs.readFileSync(file,'utf8'),'learner photo replaced before installation');
 const ledger=JSON.parse(fs.readFileSync(path.join(project,'Dữ liệu vận hành/assets.json')));
 assert.equal(Object.keys(ledger).length,manifest.assets.length-1);
 assert.equal(assets.syncBundled(engine,project).preserved.includes(changed.destination),true);
});
test('asset update preserves customer edits and rejects altered package bytes',()=>{const p=fs.mkdtempSync(path.join(__dirname,'../../verification/assets-'));test.after(()=>fs.rmSync(p,{recursive:true,force:true}));const pkg=path.join(p,'package'),project=path.join(p,'data');core.init(project);fs.mkdirSync(path.join(pkg,'assets'),{recursive:true});fs.writeFileSync(path.join(pkg,'assets/a.txt'),'original');const manifest={version:'1',assets:[{file:'a.txt',destination:'Ảnh mẫu/a.txt',sha256:core.hash(Buffer.from('original'))}]};fs.writeFileSync(path.join(pkg,'assets/manifest.json'),JSON.stringify(manifest));assets.syncBundled(pkg,project);const dest=path.join(project,'Tài nguyên đầu vào/Ảnh mẫu/a.txt');fs.writeFileSync(dest,'customer');assert.equal(assets.syncBundled(pkg,project).preserved.length,1);assert.equal(fs.readFileSync(dest,'utf8'),'customer');fs.writeFileSync(path.join(pkg,'assets/a.txt'),'tampered');assert.throws(()=>assets.syncBundled(pkg,project),/ASSET_HASH_MISMATCH/);});

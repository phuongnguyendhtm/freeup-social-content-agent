const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const installer=require('../install.cjs');
const base=path.join(__dirname,'../verification');fs.mkdirSync(base,{recursive:true});
function fixture(t,scenario={}){
 const dir=fs.mkdtempSync(path.join(base,'native-test-')),workspace=path.join(dir,'Học viên mới'),stateDir=path.join(dir,'state');
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(stateDir,{recursive:true});
 fs.writeFileSync(path.join(stateDir,'openclaw.json'),JSON.stringify({agents:{entries:{main:{workspace,skills:['customer-skill']}}}}));
 fs.writeFileSync(path.join(stateDir,'scenario.json'),JSON.stringify(scenario));
 const cliDir=path.join(dir,'native');fs.mkdirSync(cliDir);fs.copyFileSync(path.join(__dirname,'fixtures/native-host.cjs'),path.join(cliDir,'native-host.cjs'));
 fs.writeFileSync(path.join(cliDir,'package.json'),JSON.stringify({name:'freeup-native-test-fixture',version:scenario.version||'2026.9.9'}));
 return {host:'9bizclaw',workspace,stateDir,cli:path.join(cliDir,'native-host.cjs'),node:process.execPath};
}
test('native failure retains the actual stdout error after long stderr warnings and writes a failure report',t=>{
 const opts=fixture(t,{noisyFailure:true});let error;try{installer.install(opts);}catch(e){error=e;}
 assert.ok(error);assert.match(error.message,/NATIVE_SPECIFIC_FAILURE/);
 assert.ok(error.reportPath&&fs.existsSync(error.reportPath));const report=JSON.parse(fs.readFileSync(error.reportPath,'utf8'));
 assert.equal(report.verified,false);assert.equal(report.status,'failed');assert.equal(report.failedStep,'install:freeup-social-content');
 assert.equal(report.commands.at(-1).exitCode,7);assert.match(report.commands.at(-1).stdout,/original root cause/);
 assert.equal(fs.existsSync(path.join(opts.workspace,'freeup-social-content-data','Dữ liệu vận hành/install-receipt.json')),false);
});
test('a failed native policy decision never becomes a direct-copy installation',t=>{
 const opts=fixture(t,{policyBlock:true});assert.throws(()=>installer.install(opts),/blocked by policy/);
 assert.equal(fs.existsSync(path.join(opts.workspace,'skills/freeup-social-content/SKILL.md')),false);
});
test('fresh native rename failure can repair only its own partially published package on Windows',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{partialRename:true}),receipt=installer.install(opts);
 assert.equal(receipt.verified,true);assert.equal(receipt.skills.length,9);
 assert.equal(receipt.updateModes['freeup-social-content'],'repair-owned-native-rename');
 assert.ok(receipt.backups.length);assert.ok(fs.existsSync(path.join(receipt.skillRoot,'freeup-social-content/SKILL.md')));
});
test('a registered name alone does not authorize overwriting another package',t=>{
 const opts=fixture(t),foreign=path.join(opts.workspace,'skills/freeup-social-content');fs.mkdirSync(foreign,{recursive:true});
 const text='---\nname: freeup-social-content\n---\nCustomer custom skill';fs.writeFileSync(path.join(foreign,'SKILL.md'),text);
 assert.throws(()=>installer.install(opts),/EXISTING_SKILL_OWNER_MISMATCH/);
 assert.equal(fs.readFileSync(path.join(foreign,'SKILL.md'),'utf8'),text);
});
test('native reinstall preserves customer data and dependencies and verifies all nine skills',t=>{
 const opts=fixture(t),a=installer.install(opts),engine=path.join(a.skillRoot,'freeup-social-content');
 fs.mkdirSync(path.join(engine,'node_modules/customer-sentinel'),{recursive:true});fs.writeFileSync(path.join(engine,'node_modules/customer-sentinel/file'),'keep');
 fs.writeFileSync(path.join(a.project,'customer.txt'),'unchanged');
 const b=installer.install(opts);assert.equal(b.verified,true);assert.equal(b.skills.length,9);
 assert.equal(fs.readFileSync(path.join(engine,'node_modules/customer-sentinel/file'),'utf8'),'keep');
 assert.equal(fs.readFileSync(path.join(b.project,'customer.txt'),'utf8'),'unchanged');
 const config=JSON.parse(fs.readFileSync(path.join(opts.stateDir,'openclaw.json'),'utf8'));
 assert.ok(config.agents.entries.main.skills.includes('customer-skill'));assert.equal(config.agents.entries.main.skills.length,10);
});
test('relative CLI and state paths resolve before the native child changes working directory',t=>{
 const opts=fixture(t);opts.cli=path.relative(process.cwd(),opts.cli);opts.stateDir=path.relative(process.cwd(),opts.stateDir);
 const result=installer.install(opts);assert.equal(result.verified,true);assert.equal(result.skills.length,9);
});
test('targeted allowlist changes never widen shared defaults used by other agents',()=>{
 const cfg={agents:{defaults:{skills:['shared']},entries:{main:{},other:{}}}};
 const result=installer.mergeAllowlist(cfg,'main');assert.deepEqual(result.agents.defaults.skills,['shared']);
 assert.deepEqual(result.agents.entries.main.skills,['shared','freeup-social-content']);assert.deepEqual(result.agents.entries.other,{});
});
test('media setup failure retains command diagnostics and never writes a successful receipt',t=>{
 const opts=fixture(t),pkg=path.join(opts.stateDir,'package');fs.mkdirSync(path.join(pkg,'runtime'),{recursive:true});
 for(const dir of ['assets','skills'])fs.cpSync(path.join(__dirname,'..',dir),path.join(pkg,dir),{recursive:true,filter:()=>true});
 for(const file of ['package.json','package-lock.json'])fs.copyFileSync(path.join(__dirname,'..',file),path.join(pkg,file));
 fs.writeFileSync(path.join(pkg,'runtime/setup.cjs'),"console.error('NPM_DOWNLOAD_FAILED: connection reset');process.exitCode=23;");
 let error;try{installer.install({...opts,packageRoot:pkg,withMedia:true});}catch(e){error=e;}
 assert.ok(error);const report=JSON.parse(fs.readFileSync(error.reportPath,'utf8'));
 assert.equal(report.status,'failed');assert.equal(report.failedStep,'media:setup');
 assert.match(report.commands.at(-1).stderr,/NPM_DOWNLOAD_FAILED/);assert.equal(report.commands.at(-1).exitCode,23);
 assert.equal(fs.existsSync(path.join(opts.workspace,'freeup-social-content-data','Dữ liệu vận hành/install-receipt.json')),false);
});

test('Windows final fs-safe rename EPERM with an absent target completes and verifies the native install',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),receipt=installer.install(opts);
 assert.equal(receipt.verified,true);assert.equal(receipt.skills.length,9);
 assert.equal(receipt.updateModes['freeup-social-content'],'repair-native-final-rename');
 assert.ok(fs.existsSync(path.join(receipt.skillRoot,'freeup-social-content/runtime/selftest.cjs')));
 const report=JSON.parse(fs.readFileSync(receipt.reportPath,'utf8'));
 assert.match(report.recoveredErrors[0].error,/EPERM/);assert.equal(report.status,'completed');
});

for(const [label,scenario] of [
 ['another target',{wrongTarget:true}],['a staging path outside the skill directory',{outsideStage:true}],
 ['a policy denial',{policyWithRename:true}],['a package changed after the native scan',{changedSource:true}],
 ['an unverified native version',{version:'2026.9.8'}]
])test('final rename recovery refuses '+label,{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true,...scenario});assert.throws(()=>installer.install(opts),/EPERM/);
 assert.equal(fs.existsSync(path.join(opts.workspace,'skills/freeup-social-content')),false);
});

test('final rename recovery never overwrites a directory created by another installer',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true,foreignTarget:true});assert.throws(()=>installer.install(opts),/EPERM/);
 const dest=path.join(opts.workspace,'skills/freeup-social-content');
 assert.deepEqual(fs.readdirSync(dest),['customer.txt']);assert.equal(fs.readFileSync(path.join(dest,'customer.txt'),'utf8'),'keep foreign data');
});

test('final rename recovery claims the target exclusively if another process wins the creation race',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),mkdir=fs.mkdirSync;
 t.mock.method(fs,'mkdirSync',function(dir,...args){
  if(path.resolve(dir)===dest&&!args.length){mkdir(dir);fs.writeFileSync(path.join(dir,'customer.txt'),'created concurrently');}
  return mkdir(dir,...args);
 });
 assert.throws(()=>installer.install(opts),/EPERM/);
 assert.deepEqual(fs.readdirSync(dest),['customer.txt']);assert.equal(fs.readFileSync(path.join(dest,'customer.txt'),'utf8'),'created concurrently');
});

test('final rename recovery must still pass native inventory before returning a successful receipt',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true,hideInventory:true});assert.throws(()=>installer.install(opts),/NATIVE_SKILL_NOT_READY/);
 assert.equal(fs.existsSync(path.join(opts.workspace,'freeup-social-content-data/Dữ liệu vận hành/install-receipt.json')),false);
});

test('final rename recovery does not copy into a replacement directory after claiming the target',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),read=fs.readdirSync;let replaced=false;
 t.mock.method(fs,'readdirSync',function(dir,...args){
  if(!replaced&&String(dir).includes('freeup-stage-')&&path.basename(dir)==='freeup-social-content'&&fs.existsSync(dest)){
   replaced=true;fs.renameSync(dest,dest+'.replaced');fs.mkdirSync(dest);
  }
  return read(dir,...args);
 });
 assert.throws(()=>installer.install(opts));assert.equal(replaced,true);assert.deepEqual(fs.readdirSync(dest),[]);
});

for(const filename of ['runtime.json','package.json'])test('a failed recovery copy of '+filename+' leaves a fresh install retryable',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),stat=fs.lstatSync;let failed=false;
 const mocked=t.mock.method(fs,'lstatSync',function(file,...args){
  if(!failed&&String(file).includes('freeup-stage-')&&path.basename(file)===filename&&fs.existsSync(dest)){
   failed=true;throw Object.assign(new Error('PROBE_COPY_IO_FAILURE'),{code:'EIO'});
  }
  return stat(file,...args);
 });
 assert.throws(()=>installer.install(opts),/PROBE_COPY_IO_FAILURE/);assert.equal(failed,true);assert.equal(fs.existsSync(dest),false);
 mocked.mock.restore();assert.equal(installer.install(opts).verified,true);
});

test('final rename recovery rejects a replaced skills parent',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),parent=path.join(opts.workspace,'skills'),dest=path.join(parent,'freeup-social-content'),read=fs.readdirSync;let replaced=false;
 t.mock.method(fs,'readdirSync',function(dir,...args){
  if(!replaced&&String(dir).includes('freeup-stage-')&&path.basename(dir)==='freeup-social-content'&&fs.existsSync(dest)){
   replaced=true;fs.renameSync(parent,parent+'.replaced');fs.mkdirSync(parent);fs.mkdirSync(dest);
  }
  return read(dir,...args);
 });
 assert.throws(()=>installer.install(opts),/INSTALL_RECOVERY_DIRECTORY_CHANGED/);assert.equal(replaced,true);assert.deepEqual(fs.readdirSync(dest),[]);
});

test('failed recovery cleanup preserves foreign entries added during the copy',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),stat=fs.lstatSync;let failed=false;
 t.mock.method(fs,'lstatSync',function(file,...args){
  if(!failed&&String(file).includes('freeup-stage-')&&path.basename(file)==='package.json'&&fs.existsSync(dest)){
   failed=true;fs.writeFileSync(path.join(dest,'customer.txt'),'keep');throw new Error('PROBE_COPY_IO_FAILURE');
  }
  return stat(file,...args);
 });
 assert.throws(()=>installer.install(opts),/PROBE_COPY_IO_FAILURE/);assert.equal(failed,true);
 assert.deepEqual(fs.readdirSync(dest),['customer.txt']);assert.equal(fs.readFileSync(path.join(dest,'customer.txt'),'utf8'),'keep');
});

test('a partial file write during recovery is removed and can be retried',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),write=fs.writeFileSync;let failed=false;
 const mocked=t.mock.method(fs,'writeFileSync',function(file,...args){
  if(!failed&&typeof file==='number'){failed=true;write(file,'partial');throw Object.assign(new Error('PROBE_DISK_FULL'),{code:'ENOSPC'});}
  return write(file,...args);
 });
 assert.throws(()=>installer.install(opts),/PROBE_DISK_FULL/);assert.equal(failed,true);assert.equal(fs.existsSync(dest),false);
 mocked.mock.restore();assert.equal(installer.install(opts).verified,true);
});

for(const field of ['dev','ino'])for(const target of ['parent','root'])test('recovery refuses an unknown '+field+' identity for its '+target,{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),parent=path.join(opts.workspace,'skills'),dest=path.join(parent,'freeup-social-content'),stat=fs.lstatSync;
 const guarded=target==='parent'?parent:dest;let observed=false;
 t.mock.method(fs,'lstatSync',function(file,options){
  const value=stat(file,options);
  if(value&&options?.bigint&&path.resolve(file)===guarded){observed=true;value[field]=0n;}
  return value;
 });
 assert.throws(()=>installer.install(opts),/INSTALL_RECOVERY_IDENTITY_UNAVAILABLE/);assert.equal(observed,true);
 if(target==='parent')assert.equal(fs.existsSync(dest),false);
 else assert.deepEqual(fs.readdirSync(dest),[]);
});

for(const field of ['dev','ino'])test('recovery neither writes nor removes a file with unknown '+field+' identity',{skip:process.platform!=='win32'},t=>{
 const opts=fixture(t,{finalRename:true}),dest=path.join(opts.workspace,'skills/freeup-social-content'),stat=fs.fstatSync;let observed=false;
 t.mock.method(fs,'fstatSync',function(fd,options){const value=stat(fd,options);if(options?.bigint){observed=true;value[field]=0n;}return value;});
 assert.throws(()=>installer.install(opts),/INSTALL_RECOVERY_IDENTITY_UNAVAILABLE/);assert.equal(observed,true);
 assert.deepEqual(fs.readdirSync(dest),['runtime.json']);assert.equal(fs.readFileSync(path.join(dest,'runtime.json'),'utf8'),'');
});

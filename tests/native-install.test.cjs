const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const installer=require('../install.cjs');
const base=path.join(__dirname,'../verification');fs.mkdirSync(base,{recursive:true});
function fixture(t,scenario={}){
 const dir=fs.mkdtempSync(path.join(base,'native-test-')),workspace=path.join(dir,'Học viên mới'),stateDir=path.join(dir,'state');
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));fs.mkdirSync(stateDir,{recursive:true});
 fs.writeFileSync(path.join(stateDir,'openclaw.json'),JSON.stringify({agents:{entries:{main:{workspace,skills:['customer-skill']}}}}));
 fs.writeFileSync(path.join(stateDir,'scenario.json'),JSON.stringify(scenario));
 return {host:'9bizclaw',workspace,stateDir,cli:path.join(__dirname,'fixtures/native-host.cjs'),node:process.execPath};
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

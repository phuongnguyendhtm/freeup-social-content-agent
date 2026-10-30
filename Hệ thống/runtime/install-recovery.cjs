'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');

function stageDigest(root){
 const entries=[];
 function walk(dir,relative=''){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   const file=path.join(dir,entry.name),name=path.join(relative,entry.name),stat=fs.lstatSync(file);
   if(stat.isSymbolicLink()||(!stat.isDirectory()&&!stat.isFile())||(stat.isFile()&&stat.nlink!==1))throw Error('UNSAFE_INSTALL_STAGE');
   if(stat.isDirectory()){entries.push([name,'directory']);walk(file,name);}
   else entries.push([name,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);
  }
 }
 walk(root);return crypto.createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}

function nativeMessages(command){
 return [command.stderr,command.stdout].join('\n').split(/\r?\n/).map(line=>{
  try{const item=JSON.parse(line);return typeof item.message==='string'?item.message:line;}catch{return line;}
 }).map(line=>line.trim()).filter(Boolean);
}

// Only the final publication error of the inspected native 2026.9.9 pipeline
// qualifies. Native policy/scan runs before this point; other errors stay fatal.
function isFinalRenameFailure(error,version,destination){
 const command=error.nativeCommand;
 if(process.platform!=='win32'||version!=='2026.9.9'||!command||command.error)return false;
 const messages=nativeMessages(command);
 if(/policy|blocked|denied|scan failed/i.test(messages.join('\n')))return false;
 const normalize=value=>path.win32.normalize(value).toLowerCase();
 for(const message of messages){
  const match=message.match(/^failed to install skill:\s*Error:\s*(?:EPERM|EBUSY):[^\r\n]*, rename '([^']+)' -> '([^']+)'$/i);
  if(!match)continue;
  const from=path.win32.normalize(match[1]),to=path.win32.normalize(match[2]);
  if(/^\.fs-safe-move-\d+-[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\.tmp$/i.test(path.win32.basename(from))&&normalize(path.win32.dirname(from))===normalize(path.dirname(destination))&&normalize(to)===normalize(destination))return true;
 }
 return false;
}

function knownIdentity(stat){return stat&&stat.dev!==0n&&stat.dev!==0&&stat.ino!==0n&&stat.ino!==0;}
function requireIdentity(stat){if(!knownIdentity(stat))throw Error('INSTALL_RECOVERY_IDENTITY_UNAVAILABLE');}

function directoryGuard(file){
 const stat=fs.lstatSync(file,{bigint:true}),real=fs.realpathSync.native(file);
 requireIdentity(stat);
 if(!stat.isDirectory()||stat.isSymbolicLink())throw Error('INSTALL_RECOVERY_DIRECTORY_CHANGED');
 const assert=()=>{
  const current=fs.lstatSync(file,{bigint:true});
  requireIdentity(current);
  if(!current.isDirectory()||current.isSymbolicLink()||current.dev!==stat.dev||current.ino!==stat.ino||fs.realpathSync.native(file)!==real)throw Error('INSTALL_RECOVERY_DIRECTORY_CHANGED');
 };
 return {file,dev:stat.dev,ino:stat.ino,kind:'directory',assert};
}

function copyExclusive(source,destination,assertCurrent,created){
 assertCurrent();
 const rank=name=>name==='runtime.json'?0:name==='package.json'?1:2;
 for(const entry of fs.readdirSync(source,{withFileTypes:true}).sort((a,b)=>rank(a.name)-rank(b.name))){
  assertCurrent();
  const from=path.join(source,entry.name),to=path.join(destination,entry.name),stat=fs.lstatSync(from);
  if(stat.isSymbolicLink()||(!stat.isFile()&&!stat.isDirectory())||(stat.isFile()&&stat.nlink!==1))throw Error('UNSAFE_INSTALL_STAGE');
  if(stat.isDirectory()){
   fs.mkdirSync(to);const guard=directoryGuard(to);created.push({...guard,assertParent:assertCurrent});
   copyExclusive(from,to,()=>{assertCurrent();guard.assert();},created);
  }else{
   const fd=fs.openSync(to,'wx');
   try{const own=fs.fstatSync(fd,{bigint:true});requireIdentity(own);created.push({file:to,dev:own.dev,ino:own.ino,kind:'file',assertParent:assertCurrent});fs.writeFileSync(fd,fs.readFileSync(from));}
   finally{fs.closeSync(fd);}
  }
  assertCurrent();
 }
}

function cleanupCreated(created){
 for(const entry of [...created].reverse())try{
  entry.assertParent();const current=fs.lstatSync(entry.file,{bigint:true,throwIfNoEntry:false});
  if(!knownIdentity(entry)||!knownIdentity(current)||current.isSymbolicLink()||current.dev!==entry.dev||current.ino!==entry.ino)continue;
  if(entry.kind==='directory')fs.rmdirSync(entry.file);else fs.unlinkSync(entry.file);
 }catch{/* Leave changed paths, foreign children and locked files in place. */}
}

function recoverFinalRename({error,version,stage,destination,wasPresent,digest}){
 if(wasPresent||!isFinalRenameFailure(error,version,destination)||fs.lstatSync(destination,{throwIfNoEntry:false}))return false;
 try{if(stageDigest(stage)!==digest)return false;}catch{return false;}
 // Claim only a new target. Keep directory identities around every mutation;
 // cleanup removes only this attempt's entries, never a replaced or foreign tree.
 const parent=directoryGuard(path.dirname(destination));parent.assert();
 try{fs.mkdirSync(destination);}catch(error){if(error.code==='EEXIST')return false;throw error;}
 const root=directoryGuard(destination),created=[{...root,assertParent:parent.assert}],assertCurrent=()=>{parent.assert();root.assert();};
 try{
  copyExclusive(stage,destination,assertCurrent,created);assertCurrent();
  if(stageDigest(destination)!==digest)throw Error('RECOVERED_INSTALL_MISMATCH');
  assertCurrent();return true;
 }catch(copyError){
  cleanupCreated(created);
  if(fs.existsSync(destination))copyError.message+='\nRECOVERY_CLEANUP_INCOMPLETE: '+destination;
  throw copyError;
 }
}
module.exports={stageDigest,recoverFinalRename};

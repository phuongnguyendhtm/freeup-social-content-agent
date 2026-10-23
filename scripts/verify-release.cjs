'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),schema=require('../references-schema.cjs'),manifest=require('../assets/manifest.json');
const errors=[];
for(const file of ['README.md','AGENTS.md','INSTALL.md','SKILL.md','package-lock.json','install.cjs','runtime/cli.cjs','skills/freeup-social-content/references/sheet-mau.md'])if(!fs.existsSync(path.join(root,file)))errors.push('Missing '+file);
if(!schema.freeupTemplateId||schema.freeupTemplateId===schema.sourceTemplateId)errors.push('Missing separate FreeUp template');
if(manifest.assets.length<4)errors.push('Sample assets incomplete');
for(const a of manifest.assets){const file=path.join(root,'assets',a.file);if(!fs.existsSync(file)||crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==a.sha256)errors.push('Asset checksum '+a.file);}
for(const dir of ['runtime','skills'])walk(path.join(root,dir));
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(/\.(cjs|md|json)$/.test(file)){const s=fs.readFileSync(file,'utf8');if(/D:\\\\9Bizclaw|C:\\\\Users\\\\Admin/.test(s))errors.push('Creator absolute path '+file);if(/(?:gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9]{30,})/.test(s))errors.push('Credential-like literal '+file);}}}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(JSON.stringify({valid:true,version:manifest.version,assets:manifest.assets.length,templateId:schema.freeupTemplateId}));

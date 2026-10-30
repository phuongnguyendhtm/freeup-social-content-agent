'use strict';
const fs=require('node:fs'),path=require('node:path'),{randomUUID}=require('node:crypto');
const core=require('./core.cjs'),onboarding=require('./onboarding.cjs'),render=require('./render.cjs');
async function main(){
 const engine=path.join(__dirname,'..'),runtime=JSON.parse(fs.readFileSync(path.join(engine,'runtime.json'),'utf8'));
 const check=await require('./doctor.cjs').doctor({root:engine,probe:true});if(!check.ready)throw Error('SELFTEST_ENGINE_NOT_READY: '+JSON.stringify(check.engines));
 const project=core.safePath(runtime.project,'Dữ liệu vận hành/kiểm tra cài đặt',randomUUID());
 core.init(project);require('./assets.cjs').syncBundled(engine,project);
 const profile=onboarding.merge(project,{brand:'FreeUp QA',product:'Bộ quà tặng nội dung',audience:'Học viên',usp:'Thực hành',tone:'Rõ ràng',pronouns:'mình/bạn'},'Hồ sơ giả lập kiểm thử bộ cài, không phải hồ sơ khách');
 if(profile.ready)throw Error('SELFTEST_CONFIRMATION_GATE');onboarding.confirm(project,profile.revision);
 const guide=onboarding.guide(project);if(!fs.existsSync(guide.path))throw Error('SELFTEST_GUIDE_MISSING');
 for(let n=1;n<=8;n++)if(onboarding.choose(project,n).number!==n)throw Error('SELFTEST_MENU');
 const footage='Tài nguyên đầu vào/Video nền/freeup-background.mp4',music='Tài nguyên đầu vào/Nhạc nền/freeup-focus.wav';
 const briefs=[
  {id:'kiem-tra-anh',format:'image',title:'Chủ động từ việc nhỏ',body:'Rõ kết quả. Rõ giới hạn. Rõ thời điểm báo lại.'},
  {id:'kiem-tra-carousel',format:'carousel',slides:[{title:'Giao việc rõ ràng',body:'Bắt đầu từ kết quả mong muốn.'},{title:'Thống nhất giới hạn',body:'Đội ngũ biết việc nào được tự quyết.'},{title:'Hẹn thời điểm báo lại',body:'Theo dõi tiến độ và hỗ trợ kịp thời.'}]},
  {id:'kiem-tra-infographic',format:'infographic',title:'Ba bước giao việc',points:['Nêu kết quả','Chốt giới hạn','Hẹn báo lại']},
  {id:'kiem-tra-broll',format:'broll',music,scenes:[{layout:'pov',footage,duration:3,headline:'Rõ quyền để đội ngũ chủ động'}]},
  {id:'kiem-tra-reels',format:'reels',music,scenes:[{layout:'title_hook',footage,duration:2,headline:'Giao việc rõ ràng'},{layout:'list_cascade',footage,duration:2,headline:'Chốt trước khi giao',points:['Kết quả','Giới hạn']},{layout:'quote_box',footage,duration:2,headline:'Hẹn thời điểm báo lại'}]}
 ];
 const outputs=[];
 for(const brief of briefs){
  const media=await render.render(project,brief);if(!media.length||media.some(file=>!fs.existsSync(file)||fs.statSync(file).size<100))throw Error('SELFTEST_OUTPUT_MISSING');
  const saved=core.save(project,{id:brief.id,format:brief.format,caption:'Nội dung kiểm thử FreeUp. Không dùng làm hồ sơ khách.',media});
  if(fs.readFileSync(core.safePath(project,saved.captionFile),'utf8')!==saved.caption)throw Error('SELFTEST_CAPTION');
  outputs.push({format:brief.format,files:media});console.error('FreeUp: đã kiểm tra '+brief.format);
 }
 const report={passed:true,version:require('../package.json').version,checkedAt:new Date().toISOString(),project,guide:guide.path,menuChoices:8,outputs};
 const reportPath=core.safePath(runtime.project,'Dữ liệu vận hành/kiem-tra-cai-dat.json');core.atomic(reportPath,report);
 return {...report,reportPath};
}
if(require.main===module)main().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.stack);process.exitCode=1;});
module.exports={main};

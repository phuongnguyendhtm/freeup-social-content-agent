'use strict';
const installer=require('./Hệ thống/install.cjs');
if(require.main===module)installer.runCLI(process.argv.slice(2),__dirname);
module.exports=installer;

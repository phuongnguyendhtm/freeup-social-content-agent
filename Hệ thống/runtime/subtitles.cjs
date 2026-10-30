'use strict';
function activeLineAt(lines,time){const active=lines.findLast(line=>time>=line.start&&time<line.end);if(active)return active;return lines.findLast((line,index)=>time>=line.end&&time<Math.min(line.end+0.8,lines[index+1]?.start??Infinity));}
module.exports={activeLineAt};

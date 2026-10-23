'use strict';
function assertCanvasBounds(rect,canvas){if(!rect||![rect.left,rect.top,rect.right,rect.bottom,rect.width,rect.height].every(Number.isFinite)||rect.width<=0||rect.height<=0||rect.left < -1||rect.top < -1||rect.right>canvas.width+1||rect.bottom>canvas.height+1)throw Error('CONTENT_OUTSIDE_CANVAS');return true;}
module.exports={assertCanvasBounds};

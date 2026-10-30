'use strict';
function safeLog(value){return String(value||'').replace(/\x1b\[[0-9;]*m/g,'').replace(/\bBearer\s+[^\s"']+/gi,'Bearer [REDACTED]').replace(/(["']?(?:api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret)["']?\s*[:=]\s*)["']?[^\s,"'}]+["']?/gi,'$1[REDACTED]').replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]+|sk-[A-Za-z0-9_-]{20,})\b/g,'[REDACTED]').slice(-65536);}
module.exports={safeLog};

const {neon}=require('@neondatabase/serverless');
const {timingSafeEqual}=require('node:crypto');
const defaults=require('../content-defaults.json');
function db(){if(!process.env.DATABASE_URL)throw Error('Storage unavailable');return neon(process.env.DATABASE_URL)}
function authorized(req){const expected=process.env.CMS_ADMIN_KEY||'';const actual=(req.headers.authorization||'').replace(/^Bearer /,'');return expected.length>=32&&actual.length===expected.length&&timingSafeEqual(Buffer.from(actual),Buffer.from(expected))}
function sameOrigin(req){const origin=req.headers.origin;return !origin||origin===`https://${req.headers.host}`||origin===`http://${req.headers.host}`}
function text(x,max=6000){return typeof x==='string'&&x.length<=max}
function url(x){return text(x,2048)&&(/^assets\/[\w.-]+$/.test(x)||/^\/api\/media\?id=[0-9a-f-]{36}$/.test(x)||(()=>{try{return new URL(x).protocol==='https:'}catch{return false}})())}
function validate(d){if(!d||typeof d!=='object')return false;
if(!d.texts||Object.keys(d.texts).length!==Object.keys(defaults.texts).length||!Object.keys(defaults.texts).every(k=>text(d.texts[k])))return false;
if(!d.images||!Object.keys(defaults.images).every(k=>d.images[k]&&url(d.images[k].src)&&text(d.images[k].alt,500)))return false;
for(const [key,fields] of [['gallery',['title']],['videos',['title']],['reviews',['title','storyTitle','badge','caption','quote','author','detail','extraQuote','extraAuthor']]]){
 if(!Array.isArray(d[key])||d[key].length>60)return false;
 for(const item of d[key])if(!item||!url(item.image)||!fields.every(f=>text(item[f]||''))||(key!=='gallery'&&!url(item.url))||(key==='gallery'&&!['suites','convivencia'].includes(item.category)))return false;
}return true}
function headers(res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')}
module.exports={db,authorized,sameOrigin,validate,headers,defaults};

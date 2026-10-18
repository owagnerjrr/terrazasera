const {randomUUID}=require('node:crypto');
const {db,authorized,sameOrigin,headers}=require('../lib/cms.cjs');
module.exports=async(req,res)=>{try{const sql=db();if(req.method==='GET'){
 const id=req.query?.id;if(!/^[0-9a-f-]{36}$/.test(id||''))return res.status(400).end();
 const rows=await sql`SELECT mime,data FROM cms_media WHERE id=${id}::uuid`;if(!rows.length)return res.status(404).end();
 res.setHeader('Content-Type',rows[0].mime);res.setHeader('Cache-Control','public,max-age=31536000,immutable');res.setHeader('X-Content-Type-Options','nosniff');return res.send(Buffer.from(rows[0].data,'base64'));
 }headers(res);if(req.method!=='POST')return res.status(405).end();
 if(!authorized(req)||!sameOrigin(req))return res.status(403).json({error:'Acesso inválido.'});
 const {data,mime}=req.body||{};if(mime!=='image/webp'||typeof data!=='string'||data.length>2000000||!/^[A-Za-z0-9+/]+={0,2}$/.test(data))return res.status(400).json({error:'Envie uma imagem válida de até 1,5 MB.'});
 const buffer=Buffer.from(data,'base64');if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')return res.status(400).json({error:'Imagem inválida.'});
 const id=randomUUID();await sql`INSERT INTO cms_media(id,mime,data) VALUES(${id}::uuid,${mime},${data})`;return res.json({url:`/api/media?id=${id}`});
 }catch(e){console.error('Media request failed',e.message);return res.status(503).json({error:'Não foi possível enviar a foto. Tente novamente.'})}};

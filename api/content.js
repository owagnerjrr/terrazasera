const {db,authorized,sameOrigin,validate,headers,defaults}=require('../lib/cms.cjs');
module.exports=async(req,res)=>{headers(res);try{
 const sql=db();
 if(req.method==='GET'){
  const admin=req.query?.draft==='1';if(admin&&!authorized(req))return res.status(401).json({error:'Use o link administrativo completo.'});
  const rows=await sql`SELECT published,draft,revision FROM cms_content WHERE id=1`;
  return res.json({content:rows[0]?(admin?rows[0].draft:rows[0].published):defaults,revision:rows[0]?.revision||0});
 }
 if(req.method!=='PUT'){res.setHeader('Allow','GET, PUT');return res.status(405).end()}
 if(!authorized(req)||!sameOrigin(req))return res.status(403).json({error:'Acesso administrativo inválido.'});
 const {content,revision,action}=req.body||{};
 if(!validate(content)||!Number.isInteger(revision)||!['draft','publish'].includes(action))return res.status(400).json({error:'Revise os campos e os links. Use links https para vídeos e fontes.'});
 const json=JSON.stringify(content);if(Buffer.byteLength(json)>600000)return res.status(413).json({error:'Conteúdo muito grande.'});
 let rows;
 if(revision===0) rows=await sql`INSERT INTO cms_content(id,published,draft,revision) VALUES(1,${action==='publish'?json:JSON.stringify(defaults)}::jsonb,${json}::jsonb,1) ON CONFLICT DO NOTHING RETURNING revision`;
 else rows=await sql`UPDATE cms_content SET draft=${json}::jsonb,published=CASE WHEN ${action}='publish' THEN ${json}::jsonb ELSE published END,revision=revision+1,updated_at=now() WHERE id=1 AND revision=${revision} RETURNING revision`;
 if(!rows.length)return res.status(409).json({error:'O conteúdo mudou em outra janela. Recarregue o painel antes de salvar.'});
 // History is supplementary: a history failure must not report a successful save as failed.
 try{await sql`INSERT INTO cms_history(revision,content) VALUES(${rows[0].revision},${json}::jsonb) ON CONFLICT DO NOTHING`}catch(e){console.error('CMS history unavailable')}
 return res.json({revision:rows[0].revision});
}catch(e){console.error('CMS request failed',e.message);return res.status(503).json({error:'Não foi possível acessar o conteúdo. Tente novamente.'})}};

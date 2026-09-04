export const seedClients = [
  ['Sindpetshop-SP','@sindpetshop_sp','https://www.instagram.com/sindpetshop_sp/'],
  ['Pizzaria Venâncio','@pizzariavenancio','https://www.instagram.com/pizzariavenancio/'],
  ['SEON','@seon.co','https://www.instagram.com/seon.co/'],
  ['CZK Drills','@czkdrills','https://www.instagram.com/czkdrills/'],
  ['MIBIS Dog','@mibisdog','https://www.instagram.com/mibisdog/'],
  ['Eventos Publi','@eventospubli','https://www.instagram.com/eventospubli/'],
  ['Eazy Club','@eazyclubperus_','https://www.instagram.com/eazyclubperus_/'],
  ['Salseiro Lounge','@salseiro.lounge','https://www.instagram.com/salseiro.lounge/'],
  ['DJ Pufinho','@djpufinho','https://www.instagram.com/djpufinho/'],
  ['Sabor do Sul','@sabordosul_marmitaria','https://www.instagram.com/sabordosul_marmitaria/'],
  ['Dicarias Cantor','@dicariascantor','https://www.instagram.com/dicariascantor/']
].map(([name,handle,profile_url],i)=>({id:`seed-client-${i}`,name,handle,profile_url,active:true,sort_order:i}));

export const seedServices = [
 ['Redes sociais','Conteúdo que faz sua marca ser percebida.','SOCIAL','Smartphone'],
 ['Sites & LPs','Experiências digitais pensadas para converter.','WEB','Globe2'],
 ['Cardápios digitais','Apresente seus produtos com muito mais valor.','DIGITAL','Utensils'],
 ['Tráfego pago','Estratégia para colocar sua marca diante das pessoas certas.','ADS','Target'],
 ['Identidade visual','Uma marca que transmite o nível do seu negócio.','BRANDING','Palette'],
 ['Conteúdo & vídeo','Peças visuais que transformam atenção em interesse.','CONTENT','Play']
].map(([title,description,tag,icon],i)=>({id:`seed-service-${i}`,title,description,tag,icon,active:true,sort_order:i}));

const reels = [
 ['Sindpetshop-SP','https://www.instagram.com/reel/DV9ULwJkixu/','Campanha / conteúdo institucional','/assets/posters/reel-01.jpg'],
 ['Sindpetshop-SP','https://www.instagram.com/reel/DcJrWv2SPzd/','Conteúdo para redes sociais','/assets/posters/reel-02.jpg'],
 ['Sindpetshop-SP','https://www.instagram.com/reel/DaKzFXZCk4R/','Comunicação sindical','/assets/posters/reel-03.jpg'],
 ['SEON','https://www.instagram.com/reel/C64eNa3gXVK/','Conteúdo de marca','/assets/posters/reel-04.jpg'],['SEON','https://www.instagram.com/reel/C9Qaa-YxRFt/','Conteúdo de marca','/assets/posters/reel-05.jpg'],['SEON','https://www.instagram.com/reel/C6PIE6iumCV/','Conteúdo de marca','/assets/posters/reel-06.jpg'],
 ['MIBIS Dog','https://www.instagram.com/reel/C6XFOgGOJBL/','Conteúdo pet','/assets/posters/reel-07.jpg'],['MIBIS Dog','https://www.instagram.com/reel/DQCq3K4kZ7j/','Conteúdo pet','/assets/posters/reel-08.jpg'],
 ['Eazy Club','https://www.instagram.com/reel/DYIE58pgeTh/','Conteúdo / evento','/assets/posters/reel-09.jpg'],['Eazy Club','https://www.instagram.com/reel/DYcPiquue3L/','Conteúdo / evento','/assets/posters/reel-10.jpg'],['Eazy Club','https://www.instagram.com/reel/DYZR4p7idCp/','Conteúdo / evento','/assets/posters/reel-11.jpg'],
 ['DJ Pufinho','https://www.instagram.com/reel/DJxNTzKuexw/','Vídeo / performance','/assets/posters/reel-12.jpg'],['DJ Pufinho','https://www.instagram.com/reel/DJxNMUjuS7W/','Vídeo / performance','/assets/posters/reel-12.jpg'],['DJ Pufinho','https://www.instagram.com/reel/DJxM5WhOZMD/','Vídeo / performance','/assets/posters/reel-12.jpg'],
 ['Dicarias Cantor','https://www.instagram.com/reel/DYYO89CxBve/','Vídeo / performance','/assets/posters/reel-12.jpg'],['Dicarias Cantor','https://www.instagram.com/reel/DY2z6PGxctM/','Vídeo / performance','/assets/posters/reel-13.jpg'],['Dicarias Cantor','https://www.instagram.com/reel/DYP3XSGhdSa/','Vídeo / performance','/assets/posters/reel-14.jpg']
];
export const seedContents = reels.map(([clientName,url,title,poster_url],i)=>({id:`seed-content-${i}`,client_name:clientName,title,url,poster_url,active:true,featured:i<8,sort_order:i}));

export const seedProjects = [
 ['Sindpetshop-SP ( Mês das Mulheres )','SOCIAL / CAMPAIGN','https://www.behance.net/gallery/246850123/Sindpetshop-SP-(-Mes-das-Mulheres-)','https://mir-s3-cdn-cf.behance.net/projects/404/1534ef246850123.Y3JvcCwxMDgwLDg0NCwwLDE2OA.png','Campanha visual desenvolvida para o Sindpetshop-SP.'],
 ['Campanha Maio Lilás — Consciência Jovem','CAMPAIGN / SOCIAL','https://www.behance.net/gallery/248486127/Campanha-Maio-Lilas-Consciencia-Jovem','https://mir-s3-cdn-cf.behance.net/projects/404/2dd9e8248486127.Y3JvcCwxMzA5LDEwMjQsMCww.png','Planejamento de campanha, direção visual e peças para comunicação sindical.'],
 ['Sindpetshop-SP ( Nova identidade visual )','BRANDING','https://www.behance.net/gallery/246851585/Sindpetshop-SP-(-Nova-identidade-visual-)','https://mir-s3-cdn-cf.behance.net/projects/404/6e0912246851585.Y3JvcCwxMDgwLDg0NCwwLDE1Nw.png','Exploração de identidade e linguagem visual para a marca.'],
 ['CAJAMAR FEST','EVENT / DESIGN','https://www.behance.net/gallery/196628485/CAJAMAR-FEST','https://mir-s3-cdn-cf.behance.net/projects/404/d09fc5196628485.Y3JvcCwzNjQ4LDI4NTMsMCw4ODQ.jpg','Direção visual para comunicação de evento.'],
 ['Treino demonstrativo de modelagem 3D','3D','https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D','https://mir-s3-cdn-cf.behance.net/projects/404/296feb252638325.Y3JvcCwxMDA3LDc4OCw3NCww.png','Estudo prático de modelagem 3D, composição e integração digital.'],
 ['Campanha de junho - Sindpetshop-SP','CAMPAIGN','https://www.behance.net/gallery/250101129/Campanha-de-junho-Sindpetshop-SP','https://mir-s3-cdn-cf.behance.net/projects/404/16449a250101129.Y3JvcCw4OTcsNzAyLDI0LDA.png','Campanha de conteúdo para redes sociais.'],
 ['Sindpetshop-SP','SOCIAL / DESIGN','https://www.behance.net/gallery/246850317/Sindpetshop-SP','https://mir-s3-cdn-cf.behance.net/projects/404/2b5ea3246850317.Y3JvcCwxMTgyLDkyNSwzNTQsMA.png','Peças e comunicação digital para a marca.'],
 ['Sindpetshop-SP ( Abril verde )','CAMPAIGN','https://www.behance.net/gallery/246847939/Sindpetshop-SP-(-Abril-verde-)','https://mir-s3-cdn-cf.behance.net/projects/404/a3dfb0246847939.Y3JvcCwxMDQ1LDgxNywwLDM1Ng.png','Campanha temática desenvolvida para comunicação digital.']
].map(([title,category,url,cover_url,description],i)=>({id:`seed-project-${i}`,title,category,url,cover_url,description,active:true,featured:i<4,sort_order:i}));

export const seedStats = [
 {value:'22,2',suffix:'K',label:'VISUALIZAÇÕES',delta:'+45,9%'},
 {value:'5,1',suffix:'K',label:'PESSOAS ALCANÇADAS',delta:'+41,7%'},
 {value:'600',suffix:'',label:'INTERAÇÕES',delta:'+12,4%'},
 {value:'16',suffix:'%',label:'DE NOVOS PÚBLICOS',delta:'VISUALIZAÇÕES DE NÃO SEGUIDORES'}
];

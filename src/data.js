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
 ['Sindpetshop-SP','https://www.instagram.com/reel/DV9ULwJkixu/'],['Sindpetshop-SP','https://www.instagram.com/reel/DcJrWv2SPzd/'],['Sindpetshop-SP','https://www.instagram.com/reel/DaKzFXZCk4R/'],
 ['SEON','https://www.instagram.com/reel/C64eNa3gXVK/'],['SEON','https://www.instagram.com/reel/C9Qaa-YxRFt/'],['SEON','https://www.instagram.com/reel/C6PIE6iumCV/'],
 ['MIBIS Dog','https://www.instagram.com/reel/C6XFOgGOJBL/'],['MIBIS Dog','https://www.instagram.com/reel/DQCq3K4kZ7j/'],
 ['Eazy Club','https://www.instagram.com/reel/DYIE58pgeTh/'],['Eazy Club','https://www.instagram.com/reel/DYcPiquue3L/'],['Eazy Club','https://www.instagram.com/reel/DYZR4p7idCp/'],
 ['DJ Pufinho','https://www.instagram.com/reel/DJxNTzKuexw/'],['DJ Pufinho','https://www.instagram.com/reel/DJxNMUjuS7W/'],['DJ Pufinho','https://www.instagram.com/reel/DJxM5WhOZMD/'],
 ['Dicarias Cantor','https://www.instagram.com/reel/DYYO89CxBve/'],['Dicarias Cantor','https://www.instagram.com/reel/DY2z6PGxctM/'],['Dicarias Cantor','https://www.instagram.com/reel/DYP3XSGhdSa/']
];
export const seedContents = reels.map(([clientName,url],i)=>({id:`seed-content-${i}`,client_name:clientName,title:`Conteúdo ${String((i%3)+1).padStart(2,'0')}`,url,active:true,featured:i<6,sort_order:i}));

export const seedProjects = [
 ['Sindpetshop-SP ( Mês das Mulheres )','SOCIAL / CAMPAIGN','https://www.behance.net/gallery/246850123/Sindpetshop-SP-(-Mes-das-Mulheres-)'],
 ['Campanha Maio Lilás — Consciência Jovem','CAMPAIGN / SOCIAL','https://www.behance.net/gallery/248486127/Campanha-Maio-Lilas-Consciencia-Jovem'],
 ['Sindpetshop-SP ( Nova identidade visual )','BRANDING','https://www.behance.net/gallery/246851585/Sindpetshop-SP-(-Nova-identidade-visual-)'],
 ['CAJAMAR FEST','EVENT / DESIGN','https://www.behance.net/gallery/196628485/CAJAMAR-FEST'],
 ['Treino demonstrativo de modelagem 3D','3D','https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D'],
 ['Campanha de junho - Sindpetshop-SP','CAMPAIGN','https://www.behance.net/gallery/250101129/Campanha-de-junho-Sindpetshop-SP'],
 ['Sindpetshop-SP','SOCIAL / DESIGN','https://www.behance.net/gallery/246850317/Sindpetshop-SP'],
 ['Sindpetshop-SP ( Abril verde )','CAMPAIGN','https://www.behance.net/gallery/246847939/Sindpetshop-SP-(-Abril-verde-)']
].map(([title,category,url],i)=>({id:`seed-project-${i}`,title,category,url,active:true,featured:i<4,sort_order:i,cover_url:''}));

export const seedStats = [
 {value:'22,2',suffix:'K',label:'VISUALIZAÇÕES',delta:'+45,9%'},
 {value:'5,1',suffix:'K',label:'PESSOAS ALCANÇADAS',delta:'+41,7%'},
 {value:'600',suffix:'',label:'INTERAÇÕES',delta:'+12,4%'},
 {value:'16',suffix:'%',label:'DE NOVOS PÚBLICOS',delta:'VISUALIZAÇÕES DE NÃO SEGUIDORES'}
];

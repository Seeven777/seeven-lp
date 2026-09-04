import {supabase} from './supabase';

export async function uploadAsset(file,folder='media'){
  if(!supabase) throw new Error('Configure o Supabase antes de fazer uploads.');
  const ext=file.name.split('.').pop()?.toLowerCase()||'jpg';
  const path=`${folder}/${crypto.randomUUID()}.${ext}`;
  const {error}=await supabase.storage.from('portfolio-assets').upload(path,file,{upsert:false,contentType:file.type||'image/jpeg'});
  if(error) throw error;
  const {data}=supabase.storage.from('portfolio-assets').getPublicUrl(path);
  return data.publicUrl;
}

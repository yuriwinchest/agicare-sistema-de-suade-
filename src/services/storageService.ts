
import { supabase } from '@/integrations/supabase/client';

export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Verificar se o bucket para fotos de colaboradores existe
    const collaboratorBucket = buckets?.find(bucket => bucket.name === 'collaborator_photos');
    
    if (!collaboratorBucket) {
      console.log('Criando bucket para fotos de colaboradores...');
      const { data, error } = await supabase.storage.createBucket('collaborator_photos', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });
      
      if (error) {
        console.error('Erro ao criar bucket:', error);
      } else {
        console.log('Bucket criado com sucesso:', data);
      }
    } else {
      console.log('Bucket para fotos de colaboradores já existe');
    }
  } catch (error) {
    console.error('Erro ao verificar buckets:', error);
  }
};

export const uploadCollaboratorPhoto = async (file: File) => {
  try {
    await ensureStorageBuckets();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    console.log("Iniciando upload para:", fileName);
    
    const { data, error } = await supabase.storage
      .from('collaborator_photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Erro no upload:", error);
      throw error;
    }

    console.log("Upload concluído:", data);

    // Obter a URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('collaborator_photos')
      .getPublicUrl(fileName);

    console.log("URL gerada:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Erro detalhado no upload:", error);
    throw error;
  }
};

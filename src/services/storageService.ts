
import { supabase } from '@/integrations/supabase/client';

// Function to ensure the necessary storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Check if collaborator photos bucket exists
    const collaboratorBucket = buckets?.find(bucket => bucket.name === 'collaborator_photos');
    
    if (!collaboratorBucket) {
      console.log('Creating bucket for collaborator photos...');
      const { data, error } = await supabase.storage.createBucket('collaborator_photos', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully:', data);
      }
    } else {
      console.log('Collaborator photos bucket already exists');
    }
  } catch (error) {
    console.error('Error checking buckets:', error);
  }
};

// Function to upload a collaborator photo and return the public URL
export const uploadCollaboratorPhoto = async (file: File) => {
  try {
    // First ensure buckets exist
    await ensureStorageBuckets();
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    console.log("Starting upload for:", fileName);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('collaborator_photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload completed:", data);

    // Get the public URL - NOTE: This is a synchronous operation, no need to await
    const { data: urlData } = supabase.storage
      .from('collaborator_photos')
      .getPublicUrl(fileName);

    console.log("Generated URL:", urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Detailed upload error:", error);
    throw error;
  }
};

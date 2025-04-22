
import { supabase } from '@/integrations/supabase/client';

// Function to check if collaborator photos bucket exists
export const ensureStorageBuckets = async () => {
  try {
    // Check if the bucket already exists before trying to create it
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Check if collaborator photos bucket exists
    const collaboratorBucket = buckets?.find(bucket => bucket.name === 'collaborator_photos');
    
    if (!collaboratorBucket) {
      console.log('Collaborator photos bucket not found. The application will use direct image URLs instead.');
    } else {
      console.log('Collaborator photos bucket found');
    }
    
    return !!collaboratorBucket; // Return true if bucket exists
  } catch (error) {
    console.error('Error checking buckets:', error);
    return false;
  }
};

// Function to upload a collaborator photo and return the public URL
export const uploadCollaboratorPhoto = async (file: File) => {
  try {
    // First check if bucket exists
    const bucketExists = await ensureStorageBuckets();
    
    if (bucketExists) {
      // Use Supabase storage if bucket exists
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

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('collaborator_photos')
        .getPublicUrl(fileName);

      console.log("Generated URL:", urlData.publicUrl);
      
      return urlData.publicUrl;
    } else {
      // Fallback to direct URL creation if bucket doesn't exist
      // This is a temporary solution until proper storage permissions are set up
      
      // Create a data URL for the image
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Convert the file to a base64 data URL
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  } catch (error) {
    console.error("Detailed upload error:", error);
    
    // Fallback to data URL as a last resort
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

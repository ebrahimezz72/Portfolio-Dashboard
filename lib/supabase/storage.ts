import { supabase } from "@/lib/supabase";

export async function uploadFile(file: File, bucket: string, path: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFile(bucket: string, url: string) {
  // Extract path from URL
  // Example URL: https://.../storage/v1/object/public/bucket/path/to/file.jpg
  const parts = url.split(`/public/${bucket}/`);
  if (parts.length < 2) return;
  
  const filePath = parts[1];
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error("Error deleting file:", error);
  }
}

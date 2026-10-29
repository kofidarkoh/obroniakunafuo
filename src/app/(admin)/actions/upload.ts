"use server";

import { requireAdmin } from "@/lib/auth";
import {
  createSupabaseServiceClient,
  supabaseConfigured,
} from "@/lib/supabase/server";

const BUCKET = "site-images";

export async function uploadImage(formData: FormData) {
  await requireAdmin();

  if (!supabaseConfigured()) {
    throw new Error(
      "Image uploads require Supabase Storage. Add your Supabase keys, or enter an image path instead.",
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Use a JPEG, PNG, WebP or GIF image.");
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File too large. The maximum size is 5MB.");
  }

  const supabase = await createSupabaseServiceClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${timestamp}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, Buffer.from(bytes), {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || "Upload failed");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return { url: data.publicUrl };
}

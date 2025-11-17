'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(file: File, folderPath: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folderPath,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Upload failed'));
            }
          }
        )
        .end(buffer);
    });

    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error al subir la imagen');
  }
}

export async function deleteImageFromCloudinary(url: string): Promise<void> {
  try {
    const publicId = extractPublicIdFromUrl(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // No lanzamos error para no bloquear el flujo principal
  }
}

function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Extrae el public_id de la URL de Cloudinary
    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{ext}
    const match = url.match(/\/upload\/(.+)\.[^.]+$/);
    if (match) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

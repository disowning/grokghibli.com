/**
 * API utilities for interacting with the Hugging Face model
 */

import axios from 'axios';

/**
 * Transforms an image using the Studio Ghibli style model
 * @param file The image file to transform
 * @returns A Promise resolving to an ArrayBuffer containing the transformed image data
 */
export async function transformImage(file: File): Promise<ArrayBuffer> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post('/api/transform', formData, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  }
}

/**
 * Creates an object URL from an image file
 * @param file The image file
 * @returns A string URL representing the file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes an object URL to free up memory
 * @param url The object URL to revoke
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
} 
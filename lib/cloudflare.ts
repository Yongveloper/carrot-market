/**
 * Cloudflare Images API utilities
 */

/**
 * Extracts image ID from Cloudflare image URL
 * @param imageUrl Full Cloudflare image delivery URL
 * @returns Image ID or null if invalid URL
 * @example
 * extractImageId("https://imagedelivery.net/abc123/def456/public") → "def456"
 */
export function extractImageId(imageUrl: string): string | null {
  try {
    // Format: https://imagedelivery.net/{account_hash}/{image_id}/{variant}
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/').filter(Boolean);

    if (pathSegments.length >= 2) {
      return pathSegments[1]; // Second segment is image_id
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Deletes image from Cloudflare Images
 * @param imageId Cloudflare image ID
 * @returns Success status
 */
export async function deleteCloudflareImage(
  imageId: string,
): Promise<boolean> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error('Missing Cloudflare credentials');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to delete Cloudflare image:', error);
    return false;
  }
}

/**
 * Deletes image from Cloudflare using full URL
 * @param imageUrl Full Cloudflare image delivery URL
 * @returns Success status
 */
export async function deleteCloudflareImageByUrl(
  imageUrl: string,
): Promise<boolean> {
  const imageId = extractImageId(imageUrl);

  if (!imageId) {
    console.error('Invalid Cloudflare image URL');
    return false;
  }

  return deleteCloudflareImage(imageId);
}

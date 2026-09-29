export async function deleteCloudinaryImage(imageUrl, apiKey, apiSecret, cloudName) {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return false;

  try {
    // Extract public ID from URL
    // URL format: https://res.cloudinary.com/cloudName/image/upload/v1234567/public_id.jpg
    const parts = imageUrl.split('/');
    const lastPart = parts[parts.length - 1];
    const publicId = lastPart.split('.')[0]; // remove extension

    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

    // Create SHA-1 signature
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    return result.result === 'ok';
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    return false;
  }
}

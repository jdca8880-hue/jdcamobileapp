import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

// Initialize Cloudinary instance
const cld = new Cloudinary({ cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'gglzv8pn' } });

/**
 * Universal Avatar component that leverages Cloudinary for
 * auto-formatting, optimization, and smart cropping.
 * 
 * It gracefully handles:
 * 1. Full Cloudinary URLs (extracts public ID automatically)
 * 2. External HTTP URLs (uses Cloudinary fetch feature)
 * 3. Raw Cloudinary public IDs
 * 4. Empty sources (falls back to ui-avatars)
 */
export function CloudinaryAvatar({ src, alt, className = "" }) {
  // Fallback to UI Avatars if no source is provided
  if (!src) {
    const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt || 'Player')}&background=random&color=fff&bold=true`;
    return <img src={fallbackSrc} alt={alt} className={className} />;
  }

  let img;

  // Check if it's already a full cloudinary URL
  if (src.includes('res.cloudinary.com')) {
    const parts = src.split('/upload/');
    if (parts.length > 1) {
      let publicId = parts[1];
      // Strip version (e.g. v1710928374/) if present
      if (publicId.match(/^v\d+\//)) {
        publicId = publicId.substring(publicId.indexOf('/') + 1);
      }
      // Strip extension (e.g. .jpg)
      publicId = publicId.split('.')[0];
      img = cld.image(publicId);
    } else {
      img = cld.image(src).setDeliveryType('fetch');
    }
  } else if (src.startsWith('http')) {
    // External URL - use Cloudinary fetch proxy
    img = cld.image(src).setDeliveryType('fetch');
  } else {
    // Assume it's a raw public ID
    img = cld.image(src);
  }

  // Apply optimizations
  img
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()));

  return <AdvancedImage cldImg={img} className={className} alt={alt} />;
}

export default CloudinaryAvatar;

import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

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
 *
 * PERFORMANCE / APPLE SUPPORT
 *   We request a SIZED thumbnail (f_auto,q_auto + fixed w/h fill crop) and
 *   render a plain <img> with native lazy-loading + async decode. Previously
 *   the component asked Cloudinary to `resize(auto())` with NO dimensions,
 *   which delivers the FULL-resolution upload (often multi-MB) for a 48px
 *   avatar, and used <AdvancedImage> which loads every image eagerly. On older
 *   phones a directory of such images made the Players tab and profiles crawl.
 *   A plain <img> with loading="lazy" is also the most compatible path on
 *   iOS/Safari (no extra runtime, offscreen images are skipped).
 *
 * `size` is the delivered pixel box (default 192, enough for a 96px avatar at
 * 2× retina). Callers can lower it for dense lists.
 */
export function CloudinaryAvatar({ src, alt, className = "", size = 192 }) {
  // Fallback to UI Avatars if no source is provided
  if (!src) {
    const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt || 'Player')}&background=random&color=fff&bold=true&size=${size}`;
    return <img src={fallbackSrc} alt={alt} className={className} loading="lazy" decoding="async" />;
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

  // Optimize + cap the delivered size. fill() crops to an exact square box so
  // the download is a small thumbnail, not the original upload.
  img
    .format('auto')
    .quality('auto')
    .resize(fill().width(size).height(size).gravity(autoGravity()));

  let url;
  try {
    url = img.toURL();
  } catch {
    // Degrade to the raw source rather than render nothing.
    url = src;
  }

  return <img src={url} alt={alt} className={className} loading="lazy" decoding="async" />;
}

export default CloudinaryAvatar;

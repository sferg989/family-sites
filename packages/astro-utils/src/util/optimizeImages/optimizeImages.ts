import { JSDOM } from 'jsdom';
import { getImage } from 'astro:assets';

export async function optimizeImages(html: string): Promise<string> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const images = document.getElementsByTagName('img');

  for (const img of images) {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';

    if (src) {
      try {
        // Skip if already optimized (contains _image? or already has picture wrapper)
        if (src.includes('_image?') || img.parentElement?.tagName === 'PICTURE') {
          continue;
        }

        // For remote images, we need to use inferSize and add fallback dimensions
        const imageOptions = {
          src: src,
          inferSize: true,
          format: 'webp' as const,
          // Add fallback dimensions for remote images to prevent CLS
          width: 800,
          height: 600
        };

        const mobileImg = await getImage({
          ...imageOptions,
          width: 640,
          height: 480
        });
        
        const desktopImg = await getImage({
          ...imageOptions,
          width: 800,
          height: 600
        });

        const pictureHtml = `
          <picture>
            <source media="(max-width: 799px)" srcset="${mobileImg.src}" />
            <source media="(min-width: 800px)" srcset="${desktopImg.src}" />
            <img
              src="${desktopImg.src}"
              alt="${alt}"
              width="${desktopImg.attributes.width || 800}"
              height="${desktopImg.attributes.height || 600}"
              loading="lazy"
            />
          </picture>
        `;

        const template = document.createElement('template');
        template.innerHTML = pictureHtml.trim();
        img.parentNode?.replaceChild(template.content.firstChild!, img);
      } catch {
        // Failed to optimize image, keeping original
        // Keep the original image if optimization fails
        continue;
      }
    }
  }

  return dom.serialize();
}

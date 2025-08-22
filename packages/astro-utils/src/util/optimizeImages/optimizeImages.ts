import { JSDOM } from 'jsdom';
import { getImage } from 'astro:assets';

// ===== TYPE DEFINITIONS =====

type ImageFormat = 'avif' | 'webp' | 'jpeg';

interface ResponsiveBreakpoint {
  readonly name: string;
  readonly width: number;
  readonly mediaQuery: string;
}

interface ImageDimensions {
  readonly width: number;
  readonly height: number;
}

interface OptimizedImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly attributes: Record<string, unknown>;
}

interface ResponsiveImageSet {
  readonly format: ImageFormat;
  readonly type: string;
  readonly breakpoints: Map<string, OptimizedImage>;
}

interface ProcessedImageData {
  readonly sets: readonly ResponsiveImageSet[];
  readonly fallback: OptimizedImage;
  readonly placeholder: OptimizedImage | undefined;
}

interface ImageProcessingContext {
  readonly src: string;
  readonly alt: string;
  readonly isAboveFold: boolean;
  readonly index: number;
}

interface ImageOptimizationConfig {
  readonly enableWebP: boolean;
  readonly enableAvif: boolean;
  readonly maxWidth: number;
  readonly quality: number;
  readonly enableLazyLoading: boolean;
  readonly addPlaceholder: boolean;
  readonly aspectRatio: number;
  readonly breakpoints: readonly ResponsiveBreakpoint[];
  readonly formats: readonly ImageFormat[];
  readonly aboveFoldThreshold: number;
  readonly placeholderQuality: number;
  readonly placeholderSize: ImageDimensions;
  readonly parallelProcessing: boolean;
}

// ===== CONSTANTS =====

const DEFAULT_BREAKPOINTS: readonly ResponsiveBreakpoint[] = [
  { name: 'mobile', width: 640, mediaQuery: '(max-width: 639px)' },
  { name: 'tablet', width: 768, mediaQuery: '(min-width: 640px) and (max-width: 767px)' },
  { name: 'desktop', width: 1200, mediaQuery: '(min-width: 768px)' }
] as const;

const DEFAULT_CONFIG: ImageOptimizationConfig = {
  enableWebP: true,
  enableAvif: true,
  maxWidth: 1200,
  quality: 80,
  enableLazyLoading: true,
  addPlaceholder: true,
  aspectRatio: 4/3,
  breakpoints: DEFAULT_BREAKPOINTS,
  formats: ['avif', 'webp', 'jpeg'],
  aboveFoldThreshold: 2,
  placeholderQuality: 10,
  placeholderSize: { width: 20, height: 15 },
  parallelProcessing: true
} as const;


// ===== UTILITY CLASSES =====

class ImageCache {
  private static instance: ImageCache;
  private readonly cache = new Map<string, Promise<OptimizedImage>>();

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  async getOrCreate(key: string, factory: () => Promise<OptimizedImage>): Promise<OptimizedImage> {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory());
    }
    return this.cache.get(key)!;
  }

  clear(): void {
    this.cache.clear();
  }
}

class DimensionCalculator {
  static calculateDimensions(baseWidth: number, aspectRatio: number): ImageDimensions {
    const width = Math.min(baseWidth, 2400); // Cap at reasonable size
    const height = Math.round(width / aspectRatio);
    return { width, height };
  }

  static constrainToMaxWidth(dimensions: ImageDimensions, maxWidth: number): ImageDimensions {
    if (dimensions.width <= maxWidth) {
      return dimensions;
    }
    const aspectRatio = dimensions.width / dimensions.height;
    return this.calculateDimensions(maxWidth, aspectRatio);
  }
}

// ===== CORE PROCESSING CLASSES =====

class ImageProcessor {
  private readonly cache = ImageCache.getInstance();

  async processImage(
    src: string,
    format: ImageFormat,
    dimensions: ImageDimensions,
    quality: number
  ): Promise<OptimizedImage> {
    const cacheKey = `${src}-${format}-${dimensions.width}x${dimensions.height}-q${quality}`;
    
    return this.cache.getOrCreate(cacheKey, async () => {
      try {
        const result = await getImage({
          src,
          format,
          width: dimensions.width,
          height: dimensions.height,
          quality,
          inferSize: true,
        });

        return {
          src: result.src,
          width: result.attributes.width as number || dimensions.width,
          height: result.attributes.height as number || dimensions.height,
          attributes: result.attributes
        };
      } catch (error) {
        throw new Error(`Failed to process image ${src} as ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  async createResponsiveSet(
    src: string,
    format: ImageFormat,
    breakpoints: readonly ResponsiveBreakpoint[],
    config: ImageOptimizationConfig
  ): Promise<ResponsiveImageSet> {
    const mimeType = `image/${format}`;
    const breakpointPromises = breakpoints.map(async (breakpoint) => {
      const dimensions = DimensionCalculator.constrainToMaxWidth(
        DimensionCalculator.calculateDimensions(breakpoint.width, config.aspectRatio),
        config.maxWidth
      );
      
      const optimizedImage = await this.processImage(src, format, dimensions, config.quality);
      return [breakpoint.name, optimizedImage] as const;
    });

    const processedBreakpoints = await Promise.all(breakpointPromises);
    
    return {
      format,
      type: mimeType,
      breakpoints: new Map(processedBreakpoints)
    };
  }
}

class PlaceholderGenerator {
  private readonly processor = new ImageProcessor();

  async createPlaceholder(src: string, config: ImageOptimizationConfig): Promise<OptimizedImage | undefined> {
    if (!config.addPlaceholder) {
      return undefined;
    }

    try {
      return await this.processor.processImage(
        src,
        'jpeg',
        config.placeholderSize,
        config.placeholderQuality
      );
    } catch {
      // Return undefined to use fallback placeholder
      return undefined;
    }
  }
}

class PictureElementBuilder {
  buildPictureElement(
    data: ProcessedImageData,
    context: ImageProcessingContext,
    config: ImageOptimizationConfig
  ): string {
    const sources = this.buildSources(data, config);
    const imgElement = this.buildImgElement(data, context, config);
    
    return `
      <picture style="display: block; width: 100%; aspect-ratio: ${config.aspectRatio};">
        ${sources}
        ${imgElement}
      </picture>
    `.trim();
  }

  private buildSources(data: ProcessedImageData, config: ImageOptimizationConfig): string {
    const sources: string[] = [];

    // Add modern format sources
    for (const set of data.sets) {
      for (const breakpoint of config.breakpoints) {
        const image = set.breakpoints.get(breakpoint.name);
        if (image) {
          sources.push(
            `<source media="${breakpoint.mediaQuery}" srcset="${image.src}" type="${set.type}" />`
          );
        }
      }
    }

    return sources.join('\n        ');
  }

  private buildImgElement(
    data: ProcessedImageData,
    context: ImageProcessingContext,
    config: ImageOptimizationConfig
  ): string {
    const { fallback, placeholder } = data;
    const { isAboveFold, alt } = context;
    
    const usePlaceholder = Boolean(placeholder && !isAboveFold);
    const srcValue = isAboveFold ? fallback.src : (placeholder?.src || fallback.src);
    
    const attributes: string[] = [
      `src="${srcValue}"`,
      usePlaceholder ? `data-src="${fallback.src}"` : '',
      `alt="${this.escapeHtml(alt)}"`,
      `width="${fallback.width}"`,
      `height="${fallback.height}"`,
      config.enableLazyLoading && !isAboveFold ? 'loading="lazy"' : 'loading="eager"',
      isAboveFold ? 'fetchpriority="high"' : '',
      this.buildInlineStyles(usePlaceholder),
      usePlaceholder ? this.buildOnLoadHandler() : ''
    ].filter(Boolean);

    return `<img ${attributes.join(' ')} />`;
  }

  private buildInlineStyles(usePlaceholder: boolean): string {
    const baseStyles = 'width: 100%; height: auto; object-fit: cover; border-radius: inherit;';
    const placeholderStyles = usePlaceholder ? ' filter: blur(2px); transition: filter 0.3s ease;' : '';
    
    return `style="${baseStyles}${placeholderStyles}"`;
  }

  private buildOnLoadHandler(): string {
    return `onload="this.style.filter='none'; if(this.dataset.src) { this.src=this.dataset.src; this.removeAttribute('data-src'); }"`;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

class ImageElementProcessor {
  private readonly processor = new ImageProcessor();
  private readonly placeholderGenerator = new PlaceholderGenerator();
  private readonly pictureBuilder = new PictureElementBuilder();

  async processImageElement(context: ImageProcessingContext, config: ImageOptimizationConfig): Promise<ProcessedImageData> {
    const formats = config.formats.filter(format => 
      format === 'jpeg' || 
      (format === 'webp' && config.enableWebP) || 
      (format === 'avif' && config.enableAvif)
    );

    const [responsiveSets, placeholder] = await Promise.all([
      config.parallelProcessing 
        ? Promise.all(formats.map(format => this.processor.createResponsiveSet(context.src, format, config.breakpoints, config)))
        : this.createResponsiveSetsSequentially(formats, context.src, config),
      this.placeholderGenerator.createPlaceholder(context.src, config)
    ]);

    // Find JPEG set for fallback
    const fallbackSet = responsiveSets.find(set => set.format === 'jpeg');
    if (!fallbackSet) {
      throw new Error('No JPEG fallback set found');
    }

    const desktopImage = fallbackSet.breakpoints.get('desktop');
    if (!desktopImage) {
      throw new Error('No desktop fallback image found');
    }

    return {
      sets: responsiveSets.filter(set => set.format !== 'jpeg'), // Exclude JPEG from sources (it's the fallback)
      fallback: desktopImage,
      placeholder
    };
  }

  private async createResponsiveSetsSequentially(
    formats: readonly ImageFormat[], 
    src: string, 
    config: ImageOptimizationConfig
  ): Promise<ResponsiveImageSet[]> {
    const sets: ResponsiveImageSet[] = [];
    for (const format of formats) {
      sets.push(await this.processor.createResponsiveSet(src, format, config.breakpoints, config));
    }
    return sets;
  }

  addBasicOptimizations(img: Element, context: ImageProcessingContext, config: ImageOptimizationConfig): void {
    try {
      img.setAttribute('loading', config.enableLazyLoading && !context.isAboveFold ? 'lazy' : 'eager');
      
      if (context.isAboveFold) {
        img.setAttribute('fetchpriority', 'high');
      }

      // Add basic sizing if not present
      if (!img.getAttribute('width') || !img.getAttribute('height')) {
        const dimensions = DimensionCalculator.calculateDimensions(800, config.aspectRatio);
        img.setAttribute('width', dimensions.width.toString());
        img.setAttribute('height', dimensions.height.toString());
        
        if (img instanceof HTMLElement) {
          img.style.aspectRatio = config.aspectRatio.toString();
          img.style.objectFit = 'cover';
          img.style.width = '100%';
          img.style.height = 'auto';
        }
      }
    } catch {
      // Silent fallback - keep original image unchanged
    }
  }
}

// ===== MAIN OPTIMIZER CLASS =====

class ImageOptimizer {
  private readonly elementProcessor = new ImageElementProcessor();
  private readonly pictureBuilder = new PictureElementBuilder();

  async optimizeImages(html: string, options: Partial<ImageOptimizationConfig> = {}): Promise<string> {
    const config: ImageOptimizationConfig = { ...DEFAULT_CONFIG, ...options };
    
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const images = Array.from(document.getElementsByTagName('img'));

    if (images.length === 0) {
      return html;
    }

    const contexts = this.createImageContexts(images);
    
    if (config.parallelProcessing) {
      await this.processImagesInParallel(contexts, config, document);
    } else {
      await this.processImagesSequentially(contexts, config, document);
    }

    return dom.serialize();
  }

  private createImageContexts(images: Element[]): ImageProcessingContext[] {
    return images
      .map((img, index) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        
        if (!src || this.shouldSkipImage(img, src)) {
          return null;
        }

        return {
          src,
          alt,
          isAboveFold: index < DEFAULT_CONFIG.aboveFoldThreshold,
          index
        };
      })
      .filter((context): context is ImageProcessingContext => context !== null);
  }

  private shouldSkipImage(img: Element, src: string): boolean {
    return src.includes('_image?') || 
           img.parentElement?.tagName === 'PICTURE' ||
           src.startsWith('data:');
  }

  private async processImagesInParallel(
    contexts: ImageProcessingContext[], 
    config: ImageOptimizationConfig, 
    document: Document
  ): Promise<void> {
    const results = await Promise.allSettled(
      contexts.map(context => this.processSingleImage(context, config))
    );

    results.forEach((result, index) => {
      const context = contexts[index];
      const img = document.querySelector(`img[src="${context.src}"]`);
      
      if (!img) return;

      if (result.status === 'fulfilled') {
        this.replaceImageWithPicture(img, result.value, context, config);
      } else {
        this.elementProcessor.addBasicOptimizations(img, context, config);
      }
    });
  }

  private async processImagesSequentially(
    contexts: ImageProcessingContext[], 
    config: ImageOptimizationConfig, 
    document: Document
  ): Promise<void> {
    for (const context of contexts) {
      const img = document.querySelector(`img[src="${context.src}"]`);
      if (!img) continue;

      try {
        const data = await this.processSingleImage(context, config);
        this.replaceImageWithPicture(img, data, context, config);
      } catch {
        this.elementProcessor.addBasicOptimizations(img, context, config);
      }
    }
  }

  private async processSingleImage(context: ImageProcessingContext, config: ImageOptimizationConfig): Promise<ProcessedImageData> {
    return this.elementProcessor.processImageElement(context, config);
  }

  private replaceImageWithPicture(
    img: Element, 
    data: ProcessedImageData, 
    context: ImageProcessingContext, 
    config: ImageOptimizationConfig
  ): void {
    const pictureHtml = this.pictureBuilder.buildPictureElement(data, context, config);
    const template = img.ownerDocument!.createElement('template');
    template.innerHTML = pictureHtml;
    
    const pictureElement = template.content.firstChild;
    if (pictureElement) {
      img.parentNode?.replaceChild(pictureElement, img);
    }
  }
}

// ===== PUBLIC API =====

export interface ImageOptimizationOptions {
  readonly enableWebP?: boolean;
  readonly enableAvif?: boolean;
  readonly maxWidth?: number;
  readonly quality?: number;
  readonly enableLazyLoading?: boolean;
  readonly addPlaceholder?: boolean;
  readonly aspectRatio?: number;
  readonly parallelProcessing?: boolean;
  readonly aboveFoldThreshold?: number;
}

export async function optimizeImages(
  html: string, 
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const optimizer = new ImageOptimizer();
  return optimizer.optimizeImages(html, options);
}

// Export for testing and advanced usage
export { ImageOptimizer, ImageCache, DimensionCalculator };

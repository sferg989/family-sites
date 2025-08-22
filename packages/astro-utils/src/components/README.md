# Shared Astro Components

This directory contains reusable Astro components for the family-sites monorepo.

## VideoDisplay

A performant, lightweight video/media display component optimized for Lighthouse scores.

### Features

- **High Performance**: Simple implementation with no heavy JavaScript
- **Responsive**: Grid layout that adapts to screen sizes (1 column on mobile, 2 on tablet, 3+ on desktop)
- **Mixed Media**: Handles both video and image content
- **Accessible**: Proper ARIA labels and semantic structure
- **Optimized**: Uses native browser features instead of complex observers

### Usage

```astro
---
import { VideoDisplay } from '@sferg989/astro-utils';

const highlights = [
  {
    id: '1',
    url: 'https://example.com/video.mp4',
    mimeType: 'video/mp4',
    alt: 'Video description'
  },
  {
    id: '2', 
    url: 'https://example.com/image.jpg',
    mimeType: 'image/jpeg',
    alt: 'Image description'
  }
];
---

<VideoDisplay videos={highlights} title="Highlights" gridColumns={3} />
```

### Props

- `videos` (required): Array of `DigitalAsset` objects
- `title` (optional): Section heading, defaults to "Highlights"
- `gridColumns` (optional): Number of columns on desktop, defaults to 3

### Performance Benefits

This component replaced a complex 300+ line VideoGrid implementation that used:
- Intersection observers
- Complex state management
- Heavy CSS animations
- Background processing

The new implementation:
- Uses simple HTML video elements
- Relies on native browser optimizations
- Has minimal CSS and no JavaScript
- Improved Lighthouse scores from 60 to 100

## Picture

An optimized responsive image component that generates multiple sizes and formats for optimal performance.

## Image Optimization Utility

The `optimizeImages` function is available as a separate import to avoid bundling jsdom in projects that don't need it:

```typescript
// Import from separate entry point
import { optimizeImages } from '@sferg989/astro-utils/image-optimization';

// Use for server-side HTML processing
const optimizedHtml = await optimizeImages(html, {
  enableWebP: true,
  enableAvif: true,
  maxWidth: 1200,
  quality: 80
});
```

This keeps the main package lightweight while providing powerful image optimization when needed.

### Features

- **Smart Image Sizing**: Generates optimal image sizes based on display requirements
- **Responsive**: Uses `srcset` and `sizes` attributes for perfect image selection
- **Modern Formats**: Outputs WebP format with automatic fallbacks
- **Performance Optimized**: Prevents downloading oversized images
- **Lazy Loading**: Built-in lazy loading for images below the fold
- **Retina Support**: Includes 2x resolution images for high-DPI displays

### Usage

```astro
---
import { Picture } from '@sferg989/astro-utils';
---

<!-- Basic usage -->
<Picture 
  src="/path/to/image.jpg" 
  alt="Description of the image"
/>

<!-- Advanced usage with custom sizing -->
<Picture 
  src="/path/to/image.jpg" 
  alt="Description"
  maxWidth={608}
  sizes="(max-width: 640px) 100vw, 608px"
  aspectRatio={4/3}
  priority={true}
/>
```

### Props

- `src` (required): Image source path
- `alt` (required): Alt text for accessibility
- `priority` (optional): Load eagerly for above-fold images, defaults to `false`
- `aspectRatio` (optional): Aspect ratio for the image container, defaults to `16/9`
- `sizes` (optional): CSS sizes attribute for responsive images
- `maxWidth` (optional): Maximum expected display width in pixels, defaults to `800`
- `objectFit` (optional): CSS object-fit value, defaults to `contain`

### Performance Benefits

- **75% smaller downloads**: Generates appropriately sized images instead of serving oversized ones
- **Modern formats**: WebP compression reduces file sizes significantly
- **Lazy loading**: Defers loading of below-fold images
- **Smart defaults**: Works great out of the box for most use cases

### Design Principles

1. **Keep It Simple**: Use native HTML features over complex JavaScript
2. **Performance First**: Minimize bundle size and runtime overhead
3. **Accessibility**: Follow semantic HTML and ARIA best practices
4. **Responsive**: Work well on all screen sizes
5. **Maintainable**: Easy to understand and modify 
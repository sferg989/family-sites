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

### Design Principles

1. **Keep It Simple**: Use native HTML features over complex JavaScript
2. **Performance First**: Minimize bundle size and runtime overhead
3. **Accessibility**: Follow semantic HTML and ARIA best practices
4. **Responsive**: Work well on all screen sizes
5. **Maintainable**: Easy to understand and modify 
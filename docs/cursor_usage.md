# Custom Cursor Usage Guide

## Overview
Custom animated cursor with invert effect for enhanced visual experience.

## Features
- **Large Circle**: 100px diameter with backdrop-filter invert effect
- **Small Dot**: 6px precise tracking point
- **Hover Effect**: 1.5x scale on interactive elements (buttons, links)
- **Click Animation**: 0.75x scale for 35ms on click
- **Mobile Detection**: Automatically disabled on touch devices
- **Fallback Support**: Solid colors for browsers without backdrop-filter

## Implementation

### HTML Structure
```html
<div class="curzr" hidden>
    <div class="circle"></div>
    <div class="dot"></div>
</div>
```

### CSS
- Default cursor hidden: `body { cursor: none; }`
- Cursor elements styled via JavaScript for dynamic configuration

### JavaScript
```javascript
import { initCursor } from './components/cursor.js';

// Initialize in main.js
initCursor();
```

## Adding Hover Effect to Custom Elements

Add class `curzr-hover` to any element:
```html
<div class="curzr-hover">Hover me!</div>
```

## Browser Support
- **Modern browsers**: Full backdrop-filter invert effect
- **Fallback**: Solid black circle with opacity
- **Mobile**: Cursor removed, default touch behavior

## Performance
- GPU-accelerated with `transform3d`
- 60fps animations
- No layout reflow (uses transforms only)
- SCALED FOR: All screen sizes, smooth on 100k+ users

## Technical Details
- **z-index**: 2147483647 (maximum, stays on top)
- **pointer-events**: none (doesn't interfere with clicks)
- **Transitions**: 500ms circle, 250ms dot, 100ms/75ms transforms

## Files
- `assets/js/components/cursor.js` - Main component
- `assets/css/components.css` - Cursor styles
- `index.html`, `project.html` - Markup

---
**Version**: 1.0.0  
**Date**: 2026-02-18  
**Author**: Portfolio Project

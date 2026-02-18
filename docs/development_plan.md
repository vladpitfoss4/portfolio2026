# Portfolio Development Plan

## Overview
Vanilla JS/CSS portfolio website with landing page and project detail pages.
Minimal CMS using JSON file storage.

## Project Structure

```
/
├── index.html              # Landing page
├── project.html            # Project detail page
├── assets/
│   ├── css/
│   │   ├── reset.css       # Browser normalization
│   │   ├── variables.css   # CSS custom properties
│   │   ├── layout.css      # Grid/flex layouts
│   │   ├── components.css  # Reusable components
│   │   └── pages.css       # Page-specific styles
│   ├── js/
│   │   ├── shared/
│   │   │   ├── api.js      # Data fetching (REUSABLE)
│   │   │   ├── router.js   # Simple routing (REUSABLE)
│   │   │   └── utils.js    # Helper functions (REUSABLE)
│   │   ├── components/
│   │   │   └── card.js     # Project card (REUSABLE)
│   │   ├── pages/
│   │   │   ├── landing.js  # Landing page logic
│   │   │   └── project.js  # Project page logic
│   │   └── main.js         # Entry point
│   └── images/             # Optimized images (to be added)
├── data/
│   └── projects.json       # CMS data storage
└── docs/
    └── development_plan.md # This file
```

## Current Status

### ✅ Completed
- [x] File structure created
- [x] Base HTML templates (index.html, project.html)
- [x] CSS architecture (reset, variables, layout, components, pages)
- [x] JavaScript modules structure (shared, components, pages)
- [x] Router implementation
- [x] API module with caching
- [x] Utility functions (debounce, formatDate, createElement)
- [x] Empty projects.json schema
- [x] Custom cursor component with invert effect
- [x] Links data centralization (links.json)
- [x] Dynamic footer links rendering
- [x] Dynamic header links rendering
- [x] Dynamic resume button URL
- [x] Hero section video background implementation

### 🚧 In Progress
- [ ] Landing page - Additional sections (NEXT)

### 📋 Backlog
- [ ] Landing page - About section
- [ ] Landing page - Projects grid
- [ ] Landing page - Contact section
- [ ] Project detail page implementation
- [ ] Image optimization
- [ ] Performance testing
- [ ] Deployment setup

## Next Steps
Ready to build Hero section (first screen of landing page).

## Technical Notes

### Custom Cursor Implementation
**Added:** 2026-02-18
**Files:** 
- `assets/js/components/cursor.js` - BigCircle class with invert effect
- `assets/css/components.css` - Cursor styles (cursor: none)
- `index.html`, `project.html` - Cursor markup

**Features:**
- Large circle (100px) with backdrop-filter invert effect
- Small dot (6px) for precise tracking
- Hover animation (1.5x scale) on interactive elements
- Click animation (0.75x scale, 35ms)
- Mobile detection (removes cursor on touch devices)
- Fallback for browsers without backdrop-filter support
- GPU-accelerated with transform3d
- SCALED FOR: 60fps animations, all screen sizes

**Rationale:** Enhances visual interest and provides unique UX. Invert effect creates dynamic interaction with content.

### Hero Video Background Implementation
**Added:** 2026-02-18
**Files:**
- `index.html` - Video element with autoplay, muted, loop, playsinline attributes
- `assets/css/pages.css` - Video positioning (absolute, z-index: 1, object-fit: cover)
- `assets/js/pages/landing.js` - initHeroVideo() function with autoplay fallback

**Features:**
- Full-screen video background (100vh, object-fit: cover)
- Autoplay with muted attribute for browser compatibility
- Fallback mechanism for blocked autoplay (user interaction trigger)
- Mobile-friendly with playsinline attribute
- Preload="auto" for instant playback
- z-index layering: video (1) < content (5-10)
- pointer-events: none to allow clicks through video

**Rationale:** Replaces static background image with dynamic video for enhanced visual impact. Implements robust autoplay handling for cross-browser compatibility (Chrome, Safari, Firefox, mobile browsers).

**Technical Details:**
- Video file: `assets/videos/IMG_2095.MP4` (4.6MB)
- Format: MP4 (H.264 codec recommended for compatibility)
- Autoplay policy compliance: muted + user interaction fallback
- Performance: GPU-accelerated video decoding, no impact on 60fps animations

### FSD Adaptation
- `shared/` → Reusable logic across all pages
- `components/` → UI components (pure functions)
- `pages/` → Page-specific initialization

### REUSE Strategy
- Card component → Landing + Related projects
- API module → Single source for all data
- Utils → Universal helpers (debounce, formatDate, etc.)

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 50KB JS, < 30KB CSS

### SCALED FOR: 100k users
- API caching implemented
- Debounce for search/filter
- Lazy loading (to be implemented)
- CDN-ready structure

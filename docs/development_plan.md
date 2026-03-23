# Portfolio Development Plan

## Overview
Vanilla JS/CSS portfolio website with landing page and project detail pages.
Decentralized CMS using Markdown files with YAML frontmatter in project folders.

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
│   │   │   ├── markdown.js # MD parser (REUSABLE)
│   │   │   ├── router.js   # Simple routing (REUSABLE)
│   │   │   └── utils.js    # Helper functions (REUSABLE)
│   │   ├── components/
│   │   │   ├── card.js     # Project card (REUSABLE)
│   │   │   ├── cursor.js   # Custom cursor (REUSABLE)
│   │   │   ├── marquee.js  # Marquee animation (REUSABLE)
│   │   │   └── modal.js    # Project gallery modal (REUSABLE)
│   │   ├── pages/
│   │   │   ├── landing.js  # Landing page logic
│   │   │   └── project.js  # Project page logic
│   │   └── main.js         # Entry point
│   └── images/             # Optimized images (to be added)
├── data/
│   └── links.json          # Social links data
├── assets/
│   └── projects/
│       ├── adbison/
│       │   ├── project.md  # Project metadata (frontmatter)
│       │   ├── 1.webp      # Project images
│       │   ├── 2.webp
│       │   └── 3.webp
│       ├── instaforex/
│       │   └── project.md
│       └── safetyfirst/
│           └── project.md
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
- [x] Project modal gallery with vertical image layout
- [x] Decentralized markdown-based CMS for projects

### 🚧 In Progress
- [ ] Additional landing page sections (NEXT)

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


### Project Modal Gallery Implementation
**Added:** 2026-02-18
**Files:**
- `assets/js/components/modal.js` - Modal component with vertical gallery
- `assets/css/components.css` - Modal overlay styles
- `assets/css/pages.css` - Project card click behavior
- `index.html` - Modal markup
- `assets/js/pages/landing.js` - Modal integration

**Features:**
- Full-screen dark overlay (95% black background)
- Vertical image gallery with 40px gaps
- Close button (top-right, animated X icon)
- ESC key to close
- Click outside gallery to close
- Body scroll prevention when open
- Lazy loading for images (first eager, rest lazy)
- Smooth open/close transitions
- Mobile-responsive (20px padding on mobile)

**Behavior:**
- Project cards open modal on click (no navigation)
- Images loaded from `assets/projects/{projectId}/` folder
- Images displayed in full width, vertically stacked
- Scroll to view all images

**Rationale:** Replaces navigation to separate project page with inline modal gallery. Faster UX, no page reload, keeps user on landing page. Images displayed at full resolution for portfolio showcase.

**Technical Details:**
- z-index: 1000 (above all content)
- Images: .webp format for performance
- SCALED FOR: 100k users - lazy loading, GPU-accelerated transforms
- REUSABLE LOGIC: Modal component can be used for other overlays


### Decentralized Markdown CMS Implementation
**Added:** 2026-02-18
**Updated:** 2026-03-23
**Files:**
- `assets/js/shared/markdown.js` - Frontmatter parser
- `assets/js/shared/api.js` - Updated to load from MD files
- `assets/projects/*/project.md` - Project metadata files

**Features:**
- YAML frontmatter parsing (custom regex-based, zero dependencies)
- Each project folder contains its own project.md file
- Frontmatter fields: id, title, year, link, tags, featured
- Markdown body for project description
- Parallel loading of all projects (Promise.all)
- Caching for performance
- Dynamic image handling for different file extensions (.webp, .png, .jpg)

**Structure:**
```
assets/projects/
├── adbison/
│   ├── project.md    # Metadata + description
│   ├── 1.webp        # Images
│   ├── 2.webp
│   └── 3.webp
├── instaforex/
│   └── project.md
├── japan/            # NEW: Japan landing page project
│   ├── project.md
│   ├── japanpreview.png    # Thumbnail
│   ├── japanscreen1.png
│   ├── japanscreen2.png
│   └── japanscreen3.png
└── safetyfirst/
    └── project.md
```

**Rationale:** Decentralized CMS eliminates need for central projects.json file. Each project is self-contained in its folder. Easier to maintain, add, or remove projects. Markdown provides human-readable format for content editing.

**Changes (2026-03-23):**
- Added 'japan' to getProjectFolders() list
- Implemented dynamic thumbnail path resolution for .png files
- Added japanscreen*.png image loading for modal gallery
- Fixed title format to "JAPAN / LANDING" convention

**Technical Details:**
- Custom frontmatter parser: <1KB, O(n) complexity
- Supports: strings, numbers, booleans, comma-separated arrays
- Project folders list: hardcoded in markdown.js (can be moved to build script)
- SCALED FOR: 100k users - parallel loading, caching, lazy image loading
- REUSABLE LOGIC: Markdown parser can be used for blog posts, case studies, etc.

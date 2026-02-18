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

### 🚧 In Progress
- [ ] Landing page - Hero section (NEXT)

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

// ==============================================
// MAIN.JS - Application entry point
// Purpose: Initialize app, load modules, setup routing
// Dependencies: ES6 modules
// Version: 1.0.0
// ==============================================

// ## ANCHOR POINTS
// ENTRY: Application initialization
// DEPS: shared/api.js, shared/router.js, pages/landing.js, components/marquee.js

// Import shared utilities
import { initRouter } from './shared/router.js';
import { loadProjects } from './shared/api.js';

// Import page modules
import { initLanding } from './pages/landing.js';
import { initProject } from './pages/project.js';

// Import components
import { initMarquee } from './components/marquee.js';
import { initCursor } from './components/cursor.js';

// <!-- ANCHOR: init -->
/**
 * Initialize application
 * @returns {Promise<void>}
 * 
 * LOGIC: Main entry point that sets up routing and initializes
 * the appropriate page based on current URL
 */
async function init() {
    try {
        // Initialize custom cursor first - REUSED: from components
        initCursor();
        
        // Initialize router - REUSED: from shared
        const currentPage = initRouter();
        
        // Load page based on route
        if (currentPage === 'landing') {
            await initLanding();
            
            // Initialize marquee animation with RAF
            // Speed: 50 pixels per second for smooth scroll
            initMarquee('.hero__marquee-content', 50);
        } else if (currentPage === 'project') {
            await initProject();
        }
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// UPDATED COMMENTS

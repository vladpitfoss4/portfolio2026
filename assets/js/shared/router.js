// ==============================================
// ROUTER.JS - Simple client-side routing
// Purpose: Handle navigation between pages without full reload
// Dependencies: None
// Version: 1.0.0
// REUSABLE LOGIC: Used for all page navigation
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: initRouter, navigateTo, getQueryParam
// DEPS: None

// <!-- ANCHOR: initRouter -->
/**
 * Initialize router and determine current page
 * @returns {string} Current page identifier ('landing' or 'project')
 * 
 * LOGIC: Checks current URL pathname to determine which page
 * is being viewed. Defaults to 'landing' for root path.
 */
export function initRouter() {
    const path = window.location.pathname;
    
    // Determine current page based on path
    if (path.includes('project.html')) {
        return 'project';
    }
    
    return 'landing';
}

// <!-- ANCHOR: navigateTo -->
/**
 * Navigate to a different page
 * @param {string} page - Page to navigate to ('landing' or 'project')
 * @param {Object} params - Optional query parameters
 * 
 * LOGIC: Constructs URL with query params and navigates.
 * Uses window.location for full page load (no SPA for now).
 */
export function navigateTo(page, params = {}) {
    let url = page === 'landing' ? '/index.html' : '/project.html';
    
    // Add query parameters if provided
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
        url += `?${queryString}`;
    }
    
    window.location.href = url;
}

// <!-- ANCHOR: getQueryParam -->
/**
 * Get query parameter from URL
 * @param {string} param - Parameter name to retrieve
 * @returns {string|null} Parameter value or null if not found
 * 
 * LOGIC: Parses URL search params and returns requested value.
 * Used for getting project ID on detail page.
 */
export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// UPDATED COMMENTS

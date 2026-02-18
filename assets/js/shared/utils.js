// ==============================================
// UTILS.JS - Helper utility functions
// Purpose: Reusable utility functions used across the app
// Dependencies: None
// Version: 1.0.0
// REUSABLE LOGIC: Universal helper functions
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: debounce, formatDate, createElement, sanitizeHTML

// <!-- ANCHOR: debounce -->
/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * 
 * LOGIC: Delays function execution until after wait time has
 * elapsed since last call. Used for search/filter optimization.
 * 
 * SCALED FOR: 100k users - prevents excessive API calls
 */
export function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// <!-- ANCHOR: formatDate -->
/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "18 Feb 2026")
 * 
 * LOGIC: Converts ISO date to localized readable format
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// <!-- ANCHOR: createElement -->
/**
 * Create DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Element attributes
 * @param {Array|string} children - Child elements or text
 * @returns {HTMLElement} Created element
 * 
 * LOGIC: Helper for programmatic DOM creation. Simplifies
 * creating complex element structures in JavaScript.
 */
export function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    // Add children
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

// <!-- ANCHOR: sanitizeHTML -->
/**
 * Basic HTML sanitization
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 * 
 * LOGIC: Removes potentially dangerous HTML tags and attributes.
 * Basic protection against XSS attacks.
 */
export function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

// UPDATED COMMENTS

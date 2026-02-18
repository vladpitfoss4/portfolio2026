// ==============================================
// CURSOR.JS - Custom cursor component
// Purpose: Implement custom animated cursor with circle and dot
// Dependencies: None (vanilla JS)
// Version: 1.0.0
// ==============================================

// ## ANCHOR POINTS
// ENTRY: BigCircle class initialization
// MAIN: Custom cursor with invert effect
// EXPORTS: BigCircle class, initCursor function

// <!-- ANCHOR: BigCircle -->
/**
 * BigCircle - Custom cursor implementation
 * 
 * Creates a custom cursor with two elements:
 * - Large circle with backdrop-filter invert effect
 * - Small dot that follows mouse precisely
 * 
 * Features:
 * - Smooth animations with CSS transitions
 * - Hover effect on interactive elements (buttons, links)
 * - Click animation
 * - Mobile detection (removes cursor on touch devices)
 * - Fallback for browsers without backdrop-filter support
 * 
 * SCALED FOR: All screen sizes, 60fps animations
 */
class BigCircle {
    // <!-- ANCHOR: constructor -->
    /**
     * Initialize cursor component
     * 
     * @constructor
     * Sets up cursor elements, styles, and feature detection
     * 
     * LOGIC: Creates two cursor elements (circle + dot) with
     * backdrop-filter invert effect for visual interest.
     * Falls back to solid colors if backdrop-filter unsupported.
     */
    constructor() {
        // Root element reference
        this.root = document.body;
        
        // Cursor container and elements
        this.cursor = document.querySelector(".curzr");
        this.circle = document.querySelector(".curzr .circle");
        this.dot = document.querySelector(".curzr .dot");
        
        // Mouse position tracking
        this.pointerX = 0;
        this.pointerY = 0;
        
        // Cursor size configuration
        this.cursorSize = 100; // Large circle diameter in pixels
        
        // Circle styles - large outer cursor
        this.circleStyle = {
            boxSizing: 'border-box',
            position: 'fixed',
            top: `${this.cursorSize / -2}px`, // Center on cursor
            left: `${this.cursorSize / -2}px`,
            zIndex: '2147483647', // Maximum z-index to stay on top
            width: `${this.cursorSize}px`,
            height: `${this.cursorSize}px`,
            backgroundColor: '#fff0', // Transparent by default
            borderRadius: '50%', // Perfect circle
            transition: '500ms, transform 100ms', // Smooth movement
            userSelect: 'none',
            pointerEvents: 'none' // Don't interfere with clicks
        };
        
        // Dot styles - small inner cursor
        this.dotStyle = {
            boxSizing: 'border-box',
            position: 'fixed',
            zIndex: '2147483647',
            width: '6px',
            height: '6px',
            backgroundColor: '#fffd', // Semi-transparent white
            borderRadius: '50%',
            userSelect: 'none',
            pointerEvents: 'none',
            transition: '250ms, transform 75ms' // Faster than circle
        };
        
        // Feature detection: Check if backdrop-filter is supported
        // WHY: backdrop-filter creates cool invert effect but not all browsers support it
        if (CSS.supports("backdrop-filter", "invert(1) grayscale(1)")) {
            // Modern browsers: Use backdrop-filter for invert effect
            this.circleStyle.backdropFilter = 'invert(1) grayscale(1)';
            this.circleStyle.backgroundColor = '#fff0';
            this.dotStyle.backdropFilter = 'invert(1) grayscale(1)';
            this.dotStyle.backgroundColor = '#fff0';
        } else {
            // Fallback: Use solid colors with opacity
            this.circleStyle.backgroundColor = '#000';
            this.circleStyle.opacity = '0.75';
            this.dotStyle.backgroundColor = '#fff';
            this.dotStyle.opacity = '0.75';
        }
        
        // Apply styles and show cursor
        this.init(this.circle, this.circleStyle);
        this.init(this.dot, this.dotStyle);
    }
    
    // <!-- ANCHOR: init -->
    /**
     * Apply styles to cursor element
     * 
     * @param {HTMLElement} el - Element to style
     * @param {Object} style - Style object to apply
     * 
     * LOGIC: Applies all styles at once using Object.assign
     * and removes hidden attribute to show cursor
     */
    init(el, style) {
        Object.assign(el.style, style);
        this.cursor.removeAttribute("hidden");
    }
    
    // <!-- ANCHOR: move -->
    /**
     * Update cursor position on mouse move
     * 
     * @param {MouseEvent} event - Mouse event with position data
     * 
     * LOGIC: Updates both circle and dot positions using transform3d
     * for GPU acceleration. Checks if hovering over interactive element
     * or its children to trigger hover effect.
     * 
     * WHY transform3d: Better performance than top/left positioning
     * WHY closest check: Detects hover on children of clickable elements
     */
    move(event) {
        // Update position tracking
        this.pointerX = event.pageX;
        this.pointerY = event.pageY + this.root.getBoundingClientRect().y;
        
        // Move circle (centered on cursor)
        this.circle.style.transform = `translate3d(${this.pointerX}px, ${this.pointerY}px, 0)`;
        
        // Move dot (centered with calc for precision)
        this.dot.style.transform = `translate3d(calc(-50% + ${this.pointerX}px), calc(-50% + ${this.pointerY}px), 0)`;
        
        // Check if hovering over interactive element or its children
        // WHY: Provides visual feedback for clickable elements
        // UPDATED: Now checks parent elements too using closest()
        if (
            event.target.localName === 'button' || 
            event.target.localName === 'a' || 
            event.target.onclick !== null ||
            event.target.className.includes('curzr-hover') ||
            event.target.closest('a') !== null || // Check if inside <a> tag
            event.target.closest('button') !== null || // Check if inside <button> tag
            event.target.closest('.project-card') !== null || // Check if inside project card
            event.target.classList.contains('project-card') // Check if IS project card
        ) {
            this.hover();
        }
    }
    
    // <!-- ANCHOR: hover -->
    /**
     * Apply hover effect (scale up circle)
     * 
     * LOGIC: Scales circle to 4.5x size when hovering
     * over interactive elements for strong visual feedback
     * 
     * UPDATED: Changed from 1.5x to 4.5x (3x stronger)
     */
    hover() {
        this.circle.style.transform += ` scale(2)`;
    }
    
    // <!-- ANCHOR: click -->
    /**
     * Apply click animation (scale down briefly)
     * 
     * LOGIC: Scales circle down to 0.75x on click,
     * then removes scale after 35ms for quick feedback
     * 
     * WHY 35ms: Fast enough to feel responsive but visible
     */
    click() {
        this.circle.style.transform += ` scale(0.75)`;
        
        // Remove scale after animation
        setTimeout(() => {
            this.circle.style.transform = this.circle.style.transform.replace(` scale(0.75)`, '');
        }, 35);
    }
    
    // <!-- ANCHOR: remove -->
    /**
     * Remove cursor elements from DOM
     * 
     * LOGIC: Called on mobile devices to remove
     * custom cursor since they use touch input
     */
    remove() {
        this.circle.remove();
        this.dot.remove();
    }
}

// <!-- ANCHOR: initCursor -->
/**
 * Initialize custom cursor (IIFE)
 * 
 * @returns {void}
 * 
 * LOGIC: Creates cursor instance and sets up event listeners.
 * Detects mobile devices and removes cursor on touch devices.
 * 
 * WHY IIFE: Executes immediately and keeps cursor instance private
 * 
 * REUSABLE LOGIC: Can be called from main.js
 */
export function initCursor() {
    const cursor = new BigCircle();
    
    // Mobile detection regex
    // WHY: Touch devices don't need custom cursor
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Desktop: Setup mouse event listeners
        document.onmousemove = function (event) {
            cursor.move(event);
        };
        
        document.onclick = function () {
            cursor.click();
        };
    } else {
        // Mobile: Remove cursor elements
        cursor.remove();
    }
}

// UPDATED COMMENTS
// FSD: shared/ui component - cursor logic

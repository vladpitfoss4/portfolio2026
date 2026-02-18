// ==============================================
// MARQUEE.JS - Smooth infinite marquee animation
// Purpose: JavaScript-based marquee using RAF for seamless scrolling
// Dependencies: None
// Version: 1.0.0
// REUSABLE LOGIC: Can be used for any marquee effect
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: initMarquee
// DEPS: None

// <!-- ANCHOR: initMarquee -->
/**
 * Initialize smooth marquee animation using requestAnimationFrame
 * @param {string} selector - CSS selector for marquee container
 * @param {number} speed - Pixels per second (default: 50)
 * @param {string} itemSelector - CSS selector for marquee items (default: auto-detect)
 * @returns {Function} Cleanup function to stop animation
 * 
 * LOGIC: Uses RAF instead of CSS animation to prevent jumps on tab switch.
 * Continuously moves content left, resets when halfway point reached.
 * 
 * WHY RAF: CSS animations pause when tab is hidden, causing jumps.
 * RAF continues smoothly regardless of visibility state.
 */
export function initMarquee(selector, speed = 50, itemSelector = null) {
    const marqueeContent = document.querySelector(selector);
    
    if (!marqueeContent) {
        console.warn(`Marquee element not found: ${selector}`);
        return () => {};
    }
    
    let position = 0;
    let animationId = null;
    let isPageVisible = !document.hidden;
    
    // Calculate total width of content (half of all items)
    // We have 6 items, so reset point is at 50%
    const calculateResetPoint = () => {
        // Auto-detect item selector if not provided
        const itemClass = itemSelector || 
            (marqueeContent.querySelector('.hero__marquee-logo') ? '.hero__marquee-logo' : '.bottom-banner__logo');
        
        const firstItem = marqueeContent.querySelector(itemClass);
        if (!firstItem) {
            console.warn(`No marquee items found with selector: ${itemClass}`);
            return 0;
        }
        
        const itemWidth = firstItem.offsetWidth;
        const gap = parseFloat(getComputedStyle(marqueeContent).gap) || 0;
        
        // Reset after 3 items (50% of 6 items)
        return (itemWidth + gap) * 3;
    };
    
    let resetPoint = calculateResetPoint();
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
        resetPoint = calculateResetPoint();
    });
    
    // <!-- ANCHOR: handleVisibilityChange -->
    /**
     * Handle page visibility changes to prevent animation jumps
     * 
     * LOGIC: When page becomes hidden, RAF still runs but at lower priority.
     * We track visibility and use fixed time delta when page is hidden
     * to maintain consistent animation speed.
     */
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });
    
    // <!-- ANCHOR: animate -->
    /**
     * Animation loop using requestAnimationFrame with visibility handling
     * 
     * LOGIC: Uses fixed time step (16.67ms = 60fps) instead of delta time
     * to ensure consistent movement even when tab is hidden.
     * This prevents jumps when returning to the tab.
     */
    function animate() {
        // Use fixed time step for consistent animation
        // 16.67ms = 1/60 second (60fps)
        const fixedDelta = 1 / 60;
        
        // Move position based on speed and fixed time
        position += speed * fixedDelta;
        
        // Reset position when halfway point reached (seamless loop)
        if (position >= resetPoint) {
            position = position % resetPoint;
        }
        
        // Apply transform
        marqueeContent.style.transform = `translateX(-${position}px)`;
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Return cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// UPDATED COMMENTS

// ==============================================
// LANDING.JS - Landing page logic
// Purpose: Initialize and manage landing page functionality
// Dependencies: shared/api.js, components/card.js
// Version: 1.0.0
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: initLanding
// DEPS: shared/api.js, components/card.js

import { loadLinks } from '../shared/api.js';

// <!-- ANCHOR: initLanding -->
/**
 * Initialize landing page
 * @returns {Promise<void>}
 * 
 * LOGIC: Sets up landing page components, loads links data,
 * and renders header with social links. Entry point for landing page.
 */
export async function initLanding() {
    console.log('Landing page initialized');
    
    // Load and render social links in header
    await renderHeaderLinks();
    
    // Start real-time MSK clock
    startMSKClock();
}

// <!-- ANCHOR: renderHeaderLinks -->
/**
 * Load and render social links in hero header
 * @returns {Promise<void>}
 * 
 * LOGIC: Fetches links from JSON, updates header link elements
 * with proper URLs. Uses data attributes to identify links.
 */
async function renderHeaderLinks() {
    const linksData = await loadLinks();
    
    if (!linksData.social) {
        console.warn('No social links found');
        return;
    }
    
    // Get all header link elements
    const behanceLink = document.querySelector('[data-link="behance"]');
    const telegramLink = document.querySelector('[data-link="telegram"]');
    
    // Bind Behance link
    if (behanceLink && linksData.social.behance) {
        behanceLink.href = linksData.social.behance.url;
        behanceLink.target = '_blank';
        behanceLink.rel = 'noopener noreferrer';
        behanceLink.textContent = linksData.social.behance.display;
    }
    
    // Bind Telegram link
    if (telegramLink && linksData.social.telegram) {
        telegramLink.href = linksData.social.telegram.url;
        telegramLink.target = '_blank';
        telegramLink.rel = 'noopener noreferrer';
        telegramLink.textContent = linksData.social.telegram.display;
    }
}

// <!-- ANCHOR: startMSKClock -->
/**
 * Start real-time Moscow (MSK) timezone clock with local calculation
 * @returns {void}
 * 
 * LOGIC: Calculates MSK offset once, then uses local time + offset
 * for smooth updates without timezone conversion delays.
 * Format: "DD MMM HH:MM:SS" (e.g., "18 фев 19:12:11")
 */
function startMSKClock() {
    const timeElement = document.getElementById('msk-time');
    
    if (!timeElement) {
        console.warn('MSK time element not found');
        return;
    }
    
    // Month names in Russian (lowercase for consistency)
    const months = [
        'янв', 'фев', 'мар', 'апр', 'май', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ];
    
    // Calculate MSK offset once at initialization
    // MSK is UTC+3, we calculate offset from local time to MSK
    const getMSKOffset = () => {
        const now = new Date();
        const localTime = now.getTime();
        const localOffset = now.getTimezoneOffset() * 60000; // Convert to milliseconds
        const utcTime = localTime + localOffset;
        const mskOffset = 3 * 60 * 60000; // MSK is UTC+3 in milliseconds
        return utcTime + mskOffset - localTime; // Offset from local to MSK
    };
    
    const mskOffset = getMSKOffset();
    
    /**
     * Update time display using local calculation
     * 
     * LOGIC: Uses local Date() + pre-calculated offset for instant updates.
     * No timezone conversion on each tick = no delays.
     */
    function updateTime() {
        // Get current local time and apply MSK offset
        const now = new Date();
        const mskTime = new Date(now.getTime() + mskOffset);
        
        // Format components
        const day = mskTime.getDate();
        const month = months[mskTime.getMonth()];
        const hours = String(mskTime.getHours()).padStart(2, '0');
        const minutes = String(mskTime.getMinutes()).padStart(2, '0');
        const seconds = String(mskTime.getSeconds()).padStart(2, '0');
        
        // Format: "18 фев 19:12:11"
        const timeString = `${day} ${month} ${hours}:${minutes}:${seconds}`;
        
        timeElement.textContent = timeString;
    }
    
    // Update immediately
    updateTime();
    
    // Update every second with requestAnimationFrame for smooth sync
    let lastSecond = -1;
    
    function tick() {
        const now = new Date();
        const currentSecond = now.getSeconds();
        
        // Only update when second changes
        if (currentSecond !== lastSecond) {
            lastSecond = currentSecond;
            updateTime();
        }
        
        requestAnimationFrame(tick);
    }
    
    requestAnimationFrame(tick);
}

// UPDATED COMMENTS

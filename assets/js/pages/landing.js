// ==============================================
// LANDING.JS - Landing page logic
// Purpose: Initialize and manage landing page functionality
// Dependencies: shared/api.js, components/card.js
// Version: 1.0.0
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: initLanding
// DEPS: shared/api.js, components/card.js

import { loadLinks, loadProjects } from '../shared/api.js';

// <!-- ANCHOR: initLanding -->
/**
 * Initialize landing page
 * @returns {Promise<void>}
 * 
 * LOGIC: Sets up landing page components, loads links data,
 * renders header with social links, and loads projects grid.
 * Entry point for landing page.
 */
export async function initLanding() {
    console.log('Landing page initialized');
    
    // Initialize hero video autoplay - CRITICAL: ensure video plays
    initHeroVideo();
    
    // Load and render social links in header
    await renderHeaderLinks();
    
    // Update resume button in About section - REUSED: from shared/api.js
    await updateResumeButton();
    
    // Start real-time MSK clock
    startMSKClock();
    
    // Load and render projects grid
    await renderProjectsGrid();
    
    // Load and render logos marquee
    renderLogosMarquee();
    
    // Load and render footer links - REUSED: from shared/api.js
    await renderFooterLinks();
    
    // Initialize bottom banner marquee - REUSED: from hero marquee
    await initBottomMarquee();
}

// <!-- ANCHOR: initHeroVideo -->
/**
 * Initialize hero background video with autoplay fallback
 * @returns {void}
 * 
 * LOGIC: Ensures video plays automatically. If video element doesn't exist,
 * creates it dynamically. If browser blocks autoplay, attempts to play on user interaction.
 * 
 * WHY: Video element might be removed by browser or not rendered.
 * This ensures video always exists and plays.
 */
function initHeroVideo() {
    // Wait for DOM to be fully ready - CRITICAL FIX
    setTimeout(() => {
        const heroSection = document.querySelector('.hero');
        let video = document.querySelector('.hero__video');
        
        if (!heroSection) {
            console.error('Hero section not found');
            return;
        }
        
        // If video doesn't exist, create it - CRITICAL FIX
        if (!video) {
            console.warn('Video element not found in DOM, creating it dynamically');
            
            video = document.createElement('video');
            video.className = 'hero__video';
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.poster = 'assets/images/image 8.jpg';
            
            // Add source
            const source = document.createElement('source');
            source.src = 'assets/videos/IMG_2095.MP4';
            source.type = 'video/mp4';
            video.appendChild(source);
            
            // Insert as first child of hero section
            heroSection.insertBefore(video, heroSection.firstChild);
            
            console.log('Video element created and inserted');
        } else {
            console.log('Hero video found:', video);
        }
        
        // Attempt to play video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Hero video autoplay started');
                })
                .catch(error => {
                    console.warn('Video autoplay blocked:', error);
                    
                    // Fallback: play on first user interaction
                    const playOnInteraction = () => {
                        video.play()
                            .then(() => {
                                console.log('Hero video started on user interaction');
                            })
                            .catch(err => {
                                console.error('Failed to play video:', err);
                            });
                        
                        // Remove listeners after first play
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('scroll', playOnInteraction);
                    };
                    
                    // Listen for user interactions
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('scroll', playOnInteraction, { once: true });
                });
        }
    }, 100); // Wait 100ms for DOM to be ready
}

// UPDATED COMMENTS

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

// <!-- ANCHOR: updateResumeButton -->
/**
 * Update resume button URL in About section
 * @returns {Promise<void>}
 * 
 * LOGIC: Fetches links from JSON, updates resume button href
 * 
 * REUSABLE LOGIC: Dynamic button URL from centralized data
 */
async function updateResumeButton() {
    const linksData = await loadLinks();
    
    if (!linksData.contact?.resume) {
        console.warn('No resume link found');
        return;
    }
    
    // Get resume button in About section
    const resumeButton = document.querySelector('.about__actions .btn-outline');
    
    if (resumeButton) {
        resumeButton.href = linksData.contact.resume.url;
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


// <!-- ANCHOR: renderFooterLinks -->
/**
 * Load and render footer links section
 * @returns {Promise<void>}
 * 
 * LOGIC: Fetches links from JSON, updates footer link elements
 * with proper URLs and display text. Uses data attributes to identify links.
 * 
 * REUSABLE LOGIC: Dynamic footer rendering from centralized data
 */
async function renderFooterLinks() {
    const linksData = await loadLinks();
    
    if (!linksData) {
        console.warn('No links data found');
        return;
    }
    
    // Get footer grid container
    const footerGrid = document.querySelector('.footer-links__grid');
    
    if (!footerGrid) {
        console.warn('Footer links grid not found');
        return;
    }
    
    // Clear existing content
    footerGrid.innerHTML = '';
    
    // Column 1: Telegram
    if (linksData.social?.telegram) {
        const telegramCol = createFooterColumn(
            linksData.social.telegram.display,
            linksData.social.telegram.username,
            linksData.social.telegram.url,
            true // external link
        );
        footerGrid.appendChild(telegramCol);
    }
    
    // Column 2: Resume
    if (linksData.contact?.resume) {
        const resumeCol = createFooterColumn(
            linksData.contact.resume.name,
            linksData.contact.resume.display,
            linksData.contact.resume.url,
            false
        );
        footerGrid.appendChild(resumeCol);
    }
    
    // Column 3: Behance
    if (linksData.social?.behance) {
        const behanceCol = createFooterColumn(
            linksData.social.behance.display,
            linksData.social.behance.username,
            linksData.social.behance.url,
            true // external link
        );
        footerGrid.appendChild(behanceCol);
    }
    
    // Column 4: Phone
    if (linksData.contact?.phone) {
        const phoneCol = createFooterColumn(
            linksData.contact.phone.name,
            linksData.contact.phone.display,
            linksData.contact.phone.url,
            false
        );
        footerGrid.appendChild(phoneCol);
    }
}

// <!-- ANCHOR: createFooterColumn -->
/**
 * Create footer column element
 * @param {string} title - Column title
 * @param {string} linkText - Link display text
 * @param {string} url - Link URL
 * @param {boolean} external - Whether link is external (adds target="_blank")
 * @returns {HTMLElement} Column element
 * 
 * LOGIC: Generates a footer column DOM element with title and link.
 * 
 * REUSABLE LOGIC: Footer column component
 */
function createFooterColumn(title, linkText, url, external = false) {
    const column = document.createElement('div');
    column.className = 'footer-links__column';
    
    // Create title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'footer-links__title text-nav';
    titleSpan.textContent = title;
    
    // Create link
    const link = document.createElement('a');
    link.className = 'footer-links__link text-nav';
    link.href = url;
    link.textContent = linkText;
    
    // Add external link attributes
    if (external) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
    
    // Assemble column
    column.appendChild(titleSpan);
    column.appendChild(link);
    
    return column;
}

// UPDATED COMMENTS


// <!-- ANCHOR: renderProjectsGrid -->
/**
 * Load and render projects grid
 * @returns {Promise<void>}
 * 
 * LOGIC: Fetches projects from JSON, creates project cards,
 * and renders them in 2x2 grid. Uses REUSABLE card component.
 */
async function renderProjectsGrid() {
    const projectsData = await loadProjects();
    
    if (!projectsData.projects || projectsData.projects.length === 0) {
        console.warn('No projects found');
        return;
    }
    
    const gridContainer = document.getElementById('projects-grid');
    
    if (!gridContainer) {
        console.warn('Projects grid container not found');
        return;
    }
    
    // Clear existing content
    gridContainer.innerHTML = '';
    
    // Render each project card
    projectsData.projects.forEach(project => {
        const card = createProjectCard(project);
        gridContainer.appendChild(card);
    });
}

// <!-- ANCHOR: createProjectCard -->
/**
 * Create project card element
 * @param {Object} project - Project data object
 * @returns {HTMLElement} Card element
 * 
 * LOGIC: Generates a card DOM element from project data.
 * Includes thumbnail, title with bullet, and year.
 * 
 * REUSABLE LOGIC: Card component for projects grid
 */
function createProjectCard(project) {
    // Create card container
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = `project.html?id=${project.id}`;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-card__image';
    
    const img = document.createElement('img');
    img.src = project.thumbnail;
    img.alt = project.title;
    img.loading = 'lazy'; // Lazy load for performance
    
    imageContainer.appendChild(img);
    
    // Create title with year
    const title = document.createElement('div');
    title.className = 'project-card__title text-nav';
    title.textContent = `${project.title} (${project.year})`;
    
    // Assemble card
    card.appendChild(imageContainer);
    card.appendChild(title);
    
    return card;
}

// UPDATED COMMENTS


// <!-- ANCHOR: renderLogosMarquee -->
/**
 * Render logos marquee with automatic scrolling if needed
 * @returns {void}
 * 
 * LOGIC: Loads logos from assets/images/logos folder,
 * checks if they overflow viewport, and enables marquee animation.
 * Duplicates logos for seamless infinite scroll.
 */
function renderLogosMarquee() {
    const logosTrack = document.getElementById('logos-track');
    
    if (!logosTrack) {
        console.warn('Logos track not found');
        return;
    }
    
    // List of logo files - updated names from folder, Figma moved to left
    const logos = [
        'Figma logo.svg',
        'miro logo.svg',
        'Jira_Logo logo.svg',
        'Logo_Google_Analytics logo.svg',
        'Photoshop.svg',
        'After Effects.svg'
    ];
    
    // Create logo elements
    logos.forEach(logo => {
        const logoItem = document.createElement('div');
        logoItem.className = 'logos__item';
        
        const img = document.createElement('img');
        img.src = `assets/images/logos/${logo}`; // Relative path without leading slash
        img.alt = logo.replace(' logo.svg', '').replace('_', ' ');
        img.loading = 'lazy';
        
        // Error handling for missing images
        img.onerror = () => {
            console.error(`Failed to load logo: ${logo}`);
        };
        
        logoItem.appendChild(img);
        logosTrack.appendChild(logoItem);
    });
    
    // Check if logos overflow and need marquee
    setTimeout(() => {
        const trackWidth = logosTrack.scrollWidth;
        const containerWidth = logosTrack.parentElement.offsetWidth;
        
        if (trackWidth > containerWidth) {
            // Duplicate logos for seamless loop
            logos.forEach(logo => {
                const logoItem = document.createElement('div');
                logoItem.className = 'logos__item';
                
                const img = document.createElement('img');
                img.src = `assets/images/logos/${logo}`;
                img.alt = logo.replace(' logo.svg', '').replace('_', ' ');
                img.loading = 'lazy';
                
                logoItem.appendChild(img);
                logosTrack.appendChild(logoItem);
            });
            
            // Enable marquee animation
            logosTrack.classList.add('logos__track--animate');
        }
    }, 100);
}

// UPDATED COMMENTS


// <!-- ANCHOR: initBottomMarquee -->
/**
 * Initialize bottom banner marquee animation
 * @returns {void}
 * 
 * LOGIC: Uses same marquee logic as hero section.
 * REUSED: Marquee component from components/marquee.js
 */
async function initBottomMarquee() {
    // Import and use marquee component - REUSED from hero
    const { initMarquee } = await import('../components/marquee.js');
    initMarquee('#bottom-marquee', 50, '.bottom-banner__logo');
}

// UPDATED COMMENTS

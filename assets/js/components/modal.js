// ==============================================
// MODAL.JS - Project gallery modal component
// Purpose: Handle modal overlay with vertical image gallery
// Dependencies: None
// Version: 1.0.0
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: openProjectModal, closeProjectModal, initModal
// DEPS: None

// <!-- ANCHOR: initModal -->
/**
 * Initialize modal component with event listeners
 * @returns {void}
 * 
 * LOGIC: Sets up ESC key and backdrop click handlers.
 * Prevents body scroll when modal is open.
 * Click on modal background closes it, but not on images.
 * 
 * REUSABLE LOGIC: Modal initialization pattern
 */
export function initModal() {
    const modal = document.getElementById('project-modal');
    
    if (!modal) {
        console.warn('Modal element not found');
        return;
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('project-modal--visible')) {
            closeProjectModal();
        }
    });
    
    // Click on modal (backdrop) to close
    // WHY: Check if click is directly on modal, not on children (images)
    modal.addEventListener('click', (e) => {
        // Close only if clicked on modal itself (dark background)
        // Not on gallery or images
        if (e.target.id === 'project-modal') {
            closeProjectModal();
        }
    });
}

// <!-- ANCHOR: openProjectModal -->
/**
 * Open modal with project images
 * @param {string} projectId - Project ID to load images from
 * @returns {void}
 * 
 * LOGIC: Loads images from project folder, renders them vertically,
 * shows modal overlay, and prevents body scroll.
 * 
 * WHY: Images are loaded from assets/projects/{projectId}/ folder.
 * All .webp files in folder are displayed in order.
 */
export function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const gallery = document.getElementById('modal-gallery');
    
    if (!modal || !gallery) {
        console.error('Modal elements not found');
        return;
    }
    
    // Clear existing images
    gallery.innerHTML = '';
    
    // Get images for this project - CRITICAL: load from folder
    const images = getProjectImages(projectId);
    
    if (images.length === 0) {
        console.warn(`No images found for project: ${projectId}`);
        return;
    }
    
    // Render images vertically
    images.forEach((imageSrc, index) => {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'project-modal__image';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `${projectId} image ${index + 1}`;
        img.loading = index === 0 ? 'eager' : 'lazy'; // First image eager, rest lazy
        
        imageWrapper.appendChild(img);
        gallery.appendChild(imageWrapper);
    });
    
    // Show modal
    modal.classList.add('project-modal--visible');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log(`Opened modal for project: ${projectId} with ${images.length} images`);
}

// <!-- ANCHOR: closeProjectModal -->
/**
 * Close modal and restore body scroll
 * @returns {void}
 * 
 * LOGIC: Hides modal overlay and restores body scroll.
 */
export function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    
    if (!modal) {
        return;
    }
    
    // Hide modal
    modal.classList.remove('project-modal--visible');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Closed project modal');
}

// <!-- ANCHOR: getProjectImages -->
/**
 * Get array of image paths for a project
 * @param {string} projectId - Project ID
 * @returns {string[]} Array of image paths
 * 
 * LOGIC: Returns hardcoded image paths for each project.
 * Images are stored in assets/projects/{projectFolder}/ folder.
 * 
 * WHY: Static file system - we can't dynamically scan folders in browser.
 * Images must be explicitly listed or loaded from JSON.
 * 
 * SCALED FOR: 100k users - images are lazy loaded
 */
function getProjectImages(projectId) {
    // Map of project IDs to their folder names and image counts
    // Convention: images named 1.webp, 2.webp, 3.webp, etc.
    const projectImagesMap = {
        'adbison-website': {
            folder: 'adbison',
            count: 3
        },
        'instaforex-search': {
            folder: 'instaforex',
            count: 0 // Add images when available
        },
        'safety-first-webapp': {
            folder: 'safetyfirst',
            count: 0 // Add images when available
        }
    };
    
    const projectConfig = projectImagesMap[projectId];
    
    if (!projectConfig || projectConfig.count === 0) {
        return [];
    }
    
    // Generate image paths: 1.webp, 2.webp, 3.webp, ...
    const images = [];
    for (let i = 1; i <= projectConfig.count; i++) {
        images.push(`assets/projects/${projectConfig.folder}/${i}.webp`);
    }
    
    return images;
}

// UPDATED COMMENTS

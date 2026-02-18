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
 * @returns {Promise<void>}
 * 
 * LOGIC: Auto-detects and loads images from project folder,
 * renders them vertically, shows modal overlay, and prevents body scroll.
 * 
 * WHY: Images are auto-detected from assets/projects/{projectId}/ folder.
 * All .webp files (1.webp, 2.webp, etc.) are displayed in order.
 */
export async function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const gallery = document.getElementById('modal-gallery');
    
    if (!modal || !gallery) {
        console.error('Modal elements not found');
        return;
    }
    
    // Clear existing images
    gallery.innerHTML = '';
    
    // Show loading state
    gallery.innerHTML = '<div style="color: white; text-align: center; padding: 40px;">Loading...</div>';
    
    // Get images for this project - CRITICAL: auto-detect from folder
    const images = await getProjectImages(projectId);
    
    // Clear loading state
    gallery.innerHTML = '';
    
    if (images.length === 0) {
        console.warn(`No images found for project: ${projectId}`);
        gallery.innerHTML = '<div style="color: white; text-align: center; padding: 40px;">No images available</div>';
        // Still show modal to display message
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
    
    // Scroll modal to top - CRITICAL: start from beginning of gallery
    modal.scrollTop = 0;
    
    // Prevent body scroll - CRITICAL: save position BEFORE applying fixed
    const scrollY = window.scrollY;
    modal.dataset.scrollY = scrollY.toString();
    
    // Apply fixed position with negative top to maintain visual position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    
    console.log(`Opened modal for project: ${projectId} with ${images.length} images`);
}

// <!-- ANCHOR: closeProjectModal -->
/**
 * Close modal and restore body scroll
 * @returns {void}
 * 
 * LOGIC: Hides modal overlay and restores body scroll position exactly.
 * WHY: position:fixed removes scroll, so we restore it manually.
 */
export function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    
    if (!modal) {
        return;
    }
    
    // Get saved scroll position
    const scrollY = parseInt(modal.dataset.scrollY || '0');
    
    // Hide modal
    modal.classList.remove('project-modal--visible');
    
    // Restore body styles - CRITICAL: remove fixed position
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    
    // Restore scroll position - CRITICAL: do this AFTER removing fixed
    window.scrollTo(0, scrollY);
    
    console.log('Closed project modal');
}

// <!-- ANCHOR: getProjectImages -->
/**
 * Get array of image paths for a project
 * @param {string} projectId - Project ID
 * @returns {Promise<string[]>} Array of image paths
 * 
 * LOGIC: Auto-detects images by trying to load them sequentially.
 * Stops when image fails to load (404). Convention: 1.webp, 2.webp, etc.
 * 
 * WHY: Browser can't scan filesystem. We try loading images until 404.
 * This allows adding images without updating code.
 * 
 * SCALED FOR: 100k users - images are lazy loaded, cached by browser
 */
async function getProjectImages(projectId) {
    // Map of project IDs to their folder names
    const projectFolderMap = {
        'adbison-website': 'adbison',
        'instaforex-search': 'instaforex',
        'safety-first-webapp': 'safetyfirst'
    };
    
    const folder = projectFolderMap[projectId];
    
    if (!folder) {
        console.warn(`Unknown project ID: ${projectId}`);
        return [];
    }
    
    const images = [];
    let index = 1;
    const maxImages = 50; // Safety limit to prevent infinite loop
    
    // Try loading images sequentially until 404
    while (index <= maxImages) {
        const imagePath = `assets/projects/${folder}/${index}.webp`;
        
        // Check if image exists
        const exists = await checkImageExists(imagePath);
        
        if (!exists) {
            break; // Stop when image doesn't exist
        }
        
        images.push(imagePath);
        index++;
    }
    
    return images;
}

// <!-- ANCHOR: checkImageExists -->
/**
 * Check if image file exists
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} True if image exists
 * 
 * LOGIC: Uses fetch HEAD request to check if file exists
 * without downloading the full image.
 * 
 * WHY: Efficient way to detect file existence in browser.
 */
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// UPDATED COMMENTS

// ==============================================
// API.JS - Data fetching and management
// Purpose: Handle all data operations (fetch projects, filter, sort)
// Dependencies: None (vanilla fetch API)
// Version: 1.0.0
// REUSABLE LOGIC: Used across all pages for data access
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: loadProjects, getProjectById, filterProjects, getFeaturedProjects, loadLinks
// DEPS: /data/projects.json, /data/links.json

const DATA_URL = '/data/projects.json';
const LINKS_URL = '/data/links.json';
let cachedData = null;
let cachedLinks = null;

// <!-- ANCHOR: loadProjects -->
/**
 * Load all projects from JSON file
 * @returns {Promise<Object>} Projects data with metadata
 * 
 * LOGIC: Fetches projects.json and caches result to avoid
 * multiple network requests. Returns full data structure.
 * 
 * SCALED FOR: 100k users - implements caching strategy
 */
export async function loadProjects() {
    // Return cached data if available
    if (cachedData) {
        return cachedData;
    }
    
    try {
        const response = await fetch(DATA_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cachedData = data; // Cache for future requests
        
        return data;
    } catch (error) {
        console.error('Failed to load projects:', error);
        // Return empty structure on error
        return { projects: [], metadata: {} };
    }
}

// <!-- ANCHOR: getProjectById -->
/**
 * Get single project by ID
 * @param {string} id - Project unique identifier
 * @returns {Promise<Object|null>} Project object or null if not found
 * 
 * LOGIC: Loads all projects and filters by ID. Returns null
 * if project doesn't exist.
 */
export async function getProjectById(id) {
    const data = await loadProjects();
    return data.projects.find(project => project.id === id) || null;
}

// <!-- ANCHOR: filterProjects -->
/**
 * Filter projects by tag
 * @param {string} tag - Tag to filter by
 * @returns {Promise<Array>} Filtered projects array
 * 
 * LOGIC: Filters projects that include the specified tag.
 * Case-insensitive comparison.
 */
export async function filterProjects(tag) {
    const data = await loadProjects();
    
    if (!tag) {
        return data.projects;
    }
    
    return data.projects.filter(project => 
        project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
}

// <!-- ANCHOR: getFeaturedProjects -->
/**
 * Get featured projects only
 * @returns {Promise<Array>} Featured projects array
 * 
 * LOGIC: Returns only projects marked as featured
 */
export async function getFeaturedProjects() {
    const data = await loadProjects();
    return data.projects.filter(project => project.featured);
}

// <!-- ANCHOR: loadLinks -->
/**
 * Load social links from JSON file
 * @returns {Promise<Object>} Links data with metadata
 * 
 * LOGIC: Fetches links.json and caches result to avoid
 * multiple network requests. Returns full data structure.
 * 
 * REUSABLE LOGIC: Used for header, footer, contact sections
 */
export async function loadLinks() {
    // Return cached data if available
    if (cachedLinks) {
        return cachedLinks;
    }
    
    try {
        const response = await fetch(LINKS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        cachedLinks = data; // Cache for future requests
        
        return data;
    } catch (error) {
        console.error('Failed to load links:', error);
        // Return empty structure on error
        return { social: {}, metadata: {} };
    }
}

// UPDATED COMMENTS

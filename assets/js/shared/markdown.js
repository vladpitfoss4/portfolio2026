// ==============================================
// MARKDOWN.JS - Markdown frontmatter parser
// Purpose: Parse YAML frontmatter from markdown files
// Dependencies: None (vanilla JS regex)
// Version: 1.0.0
// REUSABLE LOGIC: Used for project metadata extraction
// ==============================================

// ## ANCHOR POINTS
// EXPORTS: parseFrontmatter, loadProjectFromMarkdown
// DEPS: None

// <!-- ANCHOR: parseFrontmatter -->
/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Raw markdown content with frontmatter
 * @returns {Object} Parsed frontmatter object and body content
 * 
 * LOGIC: Extracts YAML frontmatter between --- delimiters,
 * parses key-value pairs, and returns structured data.
 * 
 * WHY: Custom parser avoids external dependencies. Only handles
 * simple YAML syntax (key: value, arrays with commas).
 * 
 * SCALED FOR: 100k users - regex-based, O(n) complexity
 */
export function parseFrontmatter(content) {
    // Match frontmatter between --- delimiters
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        // No frontmatter found, return empty metadata
        return {
            metadata: {},
            body: content
        };
    }
    
    const [, frontmatterText, body] = match;
    const metadata = {};
    
    // Parse each line of frontmatter
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.trim().startsWith('#')) {
            continue;
        }
        
        // Parse key: value pairs
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            continue;
        }
        
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Handle different value types
        if (value === 'true') {
            value = true;
        } else if (value === 'false') {
            value = false;
        } else if (!isNaN(value) && value !== '') {
            value = Number(value);
        } else if (value.includes(',')) {
            // Handle comma-separated arrays (tags: UI/UX, Website)
            value = value.split(',').map(v => v.trim());
        }
        
        metadata[key] = value;
    }
    
    return {
        metadata,
        body: body.trim()
    };
}

// <!-- ANCHOR: loadProjectFromMarkdown -->
/**
 * Load and parse project markdown file
 * @param {string} projectId - Project folder name
 * @returns {Promise<Object|null>} Parsed project data or null on error
 * 
 * LOGIC: Fetches project.md from project folder, parses frontmatter,
 * and returns structured project object.
 * 
 * WHY: Decentralized CMS - each project folder contains its own metadata.
 * No need to maintain central projects.json file.
 * 
 * REUSABLE LOGIC: Can be used for any markdown-based content
 */
export async function loadProjectFromMarkdown(projectId) {
    try {
        const url = `/assets/projects/${projectId}/project.md`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`Project markdown not found: ${projectId}`);
            return null;
        }
        
        const content = await response.text();
        const { metadata, body } = parseFrontmatter(content);
        
        // Build project object with required fields
        return {
            id: metadata.id || projectId,
            title: metadata.title || 'Untitled Project',
            year: metadata.year || new Date().getFullYear(),
            link: metadata.link || '',
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
            featured: metadata.featured || false,
            description: body,
            // Thumbnail path convention: first image in folder
            thumbnail: `/assets/projects/${projectId}/1.webp`,
            // Images will be loaded dynamically by modal
            images: []
        };
    } catch (error) {
        console.error(`Failed to load project markdown: ${projectId}`, error);
        return null;
    }
}

// <!-- ANCHOR: scanProjectFolders -->
/**
 * Get list of all project folder names
 * @returns {string[]} Array of project folder names
 * 
 * LOGIC: Hardcoded list of project folders. In browser environment,
 * we cannot dynamically scan filesystem.
 * 
 * WHY: Static site - project folders must be explicitly listed.
 * Alternative: generate this list during build process.
 * 
 * TODO: Move to build script or config file
 */
export function getProjectFolders() {
    return [
        'adbison',
        'instaforex',
        'safetyfirst'
    ];
}

// UPDATED COMMENTS

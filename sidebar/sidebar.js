// sidebar.js - Bookmark Search sidebar logic

const MAX_RESULTS = 20;
const SEARCH_DEBOUNCE_MS = 120;

let bookmarksCache = [];
let selectedIndex = -1;
let resultsList = null;
let searchInput = null;
let emptyState = null;
let debounceTimer = null;

/**
 * Flatten the bookmark tree into an array of bookmark objects with folder paths.
 * Only includes bookmarks that have a URL (not folders).
 *
 * @param {Array} tree - bookmark tree from browser.bookmarks.getTree()
 * @param {Array} [path=[]] - accumulated folder path array
 * @returns {Array} flat array of { id, title, url, folderPath }
 */
function flattenBookmarks(tree, path = []) {
    const flat = [];

    function walk(node, currentPath) {
        const here = node.title ? [...currentPath, node.title] : currentPath;

        if (node.url) {
            // This is a bookmark (not a folder)
            flat.push({
                id: node.id,
                title: node.title || '',
                url: node.url,
                folderPath: here.slice(0, -1).join(' / ')
            });
        }

        if (node.children) {
            node.children.forEach(child => walk(child, here));
        }
    }

    tree.forEach(root => walk(root, path));
    return flat;
}

/**
 * Load all bookmarks from Firefox and populate the cache.
 */
async function loadBookmarks() {
    try {
        const tree = await browser.bookmarks.getTree();
        bookmarksCache = flattenBookmarks(tree);
    } catch (error) {
        console.error('Failed to load bookmarks:', error);
        bookmarksCache = [];
    }
}

/**
 * Search bookmarks with case-insensitive substring matching.
 * Returns up to MAX_RESULTS sorted by relevance.
 *
 * @param {Array} cache - bookmark cache
 * @param {string} query - user search string
 * @returns {Array} filtered and sorted bookmark objects
 */
function searchBookmarks(cache, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const scored = [];

    for (const b of cache) {
        const title = (b.title || '').toLowerCase();
        const url = (b.url || '').toLowerCase();
        const folder = b.folderPath.toLowerCase();

        let score = -1;

        // Priority: title prefix > title contains > url contains > folder contains
        if (title.startsWith(q)) {
            score = 0;
        } else if (title.includes(q)) {
            score = 1;
        } else if (url.includes(q)) {
            score = 2;
        } else if (folder.includes(q)) {
            score = 3;
        }

        if (score >= 0) {
            scored.push({ bookmark: b, score });
        }
    }

    // Sort by score, then alphabetically by title
    scored.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        return a.bookmark.title.localeCompare(b.bookmark.title);
    });

    return scored.slice(0, MAX_RESULTS).map(s => s.bookmark);
}

/**
 * Render search results to the DOM.
 */
function renderResults(results) {
    if (!resultsList) return;

    resultsList.innerHTML = '';
    selectedIndex = -1;

    if (results.length === 0) {
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (emptyState) emptyState.hidden = true;

    results.forEach((bookmark, index) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '0');
        li.setAttribute('data-id', bookmark.id);
        li.setAttribute('data-index', index);

        const title = document.createElement('span');
        title.textContent = bookmark.title || '(Untitled)';
        title.className = 'title';

        const folderPath = document.createElement('span');
        folderPath.textContent = bookmark.folderPath || 'Root';
        folderPath.className = 'folder-path';

        const link = document.createElement('a');
        link.href = bookmark.url;
        link.appendChild(title);
        if (bookmark.folderPath) {
            link.appendChild(folderPath);
        }

        li.appendChild(link);
        resultsList.appendChild(li);
    });

    // Select first result by default
    if (results.length > 0) {
        selectResult(0);
    }
}

/**
 * Select a result by index (for keyboard navigation).
 */
function selectResult(index) {
    if (!resultsList) return;
    const items = resultsList.querySelectorAll('li');
    if (items.length === 0) return;

    // Clamp index
    index = Math.max(0, Math.min(index, items.length - 1));

    // Remove previous selection
    items.forEach(item => {
        item.classList.remove('selected');
        item.removeAttribute('aria-selected');
    });

    // Select new
    const selected = items[index];
    selected.classList.add('selected');
    selected.setAttribute('aria-selected', 'true');
    selected.scrollIntoView({ block: 'nearest' });
    selectedIndex = index;
}

/**
 * Open a bookmark in a new tab.
 */
function openBookmark(bookmark) {
    browser.tabs.create({
        url: bookmark.url,
        active: true
    });
}

/**
 * Handle keyboard navigation.
 */
function handleKeydown(event) {
    if (!resultsList) return;
    const items = resultsList.querySelectorAll('li');
    if (items.length === 0) return;

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectResult(selectedIndex + 1);
            break;

        case 'ArrowUp':
            event.preventDefault();
            selectResult(selectedIndex - 1);
            break;

        case 'Enter':
            event.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                const bookmarkId = items[selectedIndex].dataset.id;
                const bookmark = bookmarksCache.find(b => b.id === bookmarkId);
                if (bookmark) openBookmark(bookmark);
            } else if (items[0]) {
                // Fallback to first result
                const bookmarkId = items[0].dataset.id;
                const bookmark = bookmarksCache.find(b => b.id === bookmarkId);
                if (bookmark) openBookmark(bookmark);
            }
            break;

        case 'Escape':
            event.preventDefault();
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            renderResults([]);
            break;
    }
}

/**
 * Handle click on a result.
 */
function handleResultClick(event) {
    const li = event.target.closest('li');
    if (!li) return;

    event.preventDefault();
    const bookmarkId = li.dataset.id;
    const bookmark = bookmarksCache.find(b => b.id === bookmarkId);
    if (bookmark) openBookmark(bookmark);
}

/**
 * Handle search input (debounced).
 */
function handleSearch(event) {
    const query = event.target.value;

    // Debounce search to avoid excessive filtering
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const results = searchBookmarks(bookmarksCache, query);
        renderResults(results);
    }, SEARCH_DEBOUNCE_MS);
}

/**
 * Refresh bookmarks cache and re-render if there's a current query.
 */
async function refreshBookmarks() {
    if (!searchInput) return;
    const currentQuery = searchInput.value;
    await loadBookmarks();
    if (currentQuery) {
        const results = searchBookmarks(bookmarksCache, currentQuery);
        renderResults(results);
    }
}

/**
 * Initialize the sidebar.
 */
async function init() {
    resultsList = document.getElementById('results');
    searchInput = document.getElementById('search');
    emptyState = document.getElementById('empty-state');

    // Guard against missing DOM elements (shouldn't happen, but be safe)
    if (!searchInput || !resultsList) {
        console.error('Sidebar DOM elements not found');
        return;
    }

    // Focus search input immediately (keyboard-first)
    searchInput.focus();

    // Load bookmarks
    await loadBookmarks();

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keydown', handleKeydown);
    resultsList.addEventListener('click', handleResultClick);
    resultsList.addEventListener('keydown', handleKeydown);

    // Listen for bookmark changes to keep cache fresh
    browser.bookmarks.onCreated.addListener(refreshBookmarks);
    browser.bookmarks.onRemoved.addListener(refreshBookmarks);
    browser.bookmarks.onChanged.addListener(refreshBookmarks);
    browser.bookmarks.onMoved.addListener(refreshBookmarks);
    browser.bookmarks.onImportEnded.addListener(refreshBookmarks);

    // Re-focus search when sidebar is shown (in case it was hidden)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            searchInput.focus();
        }
    });
}

// Start
init();
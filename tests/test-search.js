/**
 * Unit tests for bookmark-search extension
 * Run with: npm test
 *
 * NOTE: The pure search functions (flattenBookmarks, searchBookmarks) are
 * re-implemented here rather than imported from sidebar/sidebar.js because
 * sidebar.js references the browser global (Firefox WebExtensions API).
 * Keep these implementations in sync with sidebar.js — any change to the
 * production logic must be mirrored here.
 */

const assert = require('assert');

/**
 * Flatten the bookmark tree into an array of bookmark objects with folder paths.
 */
function flattenBookmarks(tree, path = []) {
    const flat = [];

    function walk(node, currentPath) {
        const here = node.title ? [...currentPath, node.title] : currentPath;

        if (node.url) {
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
 * Search bookmarks with case-insensitive substring matching.
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

        if (title.startsWith(q)) score = 0;
        else if (title.includes(q)) score = 1;
        else if (url.includes(q)) score = 2;
        else if (folder.includes(q)) score = 3;

        if (score >= 0) {
            scored.push({ bookmark: b, score });
        }
    }

    scored.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        return a.bookmark.title.localeCompare(b.bookmark.title);
    });

    return scored.slice(0, 20).map(s => s.bookmark);
}

// Test data
const sampleTree = [
    {
        id: '1',
        title: 'Bookmarks Toolbar',
        children: [
            {
                id: '2',
                title: 'MDN JavaScript',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
                children: []
            },
            {
                id: '3',
                title: 'Clean Code',
                url: 'https://cleancoder.com',
                children: []
            }
        ]
    },
    {
        id: '4',
        title: 'Bookmarks Menu',
        children: [
            {
                id: '5',
                title: 'Designing Data',
                url: 'https://designingdata.com',
                children: []
            }
        ]
    }
];

// Tests
console.log('Running tests...\n');

// Test 1: flattenBookmarks
console.log('Test 1: flattenBookmarks');
const flat = flattenBookmarks(sampleTree);
assert.strictEqual(flat.length, 4, 'Should flatten to 4 bookmarks');
assert.strictEqual(flat[0].title, 'MDN JavaScript', 'First bookmark title');
assert.strictEqual(flat[0].folderPath, 'Bookmarks Toolbar', 'First bookmark folder path');
assert.strictEqual(flat[2].title, 'Designing Data', 'Third bookmark title');
assert.strictEqual(flat[2].folderPath, 'Bookmarks Menu', 'Third bookmark folder path');
console.log('✅ flattenBookmarks tests passed\n');

// Test 2: searchBookmarks - title match
console.log('Test 2: searchBookmarks - title match');
const results = searchBookmarks(flat, 'javascript');
assert.strictEqual(results.length, 1, 'Should find 1 result');
assert.strictEqual(results[0].title, 'MDN JavaScript', 'Should match JavaScript');
console.log('✅ Title match tests passed\n');

// Test 3: searchBookmarks - URL match
console.log('Test 3: searchBookmarks - URL match');
const urlResults = searchBookmarks(flat, 'cleancoder');
assert.strictEqual(urlResults.length, 1, 'Should find 1 result');
assert.strictEqual(urlResults[0].title, 'Clean Code', 'Should match Clean Code');
console.log('✅ URL match tests passed\n');

// Test 4: searchBookmarks - folder path match
console.log('Test 4: searchBookmarks - folder path match');
const folderResults = searchBookmarks(flat, 'toolbar');
assert.strictEqual(folderResults.length, 2, 'Should find 2 results (MDN and Clean Code)');
console.log('✅ Folder path match tests passed\n');

// Test 5: searchBookmarks - case insensitive
console.log('Test 5: searchBookmarks - case insensitive');
const caseResults = searchBookmarks(flat, 'JAVASCRIPT');
assert.strictEqual(caseResults.length, 1, 'Should find 1 result (case insensitive)');
console.log('✅ Case insensitive tests passed\n');

// Test 6: searchBookmarks - empty query
console.log('Test 6: searchBookmarks - empty query');
const emptyResults = searchBookmarks(flat, '');
assert.strictEqual(emptyResults.length, 0, 'Should return empty array for empty query');
console.log('✅ Empty query tests passed\n');

// Test 7: searchBookmarks - no match
console.log('Test 7: searchBookmarks - no match');
const noMatch = searchBookmarks(flat, 'nonexistent');
assert.strictEqual(noMatch.length, 0, 'Should return empty array for no match');
console.log('✅ No match tests passed\n');

// Test 8: searchBookmarks - relevance sorting
console.log('Test 8: searchBookmarks - relevance sorting');
const sortResults = searchBookmarks(flat, 'clean');
assert.strictEqual(sortResults[0].title, 'Clean Code', 'Title prefix should be first');
console.log('✅ Relevance sorting tests passed\n');

console.log('All tests passed! ✅');

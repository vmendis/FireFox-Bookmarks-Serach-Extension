# Bookmark Search

> A tiny Firefox WebExtension that adds a persistent sidebar with instant, keyboard-first bookmark search.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

- **Always visible sidebar** — stays open while you browse
- **Live search** — results appear as you type, no Search button needed
- **Search everywhere** — matches bookmark title, URL, and folder names
- **Keyboard-first** — auto-focus, arrow navigation, Enter to open
- **Cross-platform** — Linux, Windows, macOS
- **Local only** — uses Firefox's built-in bookmarks API, zero network calls

## Installation

### Temporary (for development/testing)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vmendis/bookmark-search.git
   cd bookmark-search
   ```
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select the `manifest.json` file in this directory

### Permanent (coming soon)

Once published on [addons.mozilla.org](https://addons.mozilla.org), you can install it directly from the Firefox Add-ons store.

## Usage

1. Click the toolbar button (bookmark icon) to open the sidebar
2. Start typing to search your bookmarks
3. Use **↑↓** arrow keys to navigate results — the URL is shown in Firefox's status bar at the bottom of the window
4. Press **Enter** to open the selected bookmark in a new tab
5. Press **Escape** to clear the search

## How It Works

1. On sidebar open, loads all bookmarks via `browser.bookmarks.getTree()`
2. Flattens the hierarchical tree into a searchable array with full folder paths
3. On each keystroke, filters bookmarks where title, URL, or folder path contains the query (case-insensitive)
4. Shows up to 20 results, sorted by relevance:
   - Title prefix match (highest priority)
   - Title contains match
   - URL contains match
   - Folder path contains match (lowest priority)
5. Keyboard navigation: ArrowUp/ArrowDown to move selection, Enter to open, Escape to clear
6. Clicking a result or pressing Enter opens the bookmark in a new tab
7. Listens to bookmark change events (created, removed, changed, moved) to keep results fresh

## File Structure

```
bookmark-search/
├── manifest.json         # Extension metadata and permissions
├── sidebar/
│   ├── sidebar.html      # Sidebar structure
│   ├── sidebar.css      # Native Firefox styling
│   └── sidebar.js       # Main logic
├── icons/                # Toolbar and sidebar icons
├── tests/                # Unit tests
├── README.md             # This file
├── LICENSE               # MIT License
├── CHANGELOG.md          # Version history
├── .gitignore            # Git ignore patterns
├── .gitattributes        # Git attribute configuration
├── .editorconfig         # Editor configuration
├── package.json          # Project metadata and scripts
└── .github/              # GitHub organization files
```

## Permissions

| Permission | Why it's needed |
|------------|-----------------|
| `bookmarks` | Read the bookmark tree to search and display bookmarks |
| `tabs` | Open bookmarked URLs in new tabs |

No data is sent to any server. All bookmark operations are local.

## Development

This extension uses **Manifest V2** for broad Firefox compatibility and reliable sidebar support. A future migration to Manifest V3 is planned once Firefox's MV3 sidebar support matures.

### Testing changes

1. Make your edits
2. In `about:debugging`, click **Reload** for the temporary add-on
3. Or unload and reload the manifest

### Running lint and tests

```bash
npm install
npm test
npm run lint
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](.github/CONTRIBUTING.md) for details.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](.github/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Security

If you discover a security vulnerability, please report it responsibly.
See our [Security Policy](.github/SECURITY.md) for details on how to report
security issues.

## License

This project is licensed under the [MIT License](LICENSE).
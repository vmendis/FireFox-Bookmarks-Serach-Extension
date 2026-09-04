# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `.editorconfig` for consistent editor formatting
- `package.json` with linting and build scripts
- `.github/` directory placeholder for future CI/CD
- `tests/test-search.js` with 8 unit tests for `flattenBookmarks` and `searchBookmarks`
- `.github/workflows/lint.yml` CI workflow (lint + tests on push and PR)
- `.github/CODE_OF_CONDUCT.md` (Contributor Covenant v2.0)
- `.github/CONTRIBUTING.md` with development setup and style guide
- `.github/SECURITY.md` with private vulnerability reporting instructions
- `.gitattributes` for consistent line endings and binary file declarations
- `manifest.json` top-level `icons` key

### Fixed
- **Critical bug**: Removed dead `background.js` code that referenced `browserAction` instead of `sidebar_action`
- **Manifest V2**: Removed `browser_specific_settings.gecko.id` placeholder
- **sidebar.js**: Added null checks, debounced search, better error handling, removed no-op listener
- **README**: Fixed lint instructions, file structure tree, reworded "coming soon", added Contributing/CoC/Security sections
- **CHANGELOG**: Fixed placeholder date, added `[Unreleased]` section
- **gitignore**: Added `node_modules/`, `web-ext-build/`, `.env*`
- **CODE_OF_CONDUCT**: Replaced `[INSERT CONTACT METHOD]` placeholder with GitHub security advisory link
- **README**: Fixed broken `#reporting-bugs` security link by adding dedicated SECURITY.md
- **CI workflow**: Added minimal `permissions: contents: read` for token hardening

### Changed
- **sidebar.js**: Improved code structure with JSDoc comments and better variable declarations
- **tests/test-search.js**: Added sync-warning comment explaining the test/production code relationship
- **package.json**: Added `author`, `repository`, and `bugs` fields (placeholder values to be replaced)

## [1.0.0] - 2024-09-04

### Added
- Initial release
- Firefox sidebar with single search box
- Live search across bookmark title, URL, and folder names
- Case-insensitive substring matching
- Relevance-based result sorting (title prefix > title contains > URL > folder)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click or Enter to open bookmark in new tab
- Auto-focus on search input when sidebar opens
- Cross-platform support (Linux, Windows, macOS)
- Native Firefox sidebar styling via browser_style
- Local-only bookmark access (no external data)
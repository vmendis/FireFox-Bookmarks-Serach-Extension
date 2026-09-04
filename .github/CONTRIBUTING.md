# Contributing to Bookmark Search

Thank you for your interest in contributing to Bookmark Search! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots or animated GIFs if helpful

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and/or GIFs if your changes include visual changes
* Follow the style guidelines
* Document new code based on the Documentation Style Guide

## Development Setup

1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bookmark-search.git
   cd bookmark-search
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Load the extension in Firefox for testing:
   - Open `about:debugging#/runtime/this-firefox`
   - Click **Load Temporary Add-on**
   - Select `manifest.json`

## Development Workflow

```bash
# Run lint
npm run lint

# Run tests
npm test

# Build the extension package
npm run build
```

## Style Guide

* **JavaScript**: 4-space indentation, semicolons, single quotes
* **CSS**: 2-space indentation
* **JSON**: 2-space indentation
* **Markdown**: Trim trailing whitespace, no trailing newlines

## Questions?

Feel free to open an issue with your question, and we'll do our best to help!
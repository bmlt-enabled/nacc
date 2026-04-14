# Contributing to the N.A. Cleantime Calculator

## How to Contribute

To contribute to the N.A. Cleantime Calculator Plugin:

1. Fork the repository
2. Make your changes
3. Send a pull request to the main branch

Take a look at the [issues](https://github.com/bmlt-enabled/nacc/issues) for bugs that you might be able to help fix.

Once your pull request is merged, it will be released in the next version.

## Prerequisites

- PHP 8.0+
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) v18+ and npm
- [Docker](https://www.docker.com/) (optional, for local WordPress environment)

## Setup

```bash
# Install PHP dev dependencies (PHPCS)
composer install

# Build nacc2 JavaScript
cd nacc2 && npm install && npm run build && cd ..
```

## Local Development

### WordPress Environment (Docker)

```bash
make dev               # starts WordPress + MariaDB via Docker
make mysql             # connect to the database
make bash              # shell into the WordPress container
```

The plugin is mounted into the container. After starting, activate it in the WordPress admin and add the `[nacc]` shortcode to a page.

### nacc2 JavaScript

The calculator UI lives in `nacc2/` as ES6 modules built with [Vite](https://vite.dev/).

```bash
cd nacc2
npm install
npm run build          # builds nacc2/nacc.js (IIFE bundle)
```

Source files are in `nacc2/src/`. After editing, run `npm run build` to regenerate `nacc2/nacc.js`. The built file is committed to the repo so the WordPress plugin works without a build step during development.

### Project Structure

```
nacc-wordpress-plugin.php    # WordPress plugin (shortcode, settings, asset loading)
readme.txt                   # WordPress.org plugin readme
nacc2/
  nacc.js                    # built output (committed)
  nacc.css                   # styles and themes
  images/                    # keytag images by language
  src/                       # ES6 source modules
    nacc.js                  # main NACC class
    calc.js                  # date calculation logic
    sprintf.js               # string formatting
    lang/                    # one file per language
  package.json
  vite.config.js
```

### How the Plugin Integrates nacc2

The WordPress plugin:
1. Enqueues `nacc2/nacc.css` and `nacc2/nacc.js` via `wp_enqueue_style`/`wp_enqueue_script`
2. Renders a `<div id="nacc_container"></div>` via the `[nacc]` shortcode
3. Injects `new NACC('nacc_container', theme, lang, layout, special, siteURI)` as inline JS
4. `siteURI` is the full URL to `nacc2/` so keytag images resolve correctly

### Adding a New Language

1. Create `nacc2/src/lang/xx.js` following the pattern in `nacc2/src/lang/en.js` (all string keys must be present)
2. Add the export to `nacc2/src/lang/index.js`
3. Add keytag images to `nacc2/images/xx/` (same filenames as other language directories)
4. Rebuild with `cd nacc2 && npm run build`

## Code Standards

Please make note of the `.editorconfig` file and adhere to it, as this will minimize formatting errors. If you are using PHPStorm, you will need to install the EditorConfig plugin.

### PHP Code Style

This project uses PHP CodeSniffer (phpcs) for code style enforcement. The coding standards are configured in `.phpcs.xml`.

```bash
make lint              # check PHP code style
make fmt               # auto-fix PHP style issues
```

Make sure to run these commands before submitting your pull request to ensure your code adheres to the project's coding standards.

## Release Process

Releases are triggered by pushing a git tag:

1. Update the version in `nacc-wordpress-plugin.php` header and `readme.txt` stable tag
2. Add a changelog entry to `readme.txt`
3. Commit, tag, and push: `git tag 5.2.0 && git push origin 5.2.0`

The `release.yml` workflow will:
- Build `nacc2/nacc.js` from source
- Create a WordPress plugin zip (`nacc-wordpress-plugin.zip`)
- Create a standalone JS zip (`naccjs.zip`)
- Upload both to S3 and create a GitHub Release
- Deploy to WordPress.org (non-beta tags only)

Tags containing "beta" (e.g. `5.2.0-beta1`) create pre-releases and skip WordPress.org deployment.

## What Ships in the WordPress Plugin

The `.gitattributes` file controls what's included in the distribution zip. Dev files (`nacc2/src/`, `nacc2/package.json`, `nacc2/vite.config.js`, `nacc2/node_modules/`, etc.) are excluded. Only `nacc2/nacc.js`, `nacc2/nacc.css`, `nacc2/images/`, and `nacc2/icon.png` are shipped.

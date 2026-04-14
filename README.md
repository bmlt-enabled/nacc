# NACC WordPress Plugin

A WordPress plugin implementation of the [N.A. Cleantime Calculator](nacc2/README.md). Add the `[nacc]` shortcode to any page or post to embed an interactive cleantime calculator with keytag display.

For standalone (non-WordPress) usage, see [nacc2/README.md](nacc2/README.md).

## Installation

1. Download the latest `nacc-wordpress-plugin.zip` from the [releases page](https://github.com/bmlt-enabled/nacc/releases) or install directly from the [WordPress plugin directory](https://wordpress.org/plugins/nacc-wordpress-plugin/).
2. Upload and activate through the WordPress admin under **Plugins**.
3. Add `[nacc]` to any page or post.
4. Optionally configure defaults under **Settings → NACC**.

## Shortcode Attributes

All attributes are optional. Defaults can be set in **Settings → NACC**.

| Attribute | Values | Default |
|-----------|--------|---------|
| `theme` | See themes below | Default (gray) |
| `language` | See languages below | `en` |
| `layout` | `linear`, `tabular` | `linear` |
| `special` | `1`, `0` | `0` |

Example: `[nacc theme="NACC-BT" language="es" layout="tabular" special="1"]`

### Themes

| Value | Description |
|-------|-------------|
| *(empty)* | Default gray |
| `NACC-BT` | Blue and white |
| `NACC-CRNA` | CRNA |
| `NACC-GNYR2` | Light blue (Greater New York Region) |
| `NACC-HOLI` | Black and red (Heart of Long Island) |
| `NACC-NERNA` | NERNA |
| `NACC-SEZF` | SEZF |

### Languages

| Code | Language |
|------|----------|
| `en` | English (default) |
| `es` | Spanish |
| `pt` | Portuguese |
| `it` | Italian |
| `zh-Hans` | Simplified Chinese |
| `zh-Hant` | Traditional Chinese |

## Requirements

- PHP 8.0+
- WordPress 5.3+

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, code standards, and the release process.

## License

GPL v2 or later. See [readme.txt](readme.txt) for full license details.

> **Note:** The name "Narcotics Anonymous" and the NA symbol are registered trademarks of [NAWS](http://na.org). Use of this plugin is intended for registered NA Service bodies. See [nacc2/README.md](nacc2/README.md) for details.

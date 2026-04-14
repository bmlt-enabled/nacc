DESCRIPTION
===========
The NA Cleantime Calculator (NACC) is a browser-based calculator for Narcotics Anonymous cleantime. It requires no server — just include the built `nacc.js` and `nacc.css` files.

The visitor uses three dropdown menus to select a clean date and clicks "Calculate." They are shown a summary of their cleantime (total days, and years/months/days), along with the keytags they would have earned. Tags can be displayed in two layouts:

- **Linear** — tag fronts shown in a row (usually the NA logo).
- **Tabular** — all tags side-by-side showing the rear (with text).

The NACC is localized and supports the standard [Gregorian calendar](https://en.wikipedia.org/wiki/Gregorian_calendar). Specialty tags for long-term cleantime (e.g. the "Decades" tag) can be optionally shown. User preferences (clean date, layout, special tags) are persisted in `localStorage`.

IMPORTANT NOTE
==============
The name "Narcotics Anonymous" and the stylized NA symbol (displayed on the front of the tags) are registered trademarks of [Narcotics Anonymous World Services, Inc. (NAWS)](http://na.org), and cannot be used without [permission from NAWS](https://na.org/service-material/fipt/fipt-faq/). If you are using this web app as part of a registered Service body site, then this permission is implicit.

If you are not a Registered NA Service Body, replace each `XX_Front.png` file with a copy of the corresponding `XX.png` file to avoid displaying the trademarked NA symbol on tag fronts.

NACC is not an official NA Service, but is designed specifically to be implemented by NA Service bodies.

REQUIREMENTS
============
A modern browser is required. No server-side technology is needed.

BUILDING FROM SOURCE
====================
The JavaScript is built using [Vite](https://vitejs.dev/). Node.js 20+ is required.

    cd nacc2
    npm install
    npm run build

This produces `nacc.js` in the `nacc2/` directory.

INSTALLATION
============
Include `nacc.css` and `nacc.js` in your page, create a container element, and instantiate the calculator:

    <head>
        <link rel="stylesheet" type="text/css" href="nacc.css" />
        <script type="text/javascript" src="nacc.js"></script>
    </head>
    <body>
        <div id="nacc-container"></div>
        <script type="text/javascript">new NACC('nacc-container')</script>
    </body>

See `index.html` for a working example with language and theme selectors.

CONSTRUCTOR PARAMETERS
======================
`new NACC(containerId, style, lang, tagLayout, showSpecialTags, directoryRoot, year, month, day)`

1. **containerId** *(required)* — DOM ID of the container element.
2. **style** — Theme class name (e.g. `'NACC-BT'`). Leave null/empty for default gray.
3. **lang** — Language code. Supported: `'en'` (default), `'es'`, `'pt'`, `'it'`, `'zh-Hans'`, `'zh-Hant'`.
4. **tagLayout** — `'linear'` (default) or `'tabular'`.
5. **showSpecialTags** — Boolean. Show specialty long-term tags. Default `false`.
6. **directoryRoot** — Path to the `nacc2/` directory. Leave null/empty for standard use.
7. **year**, **month**, **day** — Initial date for an immediate calculation. All three must be provided together.

Later parameters can be omitted, but intermediate ones must be passed as `null` or `''`.

GET PARAMETERS
==============
These URL parameters override constructor arguments and can be provided in any order:

- `NACC-style` — Theme
- `NACC-lang` — Language
- `NACC-tag-layout` — Tag layout
- `NACC-special-tags` — Show specialty tags
- `NACC-dir-root` — Directory root
- `NACC-year`, `NACC-month`, `NACC-day` — Initial date

LICENSING
=========
Most of the project is licensed under [GPL V3](http://www.gnu.org/licenses/licenses.html#GPL). The repository is available on [GitHub](https://github.com/bmlt-enabled/nacc).

Please read the **IMPORTANT NOTE** above regarding [NA trademarks](http://na.org/?ID=legal-bulletins-fipt), which cannot be reassigned via the GPL.

CHANGELIST
==========
***Version 2.1.0***

- Migrated to ES6 modules, built with Vite
- Added localStorage persistence for layout and special tags settings

***Version 2.0.1** — November 26, 2025*

- Added localStorage support to save and restore the user's clean date

***Version 2.0.0***

- Initial Version

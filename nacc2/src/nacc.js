import { languages } from './lang/index.js';
import { dateSpan } from './calc.js';
import { sprintf } from './sprintf.js';

class NACC {
  /** @type {HTMLDivElement|null} */
  resultsDiv = null;
  /** @type {HTMLDivElement|null} */
  resultsTextDiv = null;
  /** @type {HTMLDivElement|null} */
  keytagsDiv = null;
  /** @type {HTMLInputElement|null} */
  layoutToggleButton = null;
  /** @type {HTMLInputElement|null} */
  specialTagsCheckbox = null;
  /** @type {HTMLLabelElement|null} */
  specialTagsLabel = null;

  constructor(
    containerId,
    style = null,
    lang = null,
    tagLayout = null,
    showSpecialTags = false,
    directoryRoot = null,
    year = null,
    month = null,
    day = null,
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      alert('NACC ERROR: INVALID CONTAINER ELEMENT ID');
      throw new Error(`NACC: no element with id "${containerId}"`);
    }
    this.container = container;

    // Parse GET parameters — they override constructor args
    const params = NACC.getParameters();

    // Directory root
    let root = params['NACC-dir-root'] ?? directoryRoot ?? '';
    if (root && !root.endsWith('/')) root += '/';
    this.directoryRoot = root;

    // Style
    this.styleSelector = params['NACC-style'] ?? style ?? null;

    // Language
    this.langCode = params['NACC-lang'] ?? lang ?? 'en';
    this.lang = languages[this.langCode] ?? languages['en'];

    // Tag layout
    const layoutParam = params['NACC-tag-layout'] ?? tagLayout;
    if (layoutParam === 'linear' || layoutParam === 'tabular') {
      this.tagLayout = layoutParam;
    } else {
      const saved = localStorage.getItem('nacc_keytag_layout');
      this.tagLayout = saved === 'tabular' ? 'tabular' : 'linear';
    }

    // Special tags
    if (params['NACC-special-tags'] || showSpecialTags) {
      this.showSpecialTags = true;
    } else {
      this.showSpecialTags = localStorage.getItem('nacc_keytag_special') === 'true';
    }

    // Set up container classes
    if (this.container.className) {
      this.container.className += ' NACC-Instance';
    } else {
      this.container.className = 'NACC-Instance';
    }
    if (this.styleSelector) {
      this.container.className += ' ' + this.styleSelector;
    }
    this.container.innerHTML = '';

    // Build UI
    this.createHeader();
    this.createForm();
    this.evaluateMonthDays();

    // Check for initial date (GET params > constructor args > localStorage)
    let initYear = parseInt(params['NACC-year']) || (year ? Number(year) : 0);
    let initMonth = parseInt(params['NACC-month']) || (month ? Number(month) : 0);
    let initDay = parseInt(params['NACC-day']) || (day ? Number(day) : 0);

    if (!initYear && !initMonth && !initDay) {
      const saved = localStorage.getItem('nacc_clean_date');
      if (saved) {
        try {
          const obj = JSON.parse(saved);
          initYear = parseInt(obj.year) || 0;
          initMonth = parseInt(obj.month) || 0;
          initDay = parseInt(obj.day) || 0;
        } catch {
          // invalid saved data
        }
      }
    }

    if (initYear && initMonth && initDay) {
      this.monthPopup.selectedIndex = initMonth - 1;
      for (let i = 0; i < this.yearPopup.options.length; i++) {
        if (parseInt(this.yearPopup.options[i].value) === initYear) {
          this.yearPopup.selectedIndex = i;
          break;
        }
      }
      this.dayPopup.selectedIndex = initDay - 1;
      this.evaluateMonthDays();
      this.doCalculation();
    }
  }

  // ── GET Parameters ──────────────────────────────────────────────

  static getParameters() {
    const search = window.location.search.substring(1);
    if (!search) return {};
    const params = {};
    for (const pair of search.split('&')) {
      const [key, val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(val ?? '');
    }
    return params;
  }

  // ── Calculation ─────────────────────────────────────────────────

  doCalculation() {
    const year = parseInt(this.yearPopup.value);
    const month = parseInt(this.monthPopup.value) - 1;
    const day = parseInt(this.dayPopup.value);
    const result = dateSpan(new Date(year, month, day));
    this.displayCalculationResults(result);
  }

  onCalculate(source) {
    if (source === 'layout') {
      this.tagLayout = this.tagLayout === 'linear' ? 'tabular' : 'linear';
      localStorage.setItem('nacc_keytag_layout', this.tagLayout);
    }

    if (source === 'specialTags') {
      this.showSpecialTags = !this.showSpecialTags;
      localStorage.setItem('nacc_keytag_special', String(this.showSpecialTags));
    }

    if (source === 'button') {
      const year = parseInt(this.yearPopup.value);
      const month = parseInt(this.monthPopup.value);
      const day = parseInt(this.dayPopup.value);
      localStorage.setItem('nacc_clean_date', JSON.stringify({ year, month, day }));
    }

    this.doCalculation();
  }

  // ── Result Display ──────────────────────────────────────────────

  displayCalculationResults(r) {
    const L = this.lang;
    let daysBlurb = '';
    let mainBlurb = '';

    if (r.totalDays === 0) {
      daysBlurb = L.result_invalid;
    } else if (r.totalDays === 1) {
      daysBlurb = L.result_1_day;
    } else {
      daysBlurb = sprintf(L.result_days_format, r.totalDays);

      if (r.totalDays > 90) {
        if (r.years > 0) {
          mainBlurb = this.formatYearsBlurb(r);
        } else {
          mainBlurb = this.formatMonthsBlurb(r);
        }
      }
    }

    const totalMonths = r.years * 12 + r.months;
    this.createResultsDiv(r.totalDays, totalMonths, daysBlurb, mainBlurb);
  }

  formatYearsBlurb(r) {
    const L = this.lang;
    const { years: y, months: m, days: d } = r;

    if (y === 1) {
      if (m === 0 && d === 0) return L.result_1_year;
      if (m === 1 && d === 0) return L.result_1_year_and_1_month;
      if (m === 1 && d === 1) return L.result_1_year_1_month_and_1_day;
      if (m === 0 && d === 1) return L.result_1_year_and_1_day;
      if (m === 0 && d > 1) return sprintf(L.result_1_year_days_format, d);
      if (m > 1 && d > 1) return sprintf(L.result_1_year_months_and_days_format, m, d);
      if (m > 1 && d === 1) return sprintf(L.result_1_year_months_and_1_day_format, m);
      if (m > 1 && d === 0) return sprintf(L.result_years_months_format, 1, m);
    }

    if (m === 0 && d === 0) return sprintf(L.result_years_format, y);
    if (m === 1 && d === 0) return sprintf(L.result_years_and_1_month_format, y);
    if (m === 0 && d === 1) return sprintf(L.result_years_and_1_day_format, y);
    if (m === 0 && d > 1) return sprintf(L.result_years_and_days_format, y, d);
    if (m > 1 && d === 0) return sprintf(L.result_years_months_format, y, m);
    if (m === 1 && d === 1) return sprintf(L.result_years_1_month_and_1_day_format, y);
    if (m === 1 && d > 1) return sprintf(L.result_years_1_month_and_days_format, y, d);
    if (m > 1 && d === 1) return sprintf(L.result_years_months_and_1_day_format, y, m);
    return sprintf(L.result_years_months_and_days_format, y, m, d);
  }

  formatMonthsBlurb(r) {
    const L = this.lang;
    const { months: m, days: d } = r;

    if (m > 1 && d === 0) return sprintf(L.result_months_format, m);
    if (m > 1 && d === 1) return sprintf(L.result_months_and_1_day_format, m);
    if (m > 1 && d > 1) return sprintf(L.result_months_and_days_format, m, d);
    return '';
  }

  // ── Month Days Validation ───────────────────────────────────────

  evaluateMonthDays() {
    const numDays = new Date(
      parseInt(this.yearPopup.value),
      parseInt(this.monthPopup.value),
      0,
    ).getDate();

    this.dayPopup.selectedIndex = Math.min(this.dayPopup.selectedIndex + 1, numDays) - 1;

    for (let i = 0; i < this.dayPopup.options.length; i++) {
      this.dayPopup.options[i].disabled = i >= numDays;
    }
  }

  // ── DOM Construction Helpers ────────────────────────────────────

  el(tag, className, parent) {
    const elem = document.createElement(tag);
    if (className) elem.className = className;
    elem.id = className.replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 12);
    if (parent) parent.appendChild(elem);
    return elem;
  }

  // ── Header ──────────────────────────────────────────────────────

  createHeader() {
    const header = this.el('div', 'NACC-Header', this.container);
    header.innerHTML = this.lang.section_title;
  }

  // ── Form Structure ──────────────────────────────────────────────

  createForm() {
    const form = this.el('form', 'NACC-Form', this.container);
    const fieldset = this.el('fieldset', 'NACC-Fieldset', form);
    const legend = this.el('legend', 'NACC-Legend', fieldset);
    const legendDiv = this.el('div', 'NACC-Legend-div', legend);

    this.promptLabel = this.el('label', 'NACC-Prompt-Label', legendDiv);
    this.promptLabel.innerHTML = this.lang.prompt;

    this.popupContainer = this.el('div', 'NACC-Popups', legendDiv);

    this.createMonthPopup();
    this.createDayPopup();
    this.createYearPopup();
    this.createCalculateButton();
    this.el('div', 'breaker', this.popupContainer);
  }

  createMonthPopup() {
    this.monthPopup = this.el('select', 'NACC-Month', this.popupContainer);
    this.promptLabel.setAttribute('for', this.monthPopup.id);

    const nowMonth = new Date().getMonth();
    for (let i = 1; i <= 12; i++) {
      const opt = this.el('option', 'NACC-Option', this.monthPopup);
      opt.value = String(i);
      opt.innerHTML = this.lang.months[i];
    }
    this.monthPopup.selectedIndex = nowMonth;
    this.monthPopup.onchange = () => this.evaluateMonthDays();
  }

  createDayPopup() {
    this.dayPopup = this.el('select', 'NACC-Day', this.popupContainer);

    const nowDay = new Date().getDate();
    for (let d = 1; d <= 31; d++) {
      const opt = this.el('option', 'NACC-Option', this.dayPopup);
      opt.value = String(d);
      opt.innerHTML = String(d);
    }
    this.dayPopup.selectedIndex = nowDay - 1;
  }

  createYearPopup() {
    this.yearPopup = this.el('select', 'NACC-Year', this.popupContainer);

    const nowYear = new Date().getFullYear();
    for (let y = 1953; y <= nowYear; y++) {
      const opt = this.el('option', 'NACC-Option', this.yearPopup);
      opt.value = String(y);
      opt.innerHTML = String(y);
    }
    this.yearPopup.selectedIndex = this.yearPopup.options.length - 1;
    this.yearPopup.onchange = () => this.evaluateMonthDays();
  }

  createCalculateButton() {
    this.calculateButton = this.el('input', 'NACC-Calculate-Button', this.popupContainer);
    this.calculateButton.type = 'button';
    this.calculateButton.value = this.lang.calculate_button_text;
    this.calculateButton.onclick = () => this.onCalculate('button');
  }

  // ── Results ─────────────────────────────────────────────────────

  createResultsDiv(numDays, totalMonths, daysBlurb, mainBlurb) {
    if (this.resultsDiv) {
      this.resultsDiv.innerHTML = '';
      this.resultsTextDiv = null;
      this.keytagsDiv = null;
    } else {
      this.resultsDiv = this.el('div', 'NACC-Results', this.container.querySelector('.NACC-Fieldset'));
    }

    // Text results
    if (daysBlurb) {
      this.resultsTextDiv = this.el('div', 'NACC-Results-Text', this.resultsDiv);
      const daysDiv = this.el('div', 'NACC-Days', this.resultsTextDiv);
      daysDiv.innerHTML = daysBlurb;
      if (mainBlurb) {
        const mainDiv = this.el('div', 'NACC-MainBlurb', this.resultsTextDiv);
        mainDiv.innerHTML = mainBlurb;
      }
    }

    // Keytags
    if (numDays > 0) {
      const tabularClass = this.tagLayout !== 'linear' ? ' NACC-Keytag-Tabular' : '';
      this.keytagsDiv = this.el('div', 'NACC-Keytags' + tabularClass, this.resultsDiv);
      this.createTagsArray(numDays, totalMonths);
    }
  }

  // ── Keytag Creation ─────────────────────────────────────────────

  createKeytag(tagNum, isFace, isClosed) {
    const closed = isClosed ?? !isFace;
    const className = 'NACC-Keytag' + (closed || this.tagLayout !== 'linear' ? ' NACC-Keytag-Ringtop' : '');
    const img = this.el('img', className, this.keytagsDiv);
    const suffix = isFace ? '_Front' : '';
    img.src = `${this.directoryRoot}images/${this.langCode}/${tagNum}${suffix}.png`;
    return img;
  }

  createTagsArray(numDays, totalMonths) {
    const isFace = this.tagLayout === 'linear';

    if (numDays >= 1) {
      const tag = this.createKeytag('01', isFace, true);
      tag.className += ' NACC-White-Tag';
    }
    if (numDays >= 30) this.createKeytag('02', isFace);
    if (numDays >= 60) this.createKeytag('03', isFace);
    if (numDays >= 90) this.createKeytag('04', isFace);

    if (numDays > 90) {
      if (totalMonths > 5) this.createKeytag('05', isFace);
      if (totalMonths > 8) this.createKeytag('06', isFace);
      if (totalMonths > 11) this.createKeytag('07', isFace);
      if (totalMonths > 17) this.createKeytag('08', isFace);
      if (totalMonths > 23) this.createKeytag('09', isFace);

      for (let i = 24; i <= totalMonths - 12; i += 12) {
        const comp = i + 12;
        let specialTag = false;

        if (this.showSpecialTags) {
          if (comp === 60) { specialTag = true; this.createKeytag('15', isFace); }
          if (comp === 120) { specialTag = true; this.createKeytag('10', isFace); }
          if (comp === 180) { specialTag = true; this.createKeytag('16', isFace); }
          if (!specialTag && comp === 300) { specialTag = true; this.createKeytag('12', isFace); }
          if (!specialTag && comp === 360) { specialTag = true; this.createKeytag('14', isFace); }
          if (!specialTag && comp % 120 === 0) { specialTag = true; this.createKeytag('11', isFace); }
        }

        if (!specialTag) this.createKeytag('09', isFace);

        if (this.showSpecialTags && comp === 324 && numDays > 9999) {
          this.createKeytag('13', isFace);
        }
      }
    }

    this.createLayoutToggle();
  }

  createLayoutToggle() {
    this.layoutToggleButton?.parentNode?.removeChild(this.layoutToggleButton);
    this.specialTagsCheckbox?.parentNode?.removeChild(this.specialTagsCheckbox);
    this.specialTagsLabel?.parentNode?.removeChild(this.specialTagsLabel);

    this.layoutToggleButton = this.el('input', 'NACC-Change-Layout-Button', this.popupContainer);
    this.layoutToggleButton.type = 'button';
    this.layoutToggleButton.value = this.lang.change_layout_button_text;
    this.layoutToggleButton.onclick = () => this.onCalculate('layout');

    this.specialTagsCheckbox = this.el('input', 'NACC-Show-Special-Tags-Checkbox', this.popupContainer);
    this.specialTagsCheckbox.type = 'checkbox';
    this.specialTagsCheckbox.checked = this.showSpecialTags;
    this.specialTagsCheckbox.value = '1';
    this.specialTagsCheckbox.onclick = () => this.onCalculate('specialTags');

    this.specialTagsLabel = this.el('label', 'NACC-Show-Special-Tags-Checkbox-Label', this.popupContainer);
    this.specialTagsLabel.setAttribute('for', this.specialTagsCheckbox.id);
    this.specialTagsLabel.innerHTML = this.lang.change_use_special_tags_label;

    this.el('div', 'breaker', this.popupContainer);
  }
}

// Expose globally for <script> tag usage
window.NACC = NACC;

export default NACC;

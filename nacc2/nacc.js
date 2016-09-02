/***************************************************************************/
/**
    The NA Cleatime Calculator (NACC)
    
    This is the second version of the NACC. It is designed to be a browser-based
    cleantime calculator (meaning it relies solely on HTML, JavaScript and CSS).
    
    NACC is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    BMLT is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this code.  If not, see <http://www.gnu.org/licenses/>.
*/

/***********************************************************************/
/**
    \brief  This is the main class function for the NACC.
    
    \param  inContainerElementID A DOM ID to the DOM element that will
            contain this instance. It should be an empty div element.
    \param  inStyle This is the style (leave blank/null for default gray).
    \param  inLang A string, with the language selector.
*/
function NACC(inContainerElementID, inStyle, inLang) {
    if ( inLang ) {
        this.lang_selector = inLang;
    } else {
        this.lang_selector = 'en';
    };
    
    this.lang = Array();
    this.lang['en'] = new Object();
    
    /************************************/
    /*           LOCALIZATION           */
    /************************************/
    /** This is the header, at the top. */
    this.lang['en'].section_title           = 'NA Cleantime Calculator';
    /** This is the prompt over the popup menus. */
    this.lang['en'].prompt                  = 'Please enter your Clean Date';
    /** This is the text for the calculate button. */
    this.lang['en'].calculate_button_text   = 'Calculate';
    /** These are the months, spelled out. */
    this.lang['en'].months                  = Array("ERROR",
                                                    "January",
                                                    "February",
                                                    "March",
                                                    "April",
                                                    "May",
                                                    "June",
                                                    "July",
                                                    "August",
                                                    "September",
                                                    "October",
                                                    "November",
                                                    "December"
                                                    );
    
    /************************************/
    /*            MAIN CODE             */
    /************************************/
    this.m_my_container = document.getElementById(inContainerElementID);
    this.m_my_container.nacc_instance = this;    // Link this NACC instance with the container element.
    // Make sure the container is tagged with the NACC-Instance class.
    if ( this.m_my_container.className ) {
        this.m_my_container.className += ' NACC-Instance';   // Appending to an existing class.
    } else {
        this.m_my_container.className = 'NACC-Instance';     // From scratch.
    };
    
    if ( inStyle ) {
        this.m_my_container.className += ' ' + inStyle;   // Append any style selection.
    };
    
    this.createHeader();
    this.createForm();
};

/** This is the language selector. */
NACC.prototype.lang_selector = null;
/** This is an array, with all the language-specific strings. */
NACC.prototype.lang = null;
/// This is the object that "owns" this instance.
NACC.prototype.m_my_container = null;
/// This is the form that contains the popups.
NACC.prototype.m_my_form = null;
/// This is the prompt above the popups.
NACC.prototype.m_my_prompt = null;
/// This is the fieldset that contains the popups and the results.
NACC.prototype.m_my_fieldset = null;
/// This is the fieldset legend that contains the popups.
NACC.prototype.m_my_legend = null;
/// This is a div that will contain the popups.
NACC.prototype.m_popup_container = null;
/// This is the month popup.
NACC.prototype.m_month_popup = null;
/// This is the day of the month popup.
NACC.prototype.m_day_popup = null;
/// This is the year popup.
NACC.prototype.m_year_popup = null;
/// This is the calculate button.
NACC.prototype.m_calculate_button = null;
/// This is the calculate results div.
NACC.prototype.m_calculation_results_div = null;
/// This is the calculate results display toggle button div.
NACC.prototype.m_calculation_results_display_toggle_div = null;
/// This is the calculate results display toggle button.
NACC.prototype.m_calculation_results_display_toggle_button = null;
/// This is the calculate results text div.
NACC.prototype.m_calculation_results_text_div = null;
/// This is the calculate results keytags div.
NACC.prototype.m_calculation_results_keytags_div = null;

/***********************************************************************/
/**
    \brief  This allows us to compare today to a given date.
            
            Cribbed from here: https://gist.github.com/clecuona/2945438
    
    \param  inFromDate The date that will be the one we compare against.
            This date should always be earlier than the current date.
    
    \returns an object, with the total number of days, and the span, in years, months and days.
*/
NACC.prototype.dateSpan = function(inFromDate) {
    var difference = new Object;
    
    difference.totalDays = 0;
    difference.years = 0;
    difference.months = 0;
    difference.days = 0;
    
    var dt2 = new Date();
    var dt1 = inFromDate;
    
    if ( dt2 > dt1 ) {
        difference.totalDays = parseInt((dt2.getTime() - dt1.getTime()) / 86400000);
        
        var year1 = dt1.getFullYear();
        var year2 = dt2.getFullYear();

        var month1 = dt1.getMonth();
        var month2 = dt2.getMonth();

        var day1 = dt1.getDate();
        var day2 = dt2.getDate();
        
        difference.years = year2 - year1;
        difference.months = month2 - month1;
        difference.days = day2 - day1;

        if ( difference.days < 0 ) {
            // Use temporary date to get the number of days remaining in the month
            var numDays = new Date(year1, month1 + 1, 1, 0, 0, -1).getDate();

            difference.months -= 1;
            difference.days += numDays;
        };
        
        if ( difference.months < 0 ) {
            difference.months += 12;
            difference.years -= 1;
        };
    };
    
    return difference;
};

/***********************************************************************/
/**
    \brief This simply generates a random numerical ID.
    
    \param inPrefix If this is supplied, it is a prefix that is prepended.
    
    \returns a random ID as a string, with the prefix (or 'NACC') prepended.
*/
NACC.prototype.generateID = function(inPrefix) {
    if ( !inPrefix ) {  // We always have some kind of prefix.
        inPrefix = 'NACC';
    };
    
    return inPrefix + '-' + Math.random().toString(36).substr(2, 10);
};

/***********************************************************************/
/**
    \brief  This creates a DOM object, and returns it. If a DOM object
            is passed in as a container, then the created object is added
            to that container as a child.
    
    \param  inObjectName A string. The type of object (i.e. 'div', 'img', etc.)
    \param  inClass A string. One or more classnames for the object. If left nil
            or blank, then no class is applied.
    \param  inContainer A DOM element reference. If non-nil, the parent for the new object.
    
    \returns a new DOM object.
*/
NACC.prototype.createDOMObject = function(inObjectName, inClass, inContainer) {
    var newObject = document.createElement(inObjectName);
    
    // Make sure we got something, first.
    if ( null != newObject ) {
        // See if we were given a CSS class. This may have whitespace.
        var objectID = inClass ? inClass : '';
        
        if ( objectID ) {
            newObject.className = objectID;
        };
        
        // Make sure we don't have whitespace in our ID (not allowed).
        objectID = objectID.replace(/\s+?/, '-');
        
        // If we are contained, then our ID derives from the container's ID.
        if ( (null != inContainer) && inContainer.id ) {
            objectID = inContainer.id + '-' + objectID;
        }
        
        newObject.id = this.generateID(objectID);
        
        // See if we were given a container. If so, we append into that.
        if ( null != inContainer ) {
            inContainer.appendChild(newObject);
        };
    };
    
    return newObject;
};

/***********************************************************************/
/**
    \brief  This creates the a single select option, and appends it into the given select.
    
    \param  inSelectObject This is the select element that will contain the option.
    \param  inDisplayString This is the string to be displayed.
    \param  inValue This is the value for the option.
    \param  inDisabled if true, then the option is disabled.
    
    \returns the option object (which is automatically added to the select).
*/
NACC.prototype.createOptionObject = function(inSelectObject, inDisplayString, inValue, inDisabled) {
    var newObject = null;
    
    if ( inSelectObject && inDisplayString ) {  // We can do without a value, but need a select and a display string.
        newObject = this.createDOMObject('option', 'NACC-Option', inSelectObject);
        
        if ( newObject ) {
            newObject.value = inValue;
            newObject.innerHTML = inDisplayString;
            if ( inDisabled ) {
                newObject.enabled = false;
            };
        };
    };
    
    return newObject;
};

/***********************************************************************/
/**
    \brief  This creates the header at the top of the form.
*/
NACC.prototype.createHeader = function() {
    var newObject = this.createDOMObject('div', 'NACC-Header', this.m_my_container);
    
    if ( null != newObject ) {  
        newObject.innerHTML = this.lang[this.lang_selector].section_title;
    };
};

/***********************************************************************/
/**
    \brief  This creates the form.
*/
NACC.prototype.createForm = function() {
    this.m_my_form = this.createDOMObject('form', 'NACC-Form', this.m_my_container);
    
    if ( null != this.m_my_form ) {
        this.createFieldset();
    };
};

/***********************************************************************/
/**
    \brief  This creates the fieldset that contains the popups and results.
*/
NACC.prototype.createFieldset = function() {
    this.m_my_fieldset = this.createDOMObject('fieldset', 'NACC-Fieldset', this.m_my_form);
    if ( null != this.m_my_fieldset ) {  
        this.createLegend();
    };
};

/***********************************************************************/
/**
    \brief  This creates the fieldset legend that contains the popups.
*/
NACC.prototype.createLegend = function() {
    this.m_my_legend = this.createDOMObject('legend', 'NACC-Legend', this.m_my_fieldset);
    
    if ( null != this.m_my_legend ) {  
        this.createPrompt();
        this.createPopupContainer();
    };
};

/***********************************************************************/
/**
    \brief  This creates the prompt above the popups.
*/
NACC.prototype.createPrompt = function() {
    this.m_my_prompt = this.createDOMObject('label', 'NACC-Prompt-Label', this.m_my_legend);
    
    if ( null != this.m_my_prompt ) {  
        this.m_my_prompt.innerHTML = this.lang[this.lang_selector].prompt;
    };
};

/***********************************************************************/
/**
    \brief  This creates the popup container and the popups.
*/
NACC.prototype.createPopupContainer = function() {
    this.m_popup_container = this.createDOMObject('div', 'NACC-Popups', this.m_my_legend);
    
    if ( null != this.m_popup_container ) {
        this.createMonthPopup();
        this.createDayPopup();
        this.createYearPopup();
        this.evaluateMonthDays();
        this.createCalculateButton();
        this.createDOMObject('div', 'breaker', this.m_popup_container);
    };
};

/***********************************************************************/
/**
    \brief  This creates the month popup.
*/
NACC.prototype.createMonthPopup = function() {
    this.m_month_popup = this.createDOMObject('select', 'NACC-Month', this.m_popup_container);
    
    if ( null != this.m_month_popup ) {
        var nowMonth = new Date().getMonth();
        this.m_my_prompt.setAttribute('for', this.m_month_popup.id);
        for ( var i = 1; i < 13; i++ ) {
            var selectedMonth = this.lang[this.lang_selector].months[i];
            selectedOption = this.createOptionObject(this.m_month_popup, selectedMonth, i.toString(), false);
        };
        this.m_month_popup.selectedIndex = nowMonth;
        this.m_month_popup.owner = this;
        this.m_month_popup.onchange = function(){NACC.prototype.monthOrYearPopupChanged(this)};
    };
};

/***********************************************************************/
/**
    \brief  This creates the day of the month popup.
*/
NACC.prototype.createDayPopup = function() {
    this.m_day_popup = this.createDOMObject('select', 'NACC-Day', this.m_popup_container);
    
    if ( null != this.m_day_popup ) {  
        var nowDay = new Date().getDate();
        for ( var day = 1; day < 32; day++ ) {
            selectedOption = this.createOptionObject(this.m_day_popup, day.toString(), day.toString(), false);
        };
        this.m_day_popup.selectedIndex = nowDay - 1;
    };
};

/***********************************************************************/
/**
    \brief  This creates the year popup.
*/
NACC.prototype.createYearPopup = function() {
    this.m_year_popup = this.createDOMObject('select', 'NACC-Year', this.m_popup_container);
    
    if ( null != this.m_year_popup ) {
        var nowYear = new Date().getFullYear();
        for ( var year = 1953; year <= nowYear; year++ ) {
            selectedOption = this.createOptionObject(this.m_year_popup, year, year, false);
        };
        this.m_year_popup.selectedIndex = this.m_year_popup.options.length - 1;
        this.m_year_popup.owner = this;
        this.m_year_popup.onchange = function(){NACC.prototype.monthOrYearPopupChanged(this)};
    };
};

/***********************************************************************/
/**
    \brief  This creates the calculate button.
*/
NACC.prototype.createCalculateButton = function() {
    this.m_calculate_button = this.createDOMObject('input', 'NACC-Calculate-Button', this.m_popup_container);
    
    if ( null != this.m_calculate_button ) {
        this.m_calculate_button.setAttribute('type', 'button');
        this.m_calculate_button.value = this.lang[this.lang_selector].calculate_button_text;
        this.m_calculate_button.owner = this;
        this.m_calculate_button.onclick = function(){NACC.prototype.calculateCleantime(this)};
    };
};

/***********************************************************************/
/**
    \brief  This is called when the month popup is changed.
*/
NACC.prototype.evaluateMonthDays = function() {
    var dtmp1 = new Date(this.m_year_popup.value, this.m_month_popup.value, 1, 0, 0, -1);

    var numDays = parseInt(dtmp1.getDate());
    this.m_day_popup.selectedIndex = Math.min(this.m_day_popup.selectedIndex + 1, numDays) - 1;
    
    for ( var i = 0; i < this.m_day_popup.options.length; i++ ) {
        this.m_day_popup.options[i].disabled = (i >= numDays);
    };
};

/***********************************************************************/
/**
    \brief  This is called when the month or year popup is changed.
            The day popup is adjusted to reflect the available days.
    
    \param  inObject This is the popup object. We use it to get our main instance.
*/
NACC.prototype.monthOrYearPopupChanged = function(inObject) {
    inObject.owner.evaluateMonthDays();
};

/***********************************************************************/
/**
    \brief  This actually performs the calculation.
    
    \param  inObject This is the button object. We use it to get our main instance.
*/
NACC.prototype.calculateCleantime = function(inObject) {
    var owner = inObject.owner;
    var year = parseInt(owner.m_year_popup.value);
    var month = parseInt(owner.m_month_popup.value) - 1;
    var day = parseInt(owner.m_day_popup.value);
    
    // First, we get the date from the popup menus...
    var fromDate = new Date(year, month, day, 0, 0, 0, 0);
    
    // And compare it to today.
    var difference = this.dateSpan(fromDate);
    
    alert ( "years: " + difference.years.toString() + "\nmonths: " + difference.months.toString() +  "\ndays: " + difference.days.toString() + "\ntotal days: " + difference.totalDays.toString() );
};

/***********************************************************************/
/**
    \brief  This displays the results of the calculation.
*/
NACC.prototype.displayCalculationResults = function() {
};


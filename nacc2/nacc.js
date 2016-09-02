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
/*                              MAIN FUNCTION                          */
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
    /** These are for the top (days) blurb. */
    this.lang['en'].result_1_day                            = 'You have been clean for 1 day!';
    this.lang['en'].result_days_format                      = 'You have been clean for %d days!';

    /** These are for the second (months, years and days) blurb. */
    this.lang['en'].result_1_year                           = 'This is 1 year.';
    this.lang['en'].result_1_year_and_1_day                 = 'This is 1 year and 1 day.';
    this.lang['en'].result_1_year_and_1_month               = 'This is 1 year and 1 month.';
    this.lang['en'].result_1_year_1_month_and_1_day         = 'This is 1 year, 1 month and 1 day.';
    this.lang['en'].result_1_year_months_and_1_day_format   = 'This is 1 year, %d months and 1 day.';
    this.lang['en'].result_1_year_days_format               = 'This is 1 year and %d days.';
    // There is no 1 month, as everything is for more than 90 days.
    this.lang['en'].result_months_format                    = 'This is %d months.';
    this.lang['en'].result_years_format                     = 'This is %d years.';
    this.lang['en'].result_years_months_format              = 'This is %d years and %d months.';
    this.lang['en'].result_months_and_1_day_format          = 'This is %d months and 1 day.';
    this.lang['en'].result_months_and_days_format           = 'This is %d months and %d days.';
    this.lang['en'].result_years_1_month_and_1_day_format   = 'This is %d years, 1 month and 1 day.';
    this.lang['en'].result_years_months_and_1_day_format    = 'This is %d years, %d months and 1 day.';
    this.lang['en'].result_years_and_1_month_format         = 'This is %d years and 1 month.';
    this.lang['en'].result_years_and_1_day_format           = 'This is %d years and 1 day.';
    this.lang['en'].result_years_and_days_format            = 'This is %d years and %d days.';
    this.lang['en'].result_years_1_month_and_days_format    = 'This is %d years, 1 month and %d days.';
    this.lang['en'].result_years_months_and_days_format     = 'This is %d years, %d months and %d days.';
    
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
    
    this.m_my_container.innerHTML = '';
    
    this.createHeader();
    this.createForm();
};

/***********************************************************************/
/*                           OBJECT PROPERTIES                         */
/***********************************************************************/
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
/*                            OBJECT METHODS                           */
/***********************************************************************/
/*                           INTERNAL UTILITY                          */
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
    \brief  This checks the month and year, and disables any month days
            that are not available for the given month. It will also
            move the selection, if a selected day is too far down.
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
    \brief  This displays the results of the calculation.
*/
NACC.prototype.displayCalculationResults = function(inCalculationResults) {

    var days_blurb = '';
    if ( 1 == inCalculationResults.totalDays ) {
        days_blurb = this.lang[this.lang_selector].result_1_day;
    } else {
        days_blurb = this.sprintf(this.lang[this.lang_selector].result_days_format, inCalculationResults.totalDays);
    };
    
    var main_blurb = '';
    
    if ( 90 < inCalculationResults.totalDays ) {
        if ( 0 < inCalculationResults.years ) {
            if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                main_blurb = this.lang[this.lang_selector].result_1_year;
            } else if ( (1 == inCalculationResults.years) && (1 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                main_blurb = this.lang[this.lang_selector].result_1_year_and_1_month;
            } else if ( (1 == inCalculationResults.years) && (1 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                main_blurb = this.lang[this.lang_selector].result_1_year_1_month_and_1_day;
            } else if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                main_blurb = this.lang[this.lang_selector].result_1_year_and_1_day;
            } else if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_1_year_days_format, inCalculationResults.days);
            } else if ( (0 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_format, inCalculationResults.years);
            } else if ( (1 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_and_1_month_format, inCalculationResults.years);
            } else if ( (0 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_and_1_day_format, inCalculationResults.years);
            } else if ( 1 == inCalculationResults.months ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_1_month_and_days_format, inCalculationResults.years, inCalculationResults.days);
            } else if ( 1 == inCalculationResults.days ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_months_and_1_day_format, inCalculationResults.years, inCalculationResults.months);
            } else if ( (0 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_months_format, inCalculationResults.years, inCalculationResults.months);
            } else if ( (0 == inCalculationResults.months) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_and_days_format, inCalculationResults.years, inCalculationResults.days);
            } else {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_years_months_and_days_format, inCalculationResults.years, inCalculationResults.months, inCalculationResults.days);
            };
        } else {
            if ( (1 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                main_blurb = this.lang[this.lang_selector].result_1_month_and_1_day;
            } else if ( (1 == inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_1_month_days_format, inCalculationResults.days);
            } else if ( (1 < inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_months_and_days_format, inCalculationResults.months, inCalculationResults.days);
            } else if ( (1 < inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_months_and_1_day_format, inCalculationResults.months);
            } else if ( (1 < inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                main_blurb = this.sprintf(this.lang[this.lang_selector].result_months_format, inCalculationResults.months);
            };
        };
    };
    
    this.createResultsDiv(inCalculationResults.totalDays, days_blurb, main_blurb);
};

/***********************************************************************/
/*                              CALLBACKS                              */
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
    \brief  This actually performs the calculation. Called when the
            Calculate button is hit.
    
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
    
    owner.displayCalculationResults(difference);
};

/***********************************************************************/
/*                         DOM OBJECT CREATION                         */
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
    \brief  This creates the results div.
    
    \brief  inNumDays The total number of days (used to determine keytags).
    \brief  inDays The string to display the number of days.
    \brief  inMain The string to display the main blurb.
*/
NACC.prototype.createResultsDiv = function(inNumDays, inDays, inMain) {
    if ( this.m_calculation_results_div ) {
        this.m_calculation_results_div.innerHTML = '';
    } else {
        this.m_calculation_results_div = this.createDOMObject('div', 'NACC-Results', this.m_my_fieldset);
    };
    
    if ( this.m_calculation_results_div ) {
        this.createResultsTextDiv(inDays, inMain);
    };
};

/***********************************************************************/
/**
    \brief  This creates the results text div.
    
    \brief  inDays The string to display the number of days.
    \brief  inMain The string to display the main blurb.
*/
NACC.prototype.createResultsTextDiv = function(inDays, inMain) {
    if ( inDays ) {
        this.m_calculation_results_text_div = this.createDOMObject('div', 'NACC-Results-Text', this.m_calculation_results_div);
        
        if ( this.m_calculation_results_text_div ) {
            this.createResultsDays(inDays);
            this.createResultsMain(inMain);
        };
    };
};

/***********************************************************************/
/**
    \brief  This creates the first line of the results (days).
    
    \brief  inBlurb The string to display.
*/
NACC.prototype.createResultsDays = function(inBlurb) {
    if ( inBlurb ) {
        var newObject = this.createDOMObject('div', 'NACC-Days', this.m_calculation_results_text_div);
    
        if ( null != newObject ) {  
            newObject.innerHTML = inBlurb;
        };
    };
};

/***********************************************************************/
/**
    \brief  This creates the second line of the results (main blurb).
    
    \brief  inBlurb The string to display.
*/
NACC.prototype.createResultsMain = function(inBlurb) {
    if ( inBlurb ) {
        var newObject = this.createDOMObject('div', 'NACC-MainBlurb', this.m_calculation_results_text_div);
    
        if ( null != newObject ) {  
            newObject.innerHTML = inBlurb;
        };
    };
};

/********************************************************************************************
*###################################### THIRD-PARTY CODE ###################################*
********************************************************************************************/
/**
sprintf() for JavaScript 0.6

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Changelog:
2007.04.03 - 0.1:
 - initial release
2007.09.11 - 0.2:
 - feature: added argument swapping
2007.09.17 - 0.3:
 - bug fix: no longer throws exception on empty paramenters (Hans Pufal)
2007.10.21 - 0.4:
 - unit test and patch (David Baird)
2010.05.09 - 0.5:
 - bug fix: 0 is now preceeded with a + sign
 - bug fix: the sign was not at the right position on padded results (Kamal Abdali)
 - switched from GPL to BSD license
2010.05.22 - 0.6:
 - reverted to 0.4 and fixed the bug regarding the sign of the number 0
 Note:
 Thanks to Raphael Pigulla <raph (at] n3rd [dot) org> (http://www.n3rd.org/)
 who warned me about a bug in 0.5, I discovered that the last update was
 a regress. I appologize for that.
**/

NACC.prototype.sprintf = function () {
    function str_repeat(i, m) {
        for (var o = []; m > 0; o[--m] = i);
        return o.join('');
    };

    var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) {
            o.push(m[0]);
        }
        else if (m = /^\x25{2}/.exec(f)) {
            o.push('%');
        }
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                throw('Too few arguments.');
            };
            if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                throw('Expecting number but found ' + typeof(a));
            };
            switch (m[7]) {
                case 'b': a = a.toString(2); break;
                case 'c': a = String.fromCharCode(a); break;
                case 'd': a = parseInt(a,10); break;
                case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                case 'o': a = a.toString(8); break;
                case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                case 'u': a = Math.abs(a); break;
                case 'x': a = a.toString(16); break;
                case 'X': a = a.toString(16).toUpperCase(); break;
            };
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? this.str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        }
        else {
            throw('Huh ?!');
        };
        f = f.substring(m[0].length);
    };
    return o.join('');
};



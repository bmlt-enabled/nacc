/***************************************************************************/
/**
    The NA Cleatime Calculator (NACC)
    
    This is the second version of the NACC. It is designed to be a browser-based
    cleantime calculator (meaning it relies solely on HTML, JavaScript and CSS).
    
    NACC is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    NACC is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this code. If not, see <http://www.gnu.org/licenses/>.
*/

/********************************************************************************************
######################################### MAIN CONTEXT ######################################
********************************************************************************************/
/**
    \brief  This is the main class function for the NACC.
    
    \param  inContainerElementID    A DOM ID to the DOM element that will contain this instance. It will usually be an empty div element, but can be any block-level DOM element.
    \param  inStyle                 This is the style (leave blank/null for default gray. The "BT" style would be 'NA-BT', as that is the CSS name it has been given).
    \param  inLang                  A string, with the language selector (Example: 'en' -the default-, 'es' -Spanish-, etc.).
    \param  inTagLayout             The tag layout (either 'linear' or 'tabular' -default is 'linear')
    \param  inShowSpecialTags       If true, then the "specialty" (over 2 years) tags are displayed. Default is false.
    \param  inDirectoryRoot         This is a path (relative to the execution path) to the main directory. Leave as '' or null for standard implementations.
    \param  inYear                  An initial calculation year (integer -entire year, like '1953'). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
    \param  inMonth                 An initial calculation month (integer 1-12). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
    \param  inDay                   An initial calculation day (integer 1-31). If you want the instance to immediately appear with a calculation, then ALL 3 of these must be specified.
*/
function NACC(inContainerElementID, inStyle, inLang, inTagLayout, inShowSpecialTags, inDirectoryRoot, inYear, inMonth, inDay) {

    /********************************************************************************************
    ########################################## PROPERTIES #######################################
    ********************************************************************************************/
    /// This contains any GET parameters.
    var m_getParameters = null;
    /// This contains any directory offset (used when in plugin situations).
    var m_relative_directory_root = null;
    /// This is the style selector.
    var m_style_selector = null;
    /// This is the language selector.
    var m_lang_selector = null;
    /// This is an array, with all the language-specific strings.
    var m_lang = null;
    /// This specifies the keytag layout.
    var m_keytag_layout = null;
    /// This specifies whether the specialty keytags are displayed.
    var m_keytag_special = null;
    /// This is the object that "owns" this instance.
    var m_my_container = null;
    /// This is the form that contains the popups.
    var m_my_form = null;
    /// This is the prompt above the popups.
    var m_my_prompt = null;
    /// This is the fieldset that contains the popups and the results.
    var m_my_fieldset = null;
    /// This is the fieldset legend that contains the popups.
    var m_my_legend = null;
    /// This is the fieldset legend internal div that contains the popups.
    var m_my_legend_div = null;
    /// This is a div that will contain the popups.
    var m_popup_container = null;
    /// This is the month popup.
    var m_month_popup = null;
    /// This is the day of the month popup.
    var m_day_popup = null;
    /// This is the year popup.
    var m_year_popup = null;
    /// This is the calculate button.
    var m_calculate_button = null;
    /// This is the calculate results div.
    var m_calculation_results_div = null;
    /// This is the calculate results display toggle button.
    var m_calculation_results_display_toggle_button = null;
    /// This is the calculate results special tags display checkbox.
    var m_calculation_results_show_special_tags_checkbox = null;
    /// This is the label for the calculate results special tags display checkbox.
    var m_calculation_results_show_special_tags_checkbox_label = null;
    /// This is the calculate results text div.
    var m_calculation_results_text_div = null;
    /// This is the calculate results keytags div.
    var m_calculation_results_keytags_div = null;
    
        /************************************/
        /*           LOCALIZATION           */
        /************************************/
    this.m_lang = Array();
    
    // Make sure that we have a valid container element.
    if ( inContainerElementID && document.getElementById(inContainerElementID) ) {
        /************************************/
        /*             ENGLISH              */
        /************************************/
        /** We need to instantiate an object for each language. The key needs to be the language selector. */
        this.m_lang['en'] = new Object();
    
        /* The following are strings to be assigned to each language. */
    
        /** This is the header, at the top. */
        this.m_lang['en'].section_title                         = 'NA Cleantime Calculator';
        /** This is the prompt over the popup menus. */
        this.m_lang['en'].prompt                                = 'Please enter your Clean Date';
        /** This is the text for the calculate button. */
        this.m_lang['en'].calculate_button_text                 = 'Calculate';
        /** This is the text for the change layout button. */
        this.m_lang['en'].change_layout_button_text             = 'Change Tag Layout';
        /** This is the text for the show special tags checkbox. */
        this.m_lang['en'].change_use_special_tags_label         = 'Show Special Tags';
        /** These are the months, spelled out. */
        this.m_lang['en'].months                                = Array(
                                                                        "ERROR",
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
        this.m_lang['en'].result_invalid                        = 'Please select a valid clean date!';
    
        this.m_lang['en'].result_1_day                          = 'You have been clean for 1 day!';
        this.m_lang['en'].result_days_format                    = 'You have been clean for %d days!';

        /** These are for the second (months, years and days) blurb. */
        this.m_lang['en'].result_months_format                  = 'This is %d months.';
        this.m_lang['en'].result_months_and_1_day_format        = 'This is %d months and 1 day.';
        this.m_lang['en'].result_months_and_days_format         = 'This is %d months and %d days.';
        this.m_lang['en'].result_1_year                         = 'This is 1 year.';
        this.m_lang['en'].result_1_year_and_1_day               = 'This is 1 year and 1 day.';
        this.m_lang['en'].result_1_year_and_1_month             = 'This is 1 year and 1 month.';
        this.m_lang['en'].result_1_year_1_month_and_1_day       = 'This is 1 year, 1 month and 1 day.';
        this.m_lang['en'].result_1_year_months_and_1_day_format = 'This is 1 year, %d months and 1 day.';
        this.m_lang['en'].result_1_year_months_and_days_format  = 'This is 1 year, %d months and %d days.';
        this.m_lang['en'].result_1_year_days_format             = 'This is 1 year and %d days.';
        this.m_lang['en'].result_years_format                   = 'This is %d years.';
        this.m_lang['en'].result_years_months_format            = 'This is %d years and %d months.';
        this.m_lang['en'].result_years_1_month_and_1_day_format = 'This is %d years, 1 month and 1 day.';
        this.m_lang['en'].result_years_months_and_1_day_format  = 'This is %d years, %d months and 1 day.';
        this.m_lang['en'].result_years_and_1_month_format       = 'This is %d years and 1 month.';
        this.m_lang['en'].result_years_and_1_day_format         = 'This is %d years and 1 day.';
        this.m_lang['en'].result_years_and_days_format          = 'This is %d years and %d days.';
        this.m_lang['en'].result_years_1_month_and_days_format  = 'This is %d years, 1 month and %d days.';
        this.m_lang['en'].result_years_months_and_days_format   = 'This is %d years, %d months and %d days.';
   
        /************************************/
        /*             SPANISH              */
        /************************************/
        this.m_lang['es'] = new Object();
    
        /* The following are strings to be assigned to each language. */
    
        /** This is the header, at the top. */
        this.m_lang['es'].section_title                         = 'Calculadora de Tiempo Limpio NA';
        /** This is the prompt over the popup menus. */
        this.m_lang['es'].prompt                                = 'Por favor, entra tu fecha de inicio.';
        /** This is the text for the calculate button. */
        this.m_lang['es'].calculate_button_text                 = 'Calcular';
        /** This is the text for the change layout button. */
        this.m_lang['es'].change_layout_button_text             = 'Cambiar los llaveros de posición.';
        /** This is the text for the show special tags checkbox. */
        this.m_lang['es'].change_use_special_tags_label         = 'Mostrar Llaveros Especiales.';
        /** These are the months, spelled out. */
        this.m_lang['es'].months                                = Array(
                                                                        "ERROR",
                                                                        "Enero",
                                                                        "Febrero",
                                                                        "Marzo",
                                                                        "Abril",
                                                                        "Mayo",
                                                                        "Junio",
                                                                        "Julio",
                                                                        "Agosto",
                                                                        "Septiembre",
                                                                        "Octubre",
                                                                        "Noviembre",
                                                                        "Diciembre"
                                                                        );
        this.m_lang['es'].result_invalid                        = '¡Por favor, entra una fecha de inicio válido!';
    
        this.m_lang['es'].result_1_day                          = '¡Has estado limpio por 1 día!';
        this.m_lang['es'].result_days_format                    = '¡Has estado limpio por %d días!';

        /** These are for the second (months, years and days) blurb. */
        this.m_lang['es'].result_months_format                  = 'Esto suma un total de %d meses.';
        this.m_lang['es'].result_months_and_1_day_format        = 'Esto suma un total de %d meses y un día.';
        this.m_lang['es'].result_months_and_days_format         = 'Esto suma un total de %d meses y %d días.';
        this.m_lang['es'].result_1_year                         = 'Esto suma un total de 1 año.';
        this.m_lang['es'].result_1_year_and_1_day               = 'Esto suma un total de 1 año y 1 día.';
        this.m_lang['es'].result_1_year_and_1_month             = 'Esto suma un total de 1 año y 1 mes.';
        this.m_lang['es'].result_1_year_1_month_and_1_day       = 'Esto suma un total de 1 año, 1 mes y 1 día.';
        this.m_lang['es'].result_1_year_months_and_1_day_format = 'Esto suma un total de 1 año, %d meses y 1 día.';
        this.m_lang['es'].result_1_year_months_and_days_format  = 'Esto suma un total de 1 año, %d meses y %d días.';
        this.m_lang['es'].result_1_year_days_format             = 'Esto suma un total de 1 año y %d días.';
        this.m_lang['es'].result_years_format                   = 'Esto suma un total de %d años.';
        this.m_lang['es'].result_years_months_format            = 'Esto suma un total de %d años y %d meses.';
        this.m_lang['es'].result_years_1_month_and_1_day_format = 'Esto suma un total de %d años, 1 mes y 1 día.';
        this.m_lang['es'].result_years_months_and_1_day_format  = 'Esto suma un total de %d años, %d meses y 1 día.';
        this.m_lang['es'].result_years_and_1_month_format       = 'Esto suma un total de %d años y 1 mes.';
        this.m_lang['es'].result_years_and_1_day_format         = 'Esto suma un total de %d años y 1 día.';
        this.m_lang['es'].result_years_and_days_format          = 'Esto suma un total de %d años y %d días.';
        this.m_lang['es'].result_years_1_month_and_days_format  = 'Esto suma un total de %d años, 1 mes y %d días.';
        this.m_lang['es'].result_years_months_and_days_format   = 'Esto suma un total de %d años, %d meses y %d días.';
   
        /************************************/
        /*       SIMPLIFIED CHINESE         */
        /************************************/
        this.m_lang['zh-Hans'] = new Object();
    
        /* The following are strings to be assigned to each language. */
    
        /** This is the header, at the top. */
        this.m_lang['zh-Hans'].section_title                            = 'NA 清醒时间计算器';
        /** This is the prompt over the popup menus. */
        this.m_lang['zh-Hans'].prompt                                   = '请输入您的清醒日期';  
        /** This is the text for the calculate button. */
        this.m_lang['zh-Hans'].calculate_button_text                    = '计算'; 
        /** This is the text for the change layout button. */
        this.m_lang['zh-Hans'].change_layout_button_text                = '更改钥匙扣设置';
        /** This is the text for the show special tags checkbox. */
        this.m_lang['zh-Hans'].change_use_special_tags_label            = '显示特殊钥匙扣';
        /** These are the months, spelled out. */
        this.m_lang['zh-Hans'].months                                   = Array(
                                                                                "错误",
                                                                                "1月",
                                                                                "2月",
                                                                                "3月",
                                                                                "4月",
                                                                                "5月",
                                                                                "6月",
                                                                                "7月",
                                                                                "8月",
                                                                                "9月",
                                                                                "10月",
                                                                                "11月",
                                                                                "12月"
                                                                                );
        this.m_lang['zh-Hans'].result_invalid                           = '请选择一个有效的清醒日期';
    
        this.m_lang['zh-Hans'].result_1_day                             = '您已经清醒一天了!';
        this.m_lang['zh-Hans'].result_days_format                       = '您已经清醒%d天了! ';

        /** These are for the second (months, years and days) blurb. */
        this.m_lang['zh-Hans'].result_months_format                     = '这是%d个月了';
        this.m_lang['zh-Hans'].result_months_and_1_day_format           = '这是%d个月零一天了.';
        this.m_lang['zh-Hans'].result_months_and_days_format            = '这是%d个月%d天了.';
        this.m_lang['zh-Hans'].result_1_year                            = '这是一年了.';
        this.m_lang['zh-Hans'].result_1_year_and_1_day                  = '这是一年零一天了.';
        this.m_lang['zh-Hans'].result_1_year_and_1_month                = '这是一年一个月了. ';
        this.m_lang['zh-Hans'].result_1_year_1_month_and_1_day          = '这是一年一个月零一天了. ';
        this.m_lang['zh-Hans'].result_1_year_months_and_1_day_format    = '这是一年，%d个月零一天了.';
        this.m_lang['zh-Hans'].result_1_year_days_format                = '这是一年，%d天了. ';
        this.m_lang['zh-Hans'].result_years_format                      = '这是%d年了. ';
        this.m_lang['zh-Hans'].result_years_months_format               =  '这是%d年%d月了. ';
        this.m_lang['zh-Hans'].result_years_1_month_and_1_day_format    = '这是%d年，一个月零一天了.';
        this.m_lang['zh-Hans'].result_years_months_and_1_day_format     = '这是%d年，%d月零一天了.';  
        this.m_lang['zh-Hans'].result_years_and_1_month_format          = '这是%d年一个月了. ';
        this.m_lang['zh-Hans'].result_years_and_1_day_format            = '这是%d年零一天了. ';
        this.m_lang['zh-Hans'].result_years_and_days_format             = '这是%d年%d天了.';  
        this.m_lang['zh-Hans'].result_years_1_month_and_days_format     = '这是%d年，一个月%d天了.';  
        this.m_lang['zh-Hans'].result_years_months_and_days_format      = '这是%d个年，%d个月，%d天了.';  
   
        /************************************/
        /*       TRADITIONAL CHINESE        */
        /************************************/
        this.m_lang['zh-Hant'] = new Object();
    
        /* The following are strings to be assigned to each language. */
    
        /** This is the header, at the top. */
        this.m_lang['zh-Hant'].section_title                            = 'NA 清醒時間計算器'; 
        /** This is the prompt over the popup menus. */
        this.m_lang['zh-Hant'].prompt                                   = '請輸入您的清醒日期';
        /** This is the text for the calculate button. */
        this.m_lang['zh-Hant'].calculate_button_text                    = '計算';
        /** This is the text for the change layout button. */
        this.m_lang['zh-Hant'].change_layout_button_text                = '更改鑰匙扣設置';
        /** This is the text for the show special tags checkbox. */
        this.m_lang['zh-Hant'].change_use_special_tags_label            =  '顯示特殊鑰匙扣';
        /** These are the months, spelled out. */
        this.m_lang['zh-Hant'].months                                   = Array(
                                                                                "錯誤",
                                                                                "1月",
                                                                                "2月",
                                                                                "3月",
                                                                                "4月",
                                                                                "5月",
                                                                                "6月",
                                                                                "7月",
                                                                                "8月",
                                                                                "9月",
                                                                                "10月",
                                                                                "11月",
                                                                                "12月"
                                                                                );
        this.m_lang['zh-Hant'].result_invalid                           = '請選擇一個有效的清醒日期';
    
        this.m_lang['zh-Hant'].result_1_day                             = '您已經清醒一天了!';
        this.m_lang['zh-Hant'].result_days_format                       = '您已经清醒%d天了! ';

        /** These are for the second (months, years and days) blurb. */
        this.m_lang['zh-Hant'].result_months_format                     = '這是%d個月了';
        this.m_lang['zh-Hant'].result_months_and_1_day_format           = '這是%d個月零一天了.';
        this.m_lang['zh-Hant'].result_months_and_days_format            = '這是%d個月%d天了.';
        this.m_lang['zh-Hant'].result_1_year                            = '這是一年了.';
        this.m_lang['zh-Hant'].result_1_year_and_1_day                  = '這是一年零一天了.';
        this.m_lang['zh-Hant'].result_1_year_and_1_month                = '這是一年一個月了. ';
        this.m_lang['zh-Hant'].result_1_year_1_month_and_1_day          = '這是一年一個月零一天了. ';
        this.m_lang['zh-Hant'].result_1_year_months_and_1_day_format    = '這是一年，%d個月零一天了.';
        this.m_lang['zh-Hant'].result_1_year_days_format                = '這是一年，%d天了. ';
        this.m_lang['zh-Hant'].result_years_format                      = '這是%d年了. ';
        this.m_lang['zh-Hant'].result_years_months_format               = '這是%d年%d月了. ';
        this.m_lang['zh-Hant'].result_years_1_month_and_1_day_format    = '這是%d年，一個月零一天了.';
        this.m_lang['zh-Hant'].result_years_months_and_1_day_format     = '這是%d年，%d月零一天了.';
        this.m_lang['zh-Hant'].result_years_and_1_month_format          = '這是%d年一個月了. ';
        this.m_lang['zh-Hant'].result_years_and_1_day_format            = '這是%d年零一天了. ';
        this.m_lang['zh-Hant'].result_years_and_days_format             = '這是%d年%d天了.';
        this.m_lang['zh-Hant'].result_years_1_month_and_days_format     = '這是%d年，一個月%d天了.';
        this.m_lang['zh-Hant'].result_years_months_and_days_format      = '這是%d個年，%d個月，%d天了.'; 

        /************************************/
        /*             ITALIAN              */
        /************************************/
         /** This is the header, at the top. */
        this.m_lang['it'].section_title                         = 'NA Tempo di Pulizia';
        /** This is the prompt over the popup menus. */
        this.m_lang['it'].prompt                                = 'Inserisci la tua data di pulizia';
        /** This is the text for the calculate button. */
        this.m_lang['it'].calculate_button_text                 = 'Calcola';
        /** This is the text for the change layout button. */
        this.m_lang['it'].change_layout_button_text             = 'Cambia presentazione dei portachiavi';
        /** This is the text for the show special tags checkbox. */
        this.m_lang['it'].change_use_special_tags_label         = 'Mostra Tag Speciali';
        /** These are the months, spelled out. */
        this.m_lang['it'].months                                = Array(
                                                                        "ERRORE",
                                                                        "gennaio",
                                                                        "febbraio",
                                                                        "marzo",
                                                                        "aprile",
                                                                        "maggio",
                                                                        "giugno",
                                                                        "luglio",
                                                                        "agosto",
                                                                        "settembre",
                                                                        "ottobre",
                                                                        "novembre",
                                                                        "dicembre"
                                                                        );
        /** These are for the top (days) blurb. */
        this.m_lang['it'].result_invalid                        = 'Si prega di selezionare una data pulita valida!';
    
        this.m_lang['it'].result_1_day                          = 'Sei stato pulito per 1 giorno!';
        this.m_lang['it'].result_days_format                    = 'Ei stato pulito per %d giorni!';

        /** These are for the second (months, years and days) blurb. */
        this.m_lang['it'].result_months_format                  = 'Questo è di %d mesi.';
        this.m_lang['it'].result_months_and_1_day_format        = 'Questo è di %d mesi e 1 giorno.';
        this.m_lang['it'].result_months_and_days_format         = 'Questo è di %d mesi e %d giorni.';
        this.m_lang['it'].result_1_year                         = 'Questo è di 1 anno.';
        this.m_lang['it'].result_1_year_and_1_day               = 'Questo è di 1 anno e 1 giorno.';
        this.m_lang['it'].result_1_year_and_1_month             = 'Questo è di 1 anno e 1 mese.';
        this.m_lang['it'].result_1_year_1_month_and_1_day       = 'Questo è di 1 anno, 1 mese e 1 giorno.';
        this.m_lang['it'].result_1_year_months_and_1_day_format = 'Questo è di 1 anno, %d mesi e 1 giorno.';
        this.m_lang['it'].result_1_year_months_and_days_format  = 'Questo è di 1 anno, %d mesi e %d giorni.';
        this.m_lang['it'].result_1_year_days_format             = 'Questo è di 1 year e %d giorni.';
        this.m_lang['it'].result_years_format                   = 'Questo è di %d anni.';
        this.m_lang['it'].result_years_months_format            = 'Questo è di %d anni e %d mesi.';
        this.m_lang['it'].result_years_1_month_and_1_day_format = 'Questo è di %d anni, 1 mese e 1 giorno.';
        this.m_lang['it'].result_years_months_and_1_day_format  = 'Questo è di %d anni, %d mesi e 1 giorno.';
        this.m_lang['it'].result_years_and_1_month_format       = 'Questo è di %d anni e 1 mese.';
        this.m_lang['it'].result_years_and_1_day_format         = 'Questo è di %d anni e 1 giorno.';
        this.m_lang['it'].result_years_and_days_format          = 'Questo è di %d anni e %d giorni.';
        this.m_lang['it'].result_years_1_month_and_days_format  = 'Questo è di %d anni, 1 mese e %d giorni.';
        this.m_lang['it'].result_years_months_and_days_format   = 'Questo è di %d anni, %d mesi e %d giorni.';
        /************************************/
        /*            MAIN CODE             */
        /************************************/
    
        // First, see if we have any GET parameters supplied.
        // GET parameters trump arguments passed in, and arguments trump defaults.
        this.m_getParameters = this.getParameters();
    
        // See if a root directory was specified.
        if ( this.m_getParameters['NACC-dir-root'] ) {
            this.m_relative_directory_root = this.m_getParameters['NACC-dir-root'] + (!this.m_getParameters['NACC-dir-root'].toString().match(/\/$/) ? '/' : '');
        } else {
            if ( inDirectoryRoot ) {
                this.m_relative_directory_root = inDirectoryRoot + (!inDirectoryRoot.toString().match(/\/$/) ? '/' : '');
            } else {
                this.m_relative_directory_root = '';
            };
        };

        // See if a style was specified.
        if ( this.m_getParameters['NACC-style'] ) {
            this.m_style_selector = this.m_getParameters['NACC-style'];
        } else {
            if ( inStyle ) {
                this.m_style_selector = inStyle;
            } else {
                this.m_style_selector = null;
            };
        };

        // See if a language was specified.
        if ( this.m_getParameters['NACC-lang'] ) {
            this.m_lang_selector = this.m_getParameters['NACC-lang'];
        } else {
            if ( inLang ) {
                this.m_lang_selector = inLang;
            } else {
                this.m_lang_selector = 'en';
            };
        };
    
        // See if an initial tag layout was specified.
        if ( this.m_getParameters['NACC-tag-layout'] ) {
            this.m_keytag_layout = this.m_getParameters['NACC-tag-layout'];
        } else {
            if ( inTagLayout ) {
                this.m_keytag_layout = inTagLayout;
            } else {
                this.m_keytag_layout = 'linear';
            };
        };
    
        // See if we want to initially display the "specialty" tags.
        if ( this.m_getParameters['NACC-special-tags'] ) {
            this.m_keytag_special = true;
        } else {
            this.m_keytag_special = inShowSpecialTags ? true : false;
        };
    
        // The first thing that we do, is reference the container element.
        this.m_my_container = document.getElementById(inContainerElementID);
    
        // Link this NACC instance with the container element.
        this.m_my_container.nacc_instance = this;
    
        // Make sure the container is tagged with the NACC-Instance class.
        if ( this.m_my_container.className ) {
            this.m_my_container.className += ' NACC-Instance';   // Appending to any existing class.
        } else {
            this.m_my_container.className = 'NACC-Instance';     // From scratch.
        };
    
        // If a style was specified, we add that, as well.
        if ( this.m_style_selector ) {
            this.m_my_container.className += ' ' + this.m_style_selector;
        };
    
        // Clear the decks for action, matey!
        this.m_my_container.innerHTML = '';
    
        // This is where we actually create everything.
        this.createHeader();
        this.createForm();
    
        // This is a function that makes sure that the days of the month popup menu is valid.
        this.evaluateMonthDays();
    
        // See if a date was supplied. If so, we immediately calculate.
        var year = parseInt(this.m_getParameters['NACC-year']);
        var month = parseInt(this.m_getParameters['NACC-month']);
        var day = parseInt(this.m_getParameters['NACC-day']);
    
        // Look for any passed-in parameters.
        if ( !year ) {
            year = parseInt(inYear);
        };
    
        if ( !month ) {
            month = parseInt(inMonth);
        };
    
        if ( !day ) {
            year = parseInt(inDay);
        };
    
        // We have to have all 3 to do an immediate calculation.
        if ( year && month && day ) {
            // Set up the popups to reflect the given date.
            this.m_month_popup.selectedIndex = month - 1;

            for ( var i = 0; i < this.m_year_popup.options.length; i++ ) {
                if ( parseInt(this.m_year_popup.options[i].value) == parseInt(year) ) {
                    this.m_year_popup.selectedIndex = i;
                    break;
                };
            };

            this.m_day_popup.selectedIndex = day - 1;
        
            // Make sure we're kosher.
            this.evaluateMonthDays();
        
            // Just run a calculation, as if the button were hit. The form will be evaluated.
            this.calculateCleantime(this.m_calculate_button);
        };
    } else {
        // Let folks know they borked it.
        alert('NACC ERROR: INVALID CONTAINER ELEMENT ID');
    };
};

/********************************************************************************************
################################### INTERNAL UTILITY METHODS ################################
********************************************************************************************/
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
        days_blurb = this.m_lang[this.m_lang_selector].result_1_day;
    } else {
        days_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_days_format, inCalculationResults.totalDays);
    };
    
    var main_blurb = '';
    
    // We select the appropriate format to display the result, based on how many day, months and years are in the result.
    // We count days until 90, then months and years.
    if ( 0 < inCalculationResults.totalDays ) {
        if ( 90 < inCalculationResults.totalDays ) {    // Have to have more than 90 days to start counting months, years and days.
            if ( 0 < inCalculationResults.years ) {
                if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                    main_blurb = this.m_lang[this.m_lang_selector].result_1_year;
                } else if ( (1 == inCalculationResults.years) && (1 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                    main_blurb = this.m_lang[this.m_lang_selector].result_1_year_and_1_month;
                } else if ( (1 == inCalculationResults.years) && (1 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                    main_blurb = this.m_lang[this.m_lang_selector].result_1_year_1_month_and_1_day;
                } else if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                    main_blurb = this.m_lang[this.m_lang_selector].result_1_year_and_1_day;
                } else if ( (1 == inCalculationResults.years) && (0 == inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_1_year_days_format, inCalculationResults.days);
                } else if ( (1 == inCalculationResults.years) && (1 < inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_1_year_months_and_days_format, inCalculationResults.months, inCalculationResults.days);
                } else if ( (0 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_format, inCalculationResults.years);
                } else if ( (1 == inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_and_1_month_format, inCalculationResults.years);
                } else if ( (0 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_and_1_day_format, inCalculationResults.years);
                } else if ( 1 == inCalculationResults.months ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_1_month_and_days_format, inCalculationResults.years, inCalculationResults.days);
                } else if ( 1 == inCalculationResults.days ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_months_and_1_day_format, inCalculationResults.years, inCalculationResults.months);
                } else if ( (0 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_months_format, inCalculationResults.years, inCalculationResults.months);
                } else if ( (0 == inCalculationResults.months) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_and_days_format, inCalculationResults.years, inCalculationResults.days);
                } else {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_years_months_and_days_format, inCalculationResults.years, inCalculationResults.months, inCalculationResults.days);
                };
            } else {    // If we have less than a year, we have fewer choices.
                if ( (1 == inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                    main_blurb = this.m_lang[this.m_lang_selector].result_1_month_and_1_day;
                } else if ( (1 == inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_1_month_days_format, inCalculationResults.days);
                } else if ( (1 < inCalculationResults.months) && (1 < inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_months_and_days_format, inCalculationResults.months, inCalculationResults.days);
                } else if ( (1 < inCalculationResults.months) && (1 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_months_and_1_day_format, inCalculationResults.months);
                } else if ( (1 < inCalculationResults.months) && (0 == inCalculationResults.days) ) {
                    main_blurb = this.sprintf(this.m_lang[this.m_lang_selector].result_months_format, inCalculationResults.months);
                };
            };
        };
    } else {
        days_blurb = this.m_lang[this.m_lang_selector].result_invalid;
    };
    
    var months = (inCalculationResults.years * 12) + inCalculationResults.months;
    this.createResultsDiv(inCalculationResults.totalDays, months, days_blurb, main_blurb);
};

/********************************************************************************************
####################################### CALLBACK METHODS ####################################
********************************************************************************************/
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
    \brief  This is called when the Calculate button is hit.
    
    \param  inObject This is the button object. We use it to get our main instance.
*/
NACC.prototype.calculateCleantime = function(inObject) {
    var owner = inObject.owner;
    var year = parseInt(owner.m_year_popup.value);
    var month = parseInt(owner.m_month_popup.value) - 1;
    var day = parseInt(owner.m_day_popup.value);
    
    // If this was triggered by the rearrange layout button, we toggle the layout.
    if ( inObject == owner.m_calculation_results_display_toggle_button ) {
        owner.m_keytag_layout = (owner.m_keytag_layout == 'linear') ? 'tabular' : 'linear';
    };
    
    // If it was triggered by the checkbox, then we togle the special tags state.
    if ( inObject == owner.m_calculation_results_show_special_tags_checkbox ) {
        owner.m_keytag_special = !owner.m_keytag_special;
    };
    
    owner.calculate(year, month, day);
};

/***********************************************************************/
/**
    \brief  This actually performs the calculation. Called when the
            Calculate button is hit.
    
    \param  inYear This is the year for the date.
    \param  inMonth This is the year for the date (0-based).
    \param  inDay This is the year for the date.
*/
NACC.prototype.calculate = function(inYear, inMonth, inDay) {
    this.displayCalculationResults(this.dateSpan(new Date(inYear, inMonth, inDay, 0, 0, 0, 0)));
};

/********************************************************************************************
################################### DOM OBJECT INSTANTIATION ################################
********************************************************************************************/
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
    \brief  This creates and returns one keytag object, as an img.
    
    \brief inTag The name of the tag to be created.
    \param  isClosed if true, then the top of the ring will be closed.
    
    \returns an img object.
*/
NACC.prototype.createOneKeytag = function(inTag, isClosed) {    
    var tagSrc = this.m_relative_directory_root + 'images/' + this.m_lang_selector + '/' + inTag + '.png';
    return this.createKeytag(tagSrc, isClosed);
};

/***********************************************************************/
/**
    \brief  This creates and returns one keytag object, as an img.
    
    \param  inSrc The path to the source image.
    \param  isClosed if true, then the top of the ring will be closed.
    
    \returns an img object.
*/
NACC.prototype.createKeytag = function(inSrc, isClosed) {
    // We use CSS to create the closure at the top.
    var className = 'NACC-Keytag' + ((isClosed || (this.m_keytag_layout != 'linear')) ? ' NACC-Keytag-Ringtop' : '');
    var imgObject = this.createDOMObject('img', className, this.m_calculation_results_keytags_div);

    if ( null != imgObject ) {
        imgObject.src = inSrc;
    };
    
    return imgObject;
};

/***********************************************************************/
/**
    \brief  This creates and returns one white keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createWhiteKeytag = function(inFace) {
    // White keytag will always be closed.
    var ret = this.createOneKeytag('01' + (inFace ? '_Front' : ''), true);
    
    if ( null != ret ) {
        ret.className += ' NACC-White-Tag';
    };
    
    return ret;
};

/***********************************************************************/
/**
    \brief  This creates and returns one orange keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createOrangeKeytag = function(inFace) {
    return this.createOneKeytag('02' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one green keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createGreenKeytag = function(inFace) {
    return this.createOneKeytag('03' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one red keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createRedKeytag = function(inFace) {
    return this.createOneKeytag('04' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one blue keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createBlueKeytag = function(inFace) {
    return this.createOneKeytag('05' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one yellow keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createYellowKeytag = function(inFace) {
    return this.createOneKeytag('06' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one year keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createYearKeytag = function(inFace) {
    return this.createOneKeytag('07' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one gray keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createGrayKeytag = function(inFace) {
    return this.createOneKeytag('08' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one black keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createBlackKeytag = function(inFace) {
    return this.createOneKeytag('09' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one granite keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createDecadeKeytag = function(inFace) {
    return this.createOneKeytag('10' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one decades keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.createDecadesKeytag = function(inFace) {
    return this.createOneKeytag('11' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one 25-year keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.create25YearKeytag = function(inFace) {
    return this.createOneKeytag('12' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one 10,000 day keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.create10KKeytag = function(inFace) {
    return this.createOneKeytag('13' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one 30-year keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.create30YearKeytag = function(inFace) {
    return this.createOneKeytag('14' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one 10,000 day keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.create05Keytag = function(inFace) {
    return this.createOneKeytag('15' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates and returns one 10,000 day keytag object, as an img.
    
    \param  inFace If this will be the logo side, this should be true.
    
    \returns an img object.
*/
NACC.prototype.create15Keytag = function(inFace) {
    return this.createOneKeytag('16' + (inFace ? '_Front' : ''), !inFace);
};

/***********************************************************************/
/**
    \brief  This creates the header at the top of the div.
*/
NACC.prototype.createHeader = function() {
    var newObject = this.createDOMObject('div', 'NACC-Header', this.m_my_container);
    
    if ( null != newObject ) {  
        newObject.innerHTML = this.m_lang[this.m_lang_selector].section_title;
    };
};

/***********************************************************************/
/**
    \brief  This creates the form that wraps the fieldset.
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
        this.m_my_legend_div = this.createDOMObject('legend', 'NACC-Legend-div', this.m_my_legend);
        if ( null != this.m_my_legend ) {
            this.createPrompt();
            this.createPopupContainer();
        };
    };
};

/***********************************************************************/
/**
    \brief  This creates the prompt above the popups.
*/
NACC.prototype.createPrompt = function() {
    this.m_my_prompt = this.createDOMObject('label', 'NACC-Prompt-Label', this.m_my_legend_div);
    
    if ( null != this.m_my_prompt ) {  
        this.m_my_prompt.innerHTML = this.m_lang[this.m_lang_selector].prompt;
    };
};

/***********************************************************************/
/**
    \brief  This creates the popup container and the popups.
*/
NACC.prototype.createPopupContainer = function() {
    this.m_popup_container = this.createDOMObject('div', 'NACC-Popups', this.m_my_legend_div);
    
    if ( null != this.m_popup_container ) {
        this.createMonthPopup();
        this.createDayPopup();
        this.createYearPopup();
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
            var selectedMonth = this.m_lang[this.m_lang_selector].months[i];
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
        this.m_calculate_button.value = this.m_lang[this.m_lang_selector].calculate_button_text;
        this.m_calculate_button.owner = this;
        this.m_calculate_button.onclick = function(){NACC.prototype.calculateCleantime(this)};
    };
};

/***********************************************************************/
/**
    \brief  This creates the results div.
    
    \brief  inNumDays The total number of days (used to determine keytags).
    \brief  inMonths The number of months.
    \brief  inDays The string to display the number of days.
    \brief  inMain The string to display the main blurb.
*/
NACC.prototype.createResultsDiv = function(inNumDays, inMonths, inDays, inMain) {
    if ( this.m_calculation_results_div ) {
        this.m_calculation_results_div.innerHTML = '';
        this.m_calculation_results_text_div = null;
        this.m_calculation_results_keytags_div = null;
    } else {
        this.m_calculation_results_div = this.createDOMObject('div', 'NACC-Results', this.m_my_fieldset);
    };
    
    if ( this.m_calculation_results_div ) {
        this.createResultsTextDiv(inDays, inMain);
        this.createTagsDiv(inNumDays, inMonths);
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

/***********************************************************************/
/**
    \brief  This creates the tags div.
    
    \param  inNumDays The total number of days (used to determine keytags).
    \param  inMonths The total number of months (used to determine keytags).
*/
NACC.prototype.createTagsDiv = function(inNumDays, inMonths) {
    if ( 0 < inNumDays ) {
        if ( this.m_calculation_results_keytags_div ) {
            while ( this.m_calculation_results_keytags_div.hasChildNodes() ) {   
                this.m_calculation_results_keytags_div.removeChild(this.m_calculation_results_keytags_div.firstChild);
            };
        } else {
            this.m_calculation_results_keytags_div = this.createDOMObject('div', 'NACC-Keytags' + ((this.m_keytag_layout != 'linear') ? ' NACC-Keytag-Tabular' : ''), this.m_calculation_results_div);
        };
        
        if ( this.m_calculation_results_keytags_div ) {
            this.createTagsArray(inNumDays, inMonths);
        };
    };
};

/***********************************************************************/
/**
    \brief  This creates the tags images.
    
    \param  inNumDays The total number of days (used to determine keytags).
    \param  inMonths The total number of months (used to determine keytags).
*/
NACC.prototype.createTagsArray = function(inNumDays, inMonths) {
    var isFace = this.m_keytag_layout == 'linear';
    
    if ( 0 < inNumDays ) {
        this.createWhiteKeytag(isFace);
    };
    
    if ( 29 < inNumDays ) {
        this.createOrangeKeytag(isFace);
    };
    
    if ( 59 < inNumDays ) {
        this.createGreenKeytag(isFace);
    };
    
    if ( 89 < inNumDays ) {
        this.createRedKeytag(isFace);
    };
    
    if ( 90 < inNumDays ) {
        if ( 5 < inMonths ) {
            this.createBlueKeytag(isFace);
        };
        
        if ( 8 < inMonths ) {
            this.createYellowKeytag(isFace);
        };
        
        if ( 11 < inMonths ) {
            this.createYearKeytag(isFace);
        };
        
        if ( 17 < inMonths ) {
            this.createGrayKeytag(isFace);
        };
        
        if ( 23 < inMonths ) {
            this.createBlackKeytag(isFace);
        };
        
        for ( var i = 24; i <= (inMonths - 12); i += 12 ) {
            var comp = i + 12;
            var specialTag = false;
            
            if ( this.m_keytag_special ) {
                if ( comp == 60 ) {
                    specialTag = true;
                    this.create05Keytag(isFace);
                };
                
                if ( comp == 120 ) {
                    specialTag = true;
                    this.createDecadeKeytag(isFace);
                };
                
                if ( comp == 180 ) {
                    specialTag = true;
                    this.create15Keytag(isFace);
                };
                
                if ( !specialTag && (comp == 300) ) {
                    specialTag = true;
                    this.create25YearKeytag(isFace);
                };
                
                if ( !specialTag && (comp == 360) ) {
                    specialTag = true;
                    this.create30YearKeytag(isFace);
                };
                
                if ( !specialTag && (0 == (comp % 120)) ) {
                    specialTag = true;
                    this.createDecadesKeytag(isFace);
                };
            };
            
            if ( !specialTag ) {
                this.createBlackKeytag(isFace);
            };
            
            if ( this.m_keytag_special && (comp == 324) && (9999 < inNumDays) ) {
                this.create10KKeytag(isFace);
            };
        };
    };
    
    this.createRearrangeButton();
};

/***********************************************************************/
/**
    \brief  This creates the change layout button.
*/
NACC.prototype.createRearrangeButton = function() {
    if ( null != this.m_calculation_results_display_toggle_button ) {
        this.m_calculation_results_display_toggle_button.parentNode.removeChild(this.m_calculation_results_display_toggle_button);
    };
    
    this.m_calculation_results_display_toggle_button = this.createDOMObject('input', 'NACC-Change-Layout-Button', this.m_popup_container);
    
    if ( null != this.m_calculation_results_display_toggle_button ) {
        this.m_calculation_results_display_toggle_button.setAttribute('type', 'button');
        this.m_calculation_results_display_toggle_button.value = this.m_lang[this.m_lang_selector].change_layout_button_text;
        this.m_calculation_results_display_toggle_button.owner = this;
        this.m_calculation_results_display_toggle_button.onclick = function(){NACC.prototype.calculateCleantime(this)};
        this.createSpecialTagsCheckbox();
    };
};

/***********************************************************************/
/**
    \brief  This creates the show special tags checkbox.
*/
NACC.prototype.createSpecialTagsCheckbox = function() {
    if ( null != this.m_calculation_results_show_special_tags_checkbox ) {
        this.m_calculation_results_show_special_tags_checkbox.parentNode.removeChild(this.m_calculation_results_show_special_tags_checkbox);
    };
    
    this.m_calculation_results_show_special_tags_checkbox = this.createDOMObject('input', 'NACC-Show-Special-Tags-Checkbox', this.m_popup_container);
    
    if ( null != this.m_calculation_results_show_special_tags_checkbox ) {
        this.m_calculation_results_show_special_tags_checkbox.setAttribute('type', 'checkbox');
        this.m_calculation_results_show_special_tags_checkbox.checked = this.m_keytag_special ? true : false;
        this.m_calculation_results_show_special_tags_checkbox.value = 1;
        this.m_calculation_results_show_special_tags_checkbox.owner = this;
        this.m_calculation_results_show_special_tags_checkbox.onclick = function(){NACC.prototype.calculateCleantime(this)};
    };
    
    if ( null != this.m_calculation_results_show_special_tags_checkbox_label ) {
        this.m_calculation_results_show_special_tags_checkbox_label.parentNode.removeChild(this.m_calculation_results_show_special_tags_checkbox_label);
    };
    
    this.m_calculation_results_show_special_tags_checkbox_label = this.createDOMObject('label', 'NACC-Show-Special-Tags-Checkbox-Label', this.m_popup_container);

    if ( null != this.m_calculation_results_show_special_tags_checkbox_label ) {
        this.m_calculation_results_show_special_tags_checkbox_label.setAttribute('for', this.m_calculation_results_show_special_tags_checkbox.id);
        this.m_calculation_results_show_special_tags_checkbox_label.innerHTML = this.m_lang[this.m_lang_selector].change_use_special_tags_label;
        this.createDOMObject('div', 'breaker', this.m_popup_container);
    };
};

/********************************************************************************************
####################################### THIRD-PARTY CODE ####################################
********************************************************************************************/
/**
    \brief  This returns the GET parameters as an associative array.
            From here: http://stackoverflow.com/a/5448635/879365
    
    \returns    An associative array, with any GET parameters.
*/
NACC.prototype.getParameters = function() {
    function transformToAssocArray( prmstr ) {
        function urldecode(str) {
            return decodeURIComponent((str+'').replace(/\+/g, '%20'));
        };

        var params = {};
        var prmarr = prmstr.split('&');
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split('=');
            params[urldecode(tmparr[0])] = urldecode(tmparr[1]);
        };
        return params;
    };
    
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != '' ? transformToAssocArray(prmstr) : {};
};

/***********************************************************************/
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
            p = m[5] ? str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        }
        else {
            throw('Huh ?!');
        };
        f = f.substring(m[0].length);
    };
    return o.join('');
};


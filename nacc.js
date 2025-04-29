function NACC(
	inContainerElementID, inStyle, inLang, inTagLayout,
	inShowSpecialTags, inDirectoryRoot, inYear, inMonth, inDay
) {
	var m_getParameters = null;
	var m_relative_directory_root = null;
	var m_style_selector = null;
	var m_lang_selector = null;
	var m_lang = null;
	var m_keytag_layout = null;
	var m_keytag_special = null;
	var m_my_container = null;
	var m_my_form = null;
	var m_my_prompt = null;
	var m_my_fieldset = null;
	var m_my_legend = null;
	var m_my_legend_div = null;
	var m_popup_container = null;
	var m_month_popup = null;
	var m_day_popup = null;
	var m_year_popup = null;
	var m_calculate_button = null;
	var m_calculation_results_div = null;
	var m_calculation_results_display_toggle_button = null;
	var m_calculation_results_show_special_tags_checkbox = null;
	var m_calculation_results_show_special_tags_checkbox_label = null;
	var m_calculation_results_text_div = null;
	var m_calculation_results_keytags_div = null;

	this.m_lang = Array();

	if (inContainerElementID && document.getElementById(inContainerElementID)) {
		this.m_lang.en = new Object();
		// this.m_lang.en.section_title = 'Calculadora de Tempo Limpo';
		// this.m_lang.en.prompt = 'Entre com a data que ficou limpo';
		//this.m_lang.en.calculate_button_text = 'Calcular';
		//this.m_lang.en.change_layout_button_text = 'Mudar Layout das Fichas';
		//this.m_lang.en.change_use_special_tags_label = 'Mostrar fichas especiais';
		//this.m_lang.en.months = Array("ERROR", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");

		//this.m_lang.en.result_invalid = 'Selecione uma data válida!';
		//this.m_lang.en.result_1_day = 'Você está limpo há 1 dia!';
		//this.m_lang.en.result_days_format = 'Você está limpo %d dias!';
		//this.m_lang.en.result_months_format = 'Que são %d meses.';
		//this.m_lang.en.result_months_and_1_day_format = 'Que são %d meses e 1 dia.';
		//this.m_lang.en.result_months_and_days_format = 'Que são %d meses e %d dias.';
		//this.m_lang.en.result_1_year = 'Que é 1 ano.';
		//this.m_lang.en.result_1_year_and_1_day = 'Que é 1 ano e 1 dia.';
		//this.m_lang.en.result_1_year_and_1_month = 'Que é 1 ano e 1 mês.';
		//this.m_lang.en.result_1_year_1_month_and_1_day = 'Que é 1 ano, 1 mês e 1 dia.';
		//this.m_lang.en.result_1_year_months_and_1_day_format = 'Que é 1 ano, %d meses e 1 dia.';
		//this.m_lang.en.result_1_year_months_and_days_format = 'Que é 1 ano, %d meses e %d dias.';
		//this.m_lang.en.result_1_year_days_format = 'Que é 1 ano e %d dias.';
		//this.m_lang.en.result_years_format = 'Que são %d anos.';
		//this.m_lang.en.result_years_months_format = 'Que são %d anos e %d meses.';
		//this.m_lang.en.result_years_1_month_and_1_day_format = 'Que são %d anos, 1 mês e 1 dia.';
		//this.m_lang.en.result_years_months_and_1_day_format = 'Que são %d anos, %d meses e 1 dia.';
		//this.m_lang.en.result_years_and_1_month_format = 'Que são %d anos e 1 mês.';
		//this.m_lang.en.result_years_and_1_day_format = 'Que são %d anos e 1 dia.';
		//this.m_lang.en.result_years_and_days_format = 'Que são %d anos e %d dias.';
		//this.m_lang.en.result_years_1_month_and_days_format = 'Que são %d anos, 1 mês e %d dias.';
		//this.m_lang.en.result_years_months_and_days_format = 'Que são %d anos, %d meses e %d dias.';

		// Same structure for other languages...
		// this.m_lang.es
		// this.m_lang['zh-Hans']
		// this.m_lang['zh-Hant']
		// this.m_lang.it

		// ... and so on.

		// (initialization of m_getParameters, m_relative_directory_root, m_style_selector, m_lang_selector, m_keytag_layout, m_keytag_special, etc.)

		this.m_getParameters = this.getParameters();

		if (this.m_getParameters['NACC-dir-root']) {
			this.m_relative_directory_root = this.m_getParameters['NACC-dir-root'] +
				(!this.m_getParameters['NACC-dir-root'].toString().match(/\/$/) ? '/' : '');
		} else if (inDirectoryRoot) {
			this.m_relative_directory_root = inDirectoryRoot +
				(!inDirectoryRoot.toString().match(/\/$/) ? '/' : '');
		} else {
			this.m_relative_directory_root = '';
		}

		this.m_style_selector = this.m_getParameters['NACC-style'] || inStyle || null;
		this.m_lang_selector = this.m_getParameters['NACC-lang'] || inLang || 'en';
		this.m_keytag_layout = this.m_getParameters['NACC-tag-layout'] || inTagLayout || 'linear';
		this.m_keytag_special = this.m_getParameters['NACC-special-tags'] ? true : !!inShowSpecialTags;

		this.m_my_container = document.getElementById(inContainerElementID);
		this.m_my_container.nacc_instance = this;

		if (this.m_my_container.className) {
			this.m_my_container.className += ' NACC-Instance';
		} else {
			this.m_my_container.className = 'NACC-Instance';
		}
		if (this.m_style_selector) {
			this.m_my_container.className += ' ' + this.m_style_selector;
		}

		this.m_my_container.innerHTML = '';

		this.createHeader();
		this.createForm();
		this.evaluateMonthDays();

		var year = parseInt(this.m_getParameters['NACC-year']) || parseInt(inYear);
		var month = parseInt(this.m_getParameters['NACC-month']) || parseInt(inMonth);
		var day = parseInt(this.m_getParameters['NACC-day']) || parseInt(inDay);

		if (year && month && day) {
			this.m_month_popup.selectedIndex = month - 1;
			for (var i = 0; i < this.m_year_popup.options.length; i++) {
				if (parseInt(this.m_year_popup.options[i].value) === year) {
					this.m_year_popup.selectedIndex = i;
					break;
				}
			}
			this.m_day_popup.selectedIndex = day - 1;
			this.evaluateMonthDays();
			this.calculateCleantime(this.m_calculate_button);
		}

	} else {
		alert('NACC ERROR: INVALID CONTAINER ELEMENT ID');
	}
}

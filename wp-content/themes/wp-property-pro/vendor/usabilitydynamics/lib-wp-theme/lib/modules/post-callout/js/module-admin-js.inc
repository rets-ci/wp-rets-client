<?php
$js_base = $this->js_base;
$id_base = $this->id_base;
return '
'.$js_base.' = {};
'.$js_base.'.searchCache = {};
'.$js_base.'._term = null;

'.$js_base.'.loading = function() {
	return "<div class=\"'.$id_base.'-loading\">'.__('Loading...', 'carrington-build').'<\/div>";
};

'.$js_base.'.search = function() {
	term = $.trim('.$js_base.'.field.val());
	if (term in (this.searchCache)) {
		'.$js_base.'.results.html(this.searchCache[term]);
		'.$js_base.'.bindSelectionClick();
	}
	else if (term.length > 0) {
		'.$js_base.'.results.html('.$js_base.'.loading());
		$.post(
			cfct_builder.opts.ajax_url,
			{
				term: term,
				post_id: $("#post_ID").val(),
				action: "'.$js_base.'_post_search"
			},
			function(response) {
				if ('.$js_base.'.field.val() == response.term) {
					'.$js_base.'.results.html(response.html);
				}
				'.$js_base.'.searchCache[term] = response.html;
				'.$js_base.'.bindSelectionClick();
			},
			"json"
		);
	}
};

'.$js_base.'.bindSelectionClick = function(selections) {				
	'.$js_base.'.results.find("a.select").click(function() {
		$this = $(this);
		$("#'.$id_base.'-post-id").val($this.attr("data-post-id"));
		var preview = $this.parents("div.'.$id_base.'-post-summary");
		$("#'.$id_base.'-post-preview-content").html("").append(preview);
		
		$("#'.$id_base.'-scrollable-wrapper").remove();
							
		'.$js_base.'.results.html("");
		'.$js_base.'._term = null;
		'.$js_base.'.field.val("").trigger("blur");
		$("#'.$this->get_field_id('custom_values').':checked").click(); 
		'.$js_base.'.toggleFormState("close");
		$("#'.$id_base.'-custom-check").show();
		$("a[href*=\"#'.$id_base.'-post-preview-wrap\"]").click();
		
		return false;
	});
}

'.$js_base.'.searchActions = function(searchForm, searchField, resultsTarget) {
	'.$js_base.'.field = jQuery(searchField);
	'.$js_base.'.results = jQuery(resultsTarget);
	'.$js_base.'.form = jQuery(searchField).parents("form");
	
	'.$js_base.'.form.submit(function(evt) {
		if (evt.which == 13) {
			return false;
		}
		return true;
	});
	
	'.$js_base.'.field.attr("autocomplete", "off");
	
	'.$js_base.'.field.keyup(function(e) {
		term = jQuery(this).val();
		switch (e.which) {
			default:
				if (term == "") {
					'.$js_base.'.results.find("ul").remove();
				}
				else if ('.$js_base.'._term != term) {
					'.$js_base.'.search();
					'.$js_base.'._term = term;
				}
				break;
		}
	}).keydown(function(e) {
		// catch arrow up/down here
		if ('.$js_base.'.results.find("ul li").size()) {
			switch (e.which) {
				case 13: // enter
					'.$js_base.'.search();
					'.$js_base.'._term = term;
					if ($.browser.msie) {
						e.cancelBubble = true;
					}
					else {
						e.stopPropagation();
					}
					break;
			}
		}
	});
};

'.$js_base.'.toggleFormState = function(force) {
	$checkbox = $("#'.$this->get_field_id('custom_values').'");
	if((force && force == "open") || $checkbox.is(":checked")) {
		$("#'.$this->get_field_id('title').', #'.$this->get_field_id('content').'").attr("disabled", false).removeClass("disabled");
		$("#'.$id_base.'-title").val($(".'.$id_base.'-post-title").html());
		$("#'.$id_base.'-content").val($(".'.$id_base.'-post-excerpt").html());

		_not_loaded = $("#'.$this->id_base.'-post_image-image-select-items-list").length;
		if (_not_loaded === 0) {
			'.$js_base.'.loadPostImageScrollerItems();
		}
				
		$("#'.$this->get_field_id('custom_values').'_fields").removeClass("hidden");
	}
	else if ((force && force == "close") || $checkbox.not(":checked")) {
		$("#'.$this->get_field_id('title').', #'.$this->get_field_id('content').'").attr("disabled", "disabled").addClass("disabled");
		$("#'.$this->get_field_id('custom_values').'_fields").addClass("hidden");
	};
};

'.$js_base.'.loadPostImageScrollerItems = function() {
	// populate the featured image list
	$.post(
		cfct_builder.opts.ajax_url,
		{
			action: "'.$js_base.'_post_load_images",
			post_id: $("#'.$id_base.'-post-preview-content a.select").attr("data-post-id")
		},
		function(r) {
			if (r.success) {
				// r.success will be true even if no images are found, errors are only for real errors
				//$("#'.$id_base.'-image-select").html(r.html);
				$("#'.$id_base.'-post-image-wrap").html(r.html);
			}
			else {
				$("#'.$id_base.'-wp-image-select").html(r.error_html);
			}
		},
		"json"
	)
};

// form popup equivalent of body.ready
cfct_builder.addModuleLoadCallback("'.$id_base.'",function(form) {
	//Setup Placeholder functionality
	$.placeholders();
	
	'.$this->cfct_module_tabs_js().'
	
	'.$js_base.'.searchActions(null, $("#'.$id_base.'-search"), $("#'.$id_base.'-search-wrap .results"));

	'.$js_base.'.toggleFormState();

	$("#'.$this->get_field_id('custom_values').'").click(function() {
		'.$js_base.'.toggleFormState();
	});
});

// save callback...
cfct_builder.addModuleSaveCallback("'.$id_base.'",function(form) {
	$("#cf-post-callout-module-image-selectors .cfct-module-tab-contents div:hidden :input").val("");
	return true;
});
';
?>
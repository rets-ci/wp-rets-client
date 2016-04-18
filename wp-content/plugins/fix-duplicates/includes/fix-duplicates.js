jQuery(document).ready(function($){

	function switchView(modeToSwitchTo) {
		// if we're in "hide individual posts" mode
		if ( modeToSwitchTo == 'list' ) {
			// hide the list entries and update the arrow
			$('tr[class^="duplicate-group-"]').hide();
			$('.fix-duplicates-more-less').html('&darr;');
			// update the hidden input so the correct value is used on submit
			$('#mode').val('list');
			// update the paging links 
			$('.pagination-links a').each(function(){
				var thisURL = $(this).attr('href').replace('mode=expanded','mode=list');
				$(this).attr('href', thisURL);
			});
			// update the icon to show which is selected
			$('#fd-view-switch-expanded').removeClass('current');
			$('#fd-view-switch-list').addClass('current');
		}
		// or if we're in expanded mode
		else if ( modeToSwitchTo == 'expanded' ) {
			// show the list entries and update the arrow
			$('tr[class^="duplicate-group-"]').show();
			$('.fix-duplicates-more-less').html('&uarr;');				
			// update the hidden input so the correct value is used on submit
			$('#mode').val('expanded');
			// update the paging links 
			$('.pagination-links a').each(function(){	
				var thisURL = $(this).attr('href').replace('mode=list','mode=expanded');
				$(this).attr('href', thisURL);
			});
			// update the icon to show which is selected
			$('#fd-view-switch-list').removeClass('current');
			$('#fd-view-switch-expanded').addClass('current');
		}
	}
	// add alternate background to each group of duplicates
	$('tbody:odd tr').css('background','#e6e6e6');
	$('tbody:even tr').css('background','#f4f4f4');
	
	// hide show individual posts depending on setting
	switchView($('#mode').val()); 
	
	// call switch view when people click on the icons.
	$('#fd-view-switch-list').on('click',function(){
		switchView('list'); 
		return false;
	});
	$('#fd-view-switch-expanded').on('click',function(){
		switchView('expanded'); 
		return false;
	});
	
	// deal with individual show / hides (as opposed to the same for all entries above)
	$('.fix-duplicates-post-number').click(function(){
		var thisDuplicateGroup = $(this).parents('tr').attr('id').replace('duplicate-control-','');
		var thisHiddenFlag = 0;
		$('.duplicate-group-'+thisDuplicateGroup).each(function(){
			if ($(this).is(':hidden')) {
				$(this).show();
				thisHiddenFlag = 1;
			}
			else {
				$(this).hide();
				thisHiddenFlag = 0;						
			}
		});
		if (thisHiddenFlag) {
			$('.fix-duplicates-more-less',this).html('&uarr;');
		}
		else {
			$('.fix-duplicates-more-less',this).html('&darr;');					
		}
	});
	
	// deal with Ajax request for Apply button on individual duplicate entries
	$('[id^="duplicate_entry_apply_"]').click(function(){
		// get the duplicate number we're working with (ie 1 to 20)
		var thisEntry = $(this).attr('id').replace('duplicate_entry_apply_','');
		// set up the variable to send whether newest or oldest is selected
		var duplicateEntryKeepChecked = {};
		if ($('#duplicate_entry_keep_'+thisEntry+'_newest').is(':checked')) {
			duplicateEntryKeepChecked[thisEntry] = 1;
		}
		else {
			duplicateEntryKeepChecked[thisEntry] = 0;
		}
		// set up the variable to send whether redirection is selected
		var duplicateEntryRedirectChecked = {}; 
		if ($('#duplicate_entry_redirect_'+thisEntry).is(':checked')) {
			duplicateEntryRedirectChecked[thisEntry] = '1';
		}
		else {
			duplicateEntryRedirectChecked[thisEntry] = '0';					
		}
		// set up the variable to send which posts are part of this duplicate group
		var duplicateEntryItemsToDelete = {}; 
		duplicateEntryItemsToDelete[thisEntry] = $('#duplicate_entry_items_to_delete_'+thisEntry).val();
		// set up the variable containing data to send to server
		var data = {
			action: 'duplicate_entry_apply',
			wp_nonce: $('#_wpnonce').val(),
			duplicate_entry_apply_: thisEntry,
			duplicate_entry_keep: duplicateEntryKeepChecked,
			duplicate_entry_redirect: duplicateEntryRedirectChecked,
			duplicate_entry_items_to_delete: duplicateEntryItemsToDelete
		}
		// send the data to the server
		$.post(ajaxurl, data, function(response) {
			// on success, remove the control group and individual rows from the screen, remove old message (if exist) and show message
			$('#fix-duplicates-group-'+thisEntry).fadeOut(600,function(){
				$(this).remove();
			});
			$('#message').remove();
			$('.wrap').before(response);
		});
		// return false so the HTML doesn't post to the server as well
		return false;
	});
	
	// deal with Ajax request for Trash links on individual items
	$('.submitdelete').click(function(){
		// get the post ID we're working with
		var thisEntry = $(this).attr('id').replace('trash-','');
		// if this ID includes a redirect, separate it out 
		var thisRedirect = '';
		if (thisEntry.indexOf('-')) {
			var thisEntryArray = thisEntry.split('-');
			thisEntry = thisEntryArray[0];
			thisRedirect = thisEntryArray[1];
		}
		// set up the variable containing data to send to server
		var data = {
			action: 'duplicate_trash_individual',
			wp_nonce: $('#_wpnonce').val(),
			post: thisEntry,
			redirect: thisRedirect
		}
		// send the data to the server
		$.post(ajaxurl, data, function(response) {
			// on success, remove the row from the screen, remove old message (if exist) and show message
			if (response.indexOf('SUCCESS')>-1){
				$('#post-'+thisEntry).fadeOut(600,function(){
					$(this).remove();
				});
			}
			$('#message').remove();
			$('.wrap').before(response);
		});
		// return false so the HTML doesn't post to the server as well
		return false;
	});
	
	// warn people doing the bulk delete
	$('#duplicate_entry_delete_all').click(function(){
		$('#duplicate_entry_warning').show();
		$('#duplicate_entry_redirect_all').attr('disabled','disabled'); 
	});
	$('#duplicate_entry_delete_below').click(function(){
		$('#duplicate_entry_warning').hide();
		if ($('#duplicate_entry_redirect_all').hasClass('duplicate_entry_pro')) {
			$('#duplicate_entry_redirect_all').removeAttr('disabled'); 
		}
	});
	
	// warn people about bulk redirects if draft posts are showing
	$('#duplicate_entry_redirect_all').change(function(){
		// if show_drafts is checked then toggle warning
		if ($('#show_drafts').hasClass('drafts_showing')) {
			if ($(this).is(':checked')) {
				$('#duplicate_entry_redirect_warning').show();
			}
			else {
				$('#duplicate_entry_redirect_warning').hide();			
			}
		}
	});

	// warn people about control row redirects if draft posts are showing
	$('.redirection_control_input').change(function(){
		// if show_drafts is checked then toggle warning
		if ($('#show_drafts').hasClass('drafts_showing')) {
			if ($(this).is(':checked')) {
				// append the warning then show it.
				var thisSelector = $(this).attr('id').replace('duplicate_entry_redirect_','duplicate_entry_apply_');
				$('#'+thisSelector).after('<div id="duplicate_entry_control_warning" class="fix-duplicates-warning">Items will not be redirected if the target is not published (ie if it has a status of draft).</div>');
				$('#duplicate_entry_control_warning').show();
				// set up handler to remove it on mouseout. Destroy the event handler on first run so they don't build up
				$('.row-actions').mouseout(function(){
					$('#duplicate_entry_control_warning').remove();
					$('.row-actions').off('mouseout'); 
				});
			}
			else {
				$('#duplicate_entry_control_warning').remove();
			}
		}
	});
	
});
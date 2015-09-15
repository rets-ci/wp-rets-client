// Uploading files
var file_frame;
var targetID;
jQuery('.upload_image_button').live('click', function( event ){
    event.preventDefault();
    targetID = event.currentTarget.dataset.targetId;

    // If the media frame already exists, reopen it.
    if ( file_frame ) {
        file_frame.open();
        return;
    }

    // Create the media frame.
    file_frame = wp.media.frames.file_frame = wp.media({
        title: jQuery( this ).data( 'uploader_title' ),
        button: {
            text: jQuery( this ).data( 'uploader_button_text' )
        },
        multiple: false  // Set to true to allow multiple files to be selected
    });

    // When an image is selected, run a callback.
    file_frame.on( 'select', function() {
        // We set multiple to false so only get one image from the uploader
        attachment = file_frame.state().get('selection').first().toJSON();

        jQuery('#'+targetID).val(attachment.url);
        jQuery('#'+targetID+'-preview').attr('src',attachment.url);
        jQuery('#'+targetID).closest('div').addClass('with_image');

        jQuery('#'+targetID).closest('div').find('li.active').removeClass('active');
        jQuery('#'+targetID).closest('div').find('.dimage').val(0);
    });

    // Finally, open the modal
    file_frame.open();
});
jQuery('.clear_image_button').live('click', function( event ){
    event.preventDefault();
    targetID = event.currentTarget.dataset.targetId;
    defaultSrc = event.currentTarget.dataset.default;

    jQuery('#'+targetID).val('');
    jQuery('#'+targetID+'-preview').attr('src',defaultSrc);
    jQuery('#'+targetID).closest('div').removeClass('with_image');

    jQuery('#'+targetID).closest('div').find('li.active').removeClass('active');
    jQuery('#'+targetID).closest('div').find('.dimage').val(0);
});

//select all items in table
function selectItems(button, classItem){
    var button = jQuery(button);
    var table = jQuery(document.body);
    if( button.is(':checked') ){
        jQuery.each( table.find('input.'+classItem), function( key, value ) {
            jQuery(value).attr('checked',true);
        });
    }else{
        jQuery.each( table.find('input.'+classItem), function( key, value ) {
            jQuery(value).attr('checked',false);
        });
    }
}

function selectDimage(rate, button){
    var button = jQuery(button);
    var container = button.closest('ul');

    if( container.find('li.active') ){
        if( container.find('li.active').hasClass('rate_'+rate) ){
            container.find('li.active').removeClass('active');
            button.closest('div').find('.dimage').val(0);
        }else{
            container.find('li.active').removeClass('active');
            container.find('li.rate_'+rate).addClass('active');
            button.closest('div').find('.dimage').val(rate);

            button.closest('div').removeClass('with_image');
            button.closest('div').find('img').attr('src', button.closest('div').find('.clear_image_button').attr('data-default'));
            button.closest('div').find('.image').val('');
        }
    }
}
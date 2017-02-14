jQuery(function () {
    display_branding_select(jQuery('#customize-control-property_pro_brand_type select').val());

    jQuery('#customize-control-property_pro_brand_type select').on('change', function () {
        display_branding_select(jQuery(this).val())
    });
});

function display_branding_select(brand_type) {
    if (brand_type == 'company') {
        jQuery('#customize-control-property_pro_company_square_logo').show();
        jQuery('#customize-control-property_pro_company_horizontal_logo').show();
        jQuery('#customize-control-property_pro_company_vertical_logo').show();

        jQuery('#customize-control-property_pro_person_square_headshot').hide();
        jQuery('#customize-control-property_pro_person_name').hide();
        jQuery('#customize-control-property_pro_person_credential').hide();
    } else if (brand_type == 'person') {
        jQuery('#customize-control-property_pro_person_square_headshot').show();
        jQuery('#customize-control-property_pro_person_name').show();
        jQuery('#customize-control-property_pro_person_credential').show();

        jQuery('#customize-control-property_pro_company_square_logo').hide();
        jQuery('#customize-control-property_pro_company_horizontal_logo').hide();
        jQuery('#customize-control-property_pro_company_vertical_logo').hide();

    } else {
        jQuery('#customize-control-property_pro_person_square_headshot').hide();
        jQuery('#customize-control-property_pro_person_name').hide();
        jQuery('#customize-control-property_pro_person_credential').hide();

        jQuery('#customize-control-property_pro_company_square_logo').hide();
        jQuery('#customize-control-property_pro_company_horizontal_logo').hide();
        jQuery('#customize-control-property_pro_company_vertical_logo').hide();
    }
}
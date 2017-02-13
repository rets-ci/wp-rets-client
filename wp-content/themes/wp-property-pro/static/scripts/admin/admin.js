jQuery(function () {
    display_branding_select(jQuery('#customize-control-property_pro_brand_type select').val());

    jQuery('#customize-control-property_pro_brand_type select').on('change', function () {
        display_branding_select(jQuery(this).val())
    });
});

function display_branding_select(brand_type) {
    if (brand_type == 'company') {
        jQuery('#customize-control-property_pro_company_branding').show();
        jQuery('#customize-control-property_pro_person_branding').hide();
    } else if (brand_type == 'person') {
        jQuery('#customize-control-property_pro_person_branding').show();
        jQuery('#customize-control-property_pro_company_branding').hide();
    } else {
        jQuery('#customize-control-property_pro_person_branding').hide();
        jQuery('#customize-control-property_pro_company_branding').hide();
    }
}
jQuery(function () {
    jQuery('#customize-control-brand_type_control select').on('change', function () {
        var brand_type = jQuery(this).val();
        if (brand_type == 'company') {
            jQuery('#customize-control-company_branding_control_hidden').attr('id', 'customize-control-company_branding_control');
            jQuery('#customize-control-person_branding_control').attr('id', 'customize-control-person_branding_control_hidden');
        } else if(brand_type == 'person') {
            jQuery('#customize-control-person_branding_control_hidden').attr('id', 'customize-control-person_branding_control');
            jQuery('#customize-control-company_branding_control').attr('id', 'customize-control-company_branding_control_hidden');
        }else{
            jQuery('#customize-control-company_branding_control').attr('id', 'customize-control-company_branding_control_hidden');
            jQuery('#customize-control-person_branding_control').attr('id', 'customize-control-person_branding_control_hidden');
        }
    });
});
<div class="popupNoticeRentPass popup contact-popup" style="display: none;">
    <div class="popup-overlay"></div>
    <div class="popup-inner-wrapper">
        <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
        <div class="popup-form-wrapper">

            <i class="icon icon-wpproperty-contact-name-outline"></i>

            <h3><?php _e('I want to rent a home', 'reddoor'); ?></h3>
            <p><?php _e('Please contact <span class="nonrdcagentname"></span> at <span class="nonrdcagentoffice"></span> direct via the phone number below. If you would you rather rent from Red Door Company 
            instead, please <a target="_blank" href="/listing_office/red-door-company?wpp_search%5Bsale_type%5D=Rent">browse our rental listings!</a>', 'reddoor'); ?></p>
            <?php
            if ( is_singular('property') ){
                global $property;

                if ( $property && isset( $property['ID'] ) ) {
                    $phone = \UsabilityDynamics\RDC\Utils::get_single_term( 'listing_agent_phone_number', $property['ID'] );
                    ?><input readonly class="nonrdcagentphone" type="tel" value="<?php echo $phone; ?>" /><?php
                }
            }
            ?>

        </div>
    </div>
</div>
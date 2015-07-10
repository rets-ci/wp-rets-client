<?php
/**
 * Template Name: Page Contact
 */
?>

<?php get_header(); ?>

<script src="https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-1.9.0.validate.min.js" type="text/javascript"></script>

<section id="site-primary" class="content-area column col-8-12">
  <main id="site-main" class="content-area-main" role="main">

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
      <div class="entry-inner">
        <header class="entry-header">
          <h1 class="entry-title"><?php the_title(); ?></h1>
        </header>

        <div class="entry-content">

          <form id="powf_95350A21BE5BE411AFEF6C3BE5A87DF0"
                enctype="multipart/form-data"
                action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_95350A21BE5BE411AFEF6C3BE5A87DF0&tver=2013&c=1"
                method="post"
                class="contact_form">

            <div class="label">
              <label for="powf_f8c1dc41be5be411afef6c3be5a87df0">First Name</label>
              <span class="tip"></span>
            </div>

            <div class="field">
              <input type="text" id="powf_f8c1dc41be5be411afef6c3be5a87df0" name="powf_f8c1dc41be5be411afef6c3be5a87df0"
                     value="" maxlength="100" class="required"/>
              <span class="required">*</span>
            </div>

            <div class="clear"></div>
            <div class="label">
              <label for="powf_fb0203a8be5be411afef6c3be5a87df0">Last Name</label>
              <span class="tip"></span>
            </div>

            <div class="field">
              <input type="text" id="powf_fb0203a8be5be411afef6c3be5a87df0" name="powf_fb0203a8be5be411afef6c3be5a87df0"
                     value="" maxlength="100" class="required"/>
              <span class="required">*</span>
            </div>

            <div class="clear"></div>
            <div class="label">
              <label for="powf_8f6505c7be5be411afef6c3be5a87df0">Email</label>
              <span class="tip"></span>
            </div>

            <div class="field">
              <input type="text" id="powf_8f6505c7be5be411afef6c3be5a87df0" name="powf_8f6505c7be5be411afef6c3be5a87df0"
                     value="" maxlength="100" class="required email"/>
              <span class="required">*</span>
            </div>

            <div class="clear"></div>
            <div class="label">
              <label for="powf_4382f4e7be5be411afef6c3be5a87df0">Phone</label>
              <span class="tip"></span>
            </div>

            <div class="field">
              <input type="text" id="powf_4382f4e7be5be411afef6c3be5a87df0" name="powf_4382f4e7be5be411afef6c3be5a87df0"
                     value="" maxlength="100" class="digits"/>
            </div>

            <div class="clear"></div>
            <div class="label">
              <label for="powf_b1db5f05bf5be411afef6c3be5a87df0">Message/Comments</label>
              <span class="tip"></span>
            </div>

            <div class="field">
              <textarea id="powf_b1db5f05bf5be411afef6c3be5a87df0" name="powf_b1db5f05bf5be411afef6c3be5a87df0" cols=""
                        rows=""></textarea>
            </div>

            <div class="clear"></div>
            <!-- Origin -->
            <input type="hidden" id="powf_5ffe4125bf5be411afef6c3be5a87df0" name="powf_5ffe4125bf5be411afef6c3be5a87df0"
                   value="General"/>
            <!-- Lead Source -->
            <input type="hidden" id="powf_0953b84abf5be411afef6c3be5a87df0" name="powf_0953b84abf5be411afef6c3be5a87df0"
                   value="RedDoorCompany.com"/>
            <!-- tver -->
            <input type="hidden" id="tver" name="tver" value="2013"/>
            <input type="hidden" name="ignore_submitmessage" value="Thank you.  We will be in touch with you shortly."/>
            <input type="hidden" name="ignore_linkbuttontext" value=""/>
            <input type="hidden" name="ignore_redirecturl" value="http://www.reddoorcompany.com/form-submitted/"/>
            <input type="hidden" name="ignore_redirectmode" value="Auto"/>

            <div>
              <input class="button" type="submit" value="Submit" />
            </div>
          </form>

          <script type="text/javascript">
            jQuery(document).ready(function () {
              jQuery.extend(jQuery.validator.messages, {

                email: "Please enter a valid email address. Make sure there are no leading or trailing spaces."
              });

              jQuery("#powf_95350A21BE5BE411AFEF6C3BE5A87DF0").validate({
                errorPlacement: function (error, element) {
                  error.appendTo(element.parents("div.field:first"));
                },

                invalidHandler: function (event, validator) {
                  var errors = validator.numberOfInvalids();
                  if (errors) {
                    jQuery("input[type=submit]").removeAttr("disabled");
                  }
                },
                onfocusout: false,
                onkeyup: false,
                onclick: false,
                debug: false
              });
            });

          </script>

        </div>
      </div>
    </article>

  </main>
</section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>

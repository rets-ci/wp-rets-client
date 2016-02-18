<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

  <script>

  </script>
  <script>

  </script>
  <script>

  </script>
  <div class="container-fluid">
    <div class="row">
      <section class="frontPageSearchBlock">
        <?php get_template_part('templates/search-form'); ?>
      </section>
    </div>
    <section>
      <div class="popupContactUs" style="display: none;">
        <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
        <ul>
          <li class="pupBuy">
            <a href="#">
              <span></span><div>I want to buy a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupRent">
            <a href="#">
            <span></span><div>I want to rent a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupSell">
            <a href="#">
            <span></span><div>I want to sell my home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupRentProp">
            <a href="#">
            <span></span><div>I went to rent my property</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
        </ul>
      </div>
      <div class="popupLogin">
        <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
        <ul>
          <li>
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/landlord.png" alt="" />
            <span>Lanlord</span>
            <a href="">Lanlord Login</a>
          </li>
          <li>
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/tenant.png" alt="" />
            <span>Tenant</span>
            <a href="">Tenant Login</a>
          </li>
          </ul>
      </div>
    </section>
  </div>

  <div class="container">
    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>

        <?php  the_content(); ?>

      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>
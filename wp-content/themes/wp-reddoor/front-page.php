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
              <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/buyHome.png" alt="" /><div>I want to buy a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupRent">
            <a href="#">
              <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/rentHome.png" alt="" /><div>I want to rent a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupSell">
            <a href="#">
              <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/sellHome.png" alt="" /><div>I want to sell my home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
          <li class="pupRentProp">
            <a href="#">
              <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/rentMyProp.png" alt="" /><div>I went to rent my property</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
            </a>
          </li>
        </ul>
      </div>
      <div class="popupLogin" style="display: none;">
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
      <div class="popupContactUsMore">
        <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
        <div>
          <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/buyHome.png" alt="" />
          <h3>I want to buy a home</h3>
          <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming.</p>
          <input id="phone" type="tel" />
          <span>click to view the full number</span>
          <input type="text" />
          <select>
            <option>Dropdown</option>
            <option></option>
            <option></option>
          </select>
          <div class="popupCheckbox">
            <input id="checkbox1" type="checkbox" />
            <label for="checkbox1">Checkbox</label>
            <input id="checkbox2" type="checkbox" />
            <label for="checkbox2">Checkbox</label>
          </div>
          <input type="submit" value="Contact Us" />
        </div>
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
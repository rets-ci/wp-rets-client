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
    $(function() {
      $( "#tabs" ).tabs();
    });
  </script>

  <div class="container-fluid">
    <div class="row">
      <section class="frontPageSearchBlock">
        <div class="searchForm"  id="tabs">
          <ul>
            <li class="buyBtnForm currentFormElement">
              <a href="#tabs-1" class="active">Buy</a>
            </li>
            <li class="rentBtnForm">
              <a href="#tabs-2">Rent</a>
            </li>
            <li class="sellBtnForm">
              <a href="#tabs-3">Sell your home</a>
            </li>
            <li class="rentPropBtnForm">
              <a href="#tabs-4">Rent your property</a>
            </li>
          </ul>
          <form class="buyForm" id="tabs-1">
            <select>
              <option>Location</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Beds</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Baths</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Price</option>
              <option></option>
              <option></option>
            </select>
            <input type="submit" value="Search" />
          </form>
          <form class="rentForm" id="tabs-2">
            <select>
              <option>Location</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Baths</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Price</option>
              <option></option>
              <option></option>
            </select>
            <input type="submit" value="Search" />
          </form>
          <form class="Form" id="tabs-2">
            <select>
              <option>Location</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Baths</option>
              <option></option>
              <option></option>
            </select>
            <select>
              <option>Price</option>
              <option></option>
              <option></option>
            </select>
            <input type="submit" value="Search" />
          </form>
        </div>
      </section>
    </div>
  </div>

  <div class="container">
    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>

        <?php  the_content(); ?>

      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>
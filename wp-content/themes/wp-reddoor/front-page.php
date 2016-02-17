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
            <div class="location">
              <svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
              <input class="tags">
            </div>
            <div class="sfBeds">
              <span>Beds</span>
              <ul>
                <li><input type="checkbox" /><label>1</label></li>
                <li><input type="checkbox" /><label>1.5</label></li>
                <li><input type="checkbox" /><label>2</label></li>
                <li><input type="checkbox" /><label>3</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfBaths">
              <span>Baths</span>
              <ul>
                <li><input type="checkbox" /><label>1+</label></li>
                <li><input type="checkbox" /><label>1.5+</label></li>
                <li><input type="checkbox" /><label>2+</label></li>
                <li><input type="checkbox" /><label>3+</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfPrice">
              <span>Price</span>
            </div>
            <input type="submit" value="Search" />
          </form>
          <form class="rentForm" id="tabs-2">
            <div class="location">
              <svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
              <input class="tags">
            </div>
            <div class="sfBeds">
              <span>Beds</span>
              <ul>
                <li><input type="checkbox" /><label>1</label></li>
                <li><input type="checkbox" /><label>1.5</label></li>
                <li><input type="checkbox" /><label>2</label></li>
                <li><input type="checkbox" /><label>3</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfBaths">
              <span>Baths</span>
              <ul>
                <li><input type="checkbox" /><label>1+</label></li>
                <li><input type="checkbox" /><label>1.5+</label></li>
                <li><input type="checkbox" /><label>2+</label></li>
                <li><input type="checkbox" /><label>3+</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfPrice">
              <span>Price</span>
            </div>
            <input type="submit" value="Search" />
          </form>
          <form class="sellForm" id="tabs-3">
            <div class="location">
              <svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
              <input class="tags">
            </div>
            <div class="sfBeds">
              <span>Beds</span>
              <ul>
                <li><input type="checkbox" /><label>1</label></li>
                <li><input type="checkbox" /><label>1.5</label></li>
                <li><input type="checkbox" /><label>2</label></li>
                <li><input type="checkbox" /><label>3</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfBaths">
              <span>Baths</span>
              <ul>
                <li><input type="checkbox" /><label>1+</label></li>
                <li><input type="checkbox" /><label>1.5+</label></li>
                <li><input type="checkbox" /><label>2+</label></li>
                <li><input type="checkbox" /><label>3+</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfPrice">
              <span>Price</span>
            </div>
            <input type="submit" value="Search" />
          </form>
          <form class="rentPropForm" id="tabs-4">
            <div class="location">
              <svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
              <input class="tags">
            </div>
            <div class="sfBeds">
              <span>Beds</span>
              <ul>
                <li><input type="checkbox" /><label>1</label></li>
                <li><input type="checkbox" /><label>1.5</label></li>
                <li><input type="checkbox" /><label>2</label></li>
                <li><input type="checkbox" /><label>3</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfBaths">
              <span>Baths</span>
              <ul>
                <li><input type="checkbox" /><label>1+</label></li>
                <li><input type="checkbox" /><label>1.5+</label></li>
                <li><input type="checkbox" /><label>2+</label></li>
                <li><input type="checkbox" /><label>3+</label></li>
                <li><input type="checkbox" /><label>4</label></li>
                <li><input type="checkbox" /><label>5</label></li>
                <li><input type="checkbox" /><label>6</label></li>
              </ul>
            </div>
            <div class="sfPrice">
              <span>Price</span>
            </div>
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
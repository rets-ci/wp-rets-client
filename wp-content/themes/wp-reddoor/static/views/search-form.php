<?php

	$queryTermsSale = new WP_Query( array(
			'post_type' => 'property',
			'tax_query' => array(
				array(
					'taxonomy' => 'sale_type',
					'field'    => 'slug',
					'terms' => 'sale'
				)
			)
		)
	);
	$queryTermsRent = new WP_Query( array(
			'post_type' => 'property',
			'tax_query' => array(
				array(
					'taxonomy' => 'sale_type',
					'field'    => 'slug',
					'terms' => 'rent'
				)
			)
		)
	);

	$saleTermsQuantity = count($queryTermsSale->posts);
	$rentTermsQuantity = count($queryTermsRent->posts);

?>

<div class="searchForm" id="tabs_search">
	<ul class="nav nav-tabs">
		<li class="formTabs active" data-topmenu="buyBtnForm">
			<a data-toggle="tab" href="#tabs-1">Buy</a>
		</li>
		<li class="formTabs" data-topmenu="rentBtnForm">
			<a data-toggle="tab" href="#tabs-2">Rent</a>
		</li>
	</ul>
	<ul>
		<li class="sellBtnForm">
			<a href="http://google.com/">Sell your home</a>
		</li>
		<li class="rentPropBtnForm">
			<a href="http://google.com/">Rent your property</a>
		</li>
	</ul>
	<div class="clear"></div>
	<div class="tab-content">
	<form class="buyForm active tab-pane fade in " id="tabs-1" method="POST" action="">
		<div class="location">
			<span class="icon-wpproperty-location-pin-solid sf-icon"></span>
			<select class="citiesSelection" name="_term" placeholder="Location">
				<option value="" selected></option>
			</select>
		</div>
		<div class="sfBeds">
			<span><div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>Beds<b class="sf-arrow"></b></span>
			<ul>
				<li><input id="bed1" name="wpp_search[bedrooms][]" type="checkbox" value="1" /><label for="bed1">1</label></li>
				<li><input id="bed15" name="wpp_search[bedrooms][]" type="checkbox" value="1.5" /><label for="bed15">1.5</label></li>
				<li><input id="bed2" name="wpp_search[bedrooms][]" type="checkbox" value="2" /><label for="bed2">2</label></li>
				<li><input id="bed3" name="wpp_search[bedrooms][]" type="checkbox" value="3" /><label for="bed3">3</label></li>
				<li><input id="bed4" name="wpp_search[bedrooms][]" type="checkbox" value="4" /><label for="bed4">4</label></li>
				<li><input id="bed5" name="wpp_search[bedrooms][]" type="checkbox" value="5" /><label for="bed5">5</label></li>
				<li><input id="bed6" name="wpp_search[bedrooms][]" type="checkbox" value="6" /><label for="bed6">6</label></li>
			</ul>
		</div>
		<div class="sfBaths">
			<span><div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>Baths<b class="sf-arrow"></b></span>
			<ul>
				<li><input id="bath1" name="wpp_search[bathrooms][]" type="checkbox" value="1" /><label for="bath1">1</label></li>
				<li><input id="bath15" name="wpp_search[bathrooms][]" type="checkbox" value="1.5" /><label for="bath15">1.5</label></li>
				<li><input id="bath2" name="wpp_search[bathrooms][]" type="checkbox" value="2" /><label for="bath2">2</label></li>
				<li><input id="bath3" name="wpp_search[bathrooms][]" type="checkbox" value="3" /><label for="bath3">3</label></li>
				<li><input id="bath4" name="wpp_search[bathrooms][]" type="checkbox" value="4" /><label for="bath4">4</label></li>
				<li><input id="bath5" name="wpp_search[bathrooms][]" type="checkbox" value="5" /><label for="bath5">5</label></li>
				<li><input id="bath6" name="wpp_search[bathrooms][]" type="checkbox" value="6" /><label for="bath6">6</label></li>
			</ul>
		</div>
		<div class="sfPrice">
			<span><div class="icon-wpproperty-attribute-price-solid sf-icon"></div>Price<b class="sf-arrow"></b></span>

			<div class="sfPriceRange">
				<div class="sfprInputsBlock">
					<input type="text" class="firstRange" value="" name="wpp_search[price][min]" placeholder="Min">
					<input type="text" class="lastRange" value="" name="wpp_search[price][max]" placeholder="Max">
				</div>
				<div class="clear"></div>
				<div class="left-side">
					<ul class="firstRangeList">
						<li><a val="$50k" href="javascript:void(0);">$50k</a></li>
						<li><a val="$75k" href="javascript:void(0);">$75k</a></li>
						<li><a val="$100k" href="javascript:void(0);">$100k</a></li>
						<li><a val="$125k" href="javascript:void(0);">$125k</a></li>
						<li><a val="$150k" href="javascript:void(0);">$150k</a></li>
						<li><a val="$175k" href="javascript:void(0);">$175k</a></li>
						<li><a val="$200k" href="javascript:void(0);">$200k</a></li>
						<li><a val="$0" href="javascript:void(0);">Any Amount</a></li>
					</ul>
				</div>
				<div class="right-side">
					<ul class="lastRangeList">
						<li><a val="$300k" href="javascript:void(0);">$300k</a></li>
						<li><a val="$350k" href="javascript:void(0);">$350k</a></li>
						<li><a val="$400k" href="javascript:void(0);">$400k</a></li>
						<li><a val="$450k" href="javascript:void(0);">$450k</a></li>
						<li><a val="$500k" href="javascript:void(0);">$500k</a></li>
						<li><a val="$550k" href="javascript:void(0);">$550k</a></li>
						<li><a val="$600k" href="javascript:void(0);">$600k</a></li>
						<li><a val="$0" href="javascript:void(0);">Any Amount</a></li>
					</ul>
				</div>
			</div>

		</div>
		<input type="submit" value="Search" />
		<div class="sf-property-quantity"><b>!</b> <?php echo $saleTermsQuantity ?> properties for sale</div>
	</form>

	<form class="rentForm tab-pane fade" id="tabs-2"  method="POST" action="">
		<div class="location">
			<span class="icon-wpproperty-location-pin-solid sf-icon"></span>
			<select class="citiesSelection" name="_term">
				<option></option>
			</select>
		</div>
		<div class="sfBeds">
			<span><div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>Beds<b class="sf-arrow"></b></span>
			<ul>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="1" /><label>1</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="1.5" /><label>1.5</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="2" /><label>2</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="3" /><label>3</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="4" /><label>4</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="5" /><label>5</label></li>
				<li><input name="wpp_search[bedrooms][]" type="checkbox" value="6" /><label>6</label></li>
			</ul>
		</div>
		<div class="sfBaths">
			<span><div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>Baths<b class="sf-arrow"></b></span>
			<ul>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="1" /><label>1</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="1.5" /><label>1.5</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="2" /><label>2</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="3" /><label>3</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="4" /><label>4</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="5" /><label>5</label></li>
				<li><input name="wpp_search[bathrooms][]" type="checkbox" value="6" /><label>6</label></li>
			</ul>
		</div>
		<div class="sfPrice">
			<span><div class="icon-wpproperty-attribute-price-solid sf-icon"></div>Price<b class="sf-arrow"></b></span>
		</div>
		<input type="submit" value="Search" />
		<div class="sf-property-quantity"><b>!</b> <?php echo $rentTermsQuantity ?> properties for rent</div>
	</form>
	</div>
</div>


<div class="searchForm" id="tabs">
	<ul>
		<li class="formTabs" data-topmenu="buyBtnForm">
			<a href="#tabs-1" class="active">Buy</a>
		</li>
		<li class="formTabs" data-topmenu="rentBtnForm">
			<a href="#tabs-2">Rent</a>
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
	<form class="buyForm" id="tabs-1" method="POST" action="">
		<div class="location">
			<svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
			<select class="citiesSelection">
				<option selected="selected" value="3620194">Location</option>
			</select>
		</div>
		<div class="sfBeds">
			<span><svg class="icon icon-beds"><use xlink:href="#icon-beds"></use></svg>Beds</span>
			<ul>
				<li><input id="bed1" name="numberBeds" type="checkbox" value="1" /><label for="bed1">1</label></li>
				<li><input id="bed15" name="numberBeds" type="checkbox" value="1.5" /><label for="bed15">1.5</label></li>
				<li><input id="bed2" name="numberBeds" type="checkbox" value="2" /><label for="bed2">2</label></li>
				<li><input id="bed3" name="numberBeds" type="checkbox" value="3" /><label for="bed3">3</label></li>
				<li><input id="bed4" name="numberBeds" type="checkbox" value="4" /><label for="bed4">4</label></li>
				<li><input id="bed5" name="numberBeds" type="checkbox" value="5" /><label for="bed5">5</label></li>
				<li><input id="bed6" name="numberBeds" type="checkbox" value="6" /><label for="bed6">6</label></li>
			</ul>
		</div>
		<div class="sfBaths">
			<span><svg class="icon icon-baths"><use xlink:href="#icon-baths"></use></svg>Baths</span>
			<ul>
				<li><input id="bath1" name="numberBaths" type="checkbox" value="1" /><label for="bath1">1+</label></li>
				<li><input id="bath15" name="numberBaths" type="checkbox" value="1.5" /><label for="bath15">1.5+</label></li>
				<li><input id="bath2" name="numberBaths" type="checkbox" value="2" /><label for="bath2">2+</label></li>
				<li><input id="bath3" name="numberBaths" type="checkbox" value="3" /><label for="bath3">3+</label></li>
				<li><input id="bath4" name="numberBaths" type="checkbox" value="4" /><label for="bath4">4</label></li>
				<li><input id="bath5" name="numberBaths" type="checkbox" value="5" /><label for="bath5">5</label></li>
				<li><input id="bath6" name="numberBaths" type="checkbox" value="6" /><label for="bath6">6</label></li>
			</ul>
		</div>
		<div class="sfPrice">
			<span><svg class="icon icon-price"><use xlink:href="#icon-price"></use></svg>Price</span>

			<div class="sfPriceRange">
				<div class="sfprInputsBlock">
					<input type="text" class="firstRange" value="" name="firstRange" placeholder="Min">
					<input type="text" class="lastRange" value="" name="lastRange" placeholder="Max">
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
					</ul>
				</div>
			</div>

		</div>
		<input type="submit" value="Search" />
	</form>
	<form class="rentForm" id="tabs-2"  method="POST" action="">
		<div class="location">
			<svg class="icon icon-location"><use xlink:href="#icon-location"></use></svg>
			<select class="citiesSelection">
				<option selected="selected" value="3620194">Location</option>
			</select>
		</div>
		<div class="sfBeds">
			<span><svg class="icon icon-beds"><use xlink:href="#icon-beds"></use></svg>Beds</span>
			<ul>
				<li><input name="numberBeds" type="checkbox" value="1" /><label>1</label></li>
				<li><input name="numberBeds" type="checkbox" value="1.5" /><label>1.5</label></li>
				<li><input name="numberBeds" type="checkbox" value="2" /><label>2</label></li>
				<li><input name="numberBeds" type="checkbox" value="3" /><label>3</label></li>
				<li><input name="numberBeds" type="checkbox" value="4" /><label>4</label></li>
				<li><input name="numberBeds" type="checkbox" value="5" /><label>5</label></li>
				<li><input name="numberBeds" type="checkbox" value="6" /><label>6</label></li>
			</ul>
		</div>
		<div class="sfBaths">
			<span><svg class="icon icon-baths"><use xlink:href="#icon-baths"></use></svg>Baths</span>
			<ul>
				<li><input name="numberBaths" type="checkbox" value="1" /><label>1+</label></li>
				<li><input name="numberBaths" type="checkbox" value="1.5" /><label>1.5+</label></li>
				<li><input name="numberBaths" type="checkbox" value="2" /><label>2+</label></li>
				<li><input name="numberBaths" type="checkbox" value="3" /><label>3+</label></li>
				<li><input name="numberBaths" type="checkbox" value="4" /><label>4</label></li>
				<li><input name="numberBaths" type="checkbox" value="5" /><label>5</label></li>
				<li><input name="numberBaths" type="checkbox" value="6" /><label>6</label></li>
			</ul>
		</div>
		<div class="sfPrice">
			<span><svg class="icon icon-price"><use xlink:href="#icon-price"></use></svg>Price</span>
		</div>
		<input type="submit" value="Search" />
	</form>
	<div class="sellForm" id="tabs-3"  method="POST" action="">

	</div>
	<div class="rentPropForm" id="tabs-4"  method="POST" action="">

	</div>
</div>


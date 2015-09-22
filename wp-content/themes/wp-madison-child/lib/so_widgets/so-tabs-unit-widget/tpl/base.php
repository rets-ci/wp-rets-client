<div class="rdc-tabs-unit">
	<div class="section-content">

		<h3 class="section-title"><?php echo $instance[ 'label' ]; ?></h3>
		<p class="section-tagline"><?php echo $instance[ 'tagline' ]; ?></p>
		<hr class="section-delimiter" />

		<div class="rdc-tabs">

			<ul>
				<li><a href="#unit-tab-1">Tenants</a></li><li><a href="#unit-tab-2">Landlords</a></li>
			</ul>

			<div id="unit-tab-1">
				<ul class="static-boxes row">
					<li class="column col-4-12 column-left">
						<?php if( !empty( $instance[ 'tab1' ][ 'tab1item1link' ] ) ) echo '<a href="' . $instance[ 'tab1' ][ 'tab1item1link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-online-portal"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab1' ][ 'tab1item1label' ]; ?></h4>
								<p><?php echo $instance[ 'tab1' ][ 'tab1item1text' ]; ?></p>
							</div>
						</div>
						<?php if ( !empty( $instance[ 'tab1' ][ 'tab1item1link' ] ) ) echo '</a>'; ?>
					</li><li class="column col-4-12 column-middle">
						<?php if( !empty( $instance[ 'tab1' ][ 'tab1item2link' ] ) ) echo '<a href="' . $instance[ 'tab1' ][ 'tab1item2link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-payrent-online"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab1' ][ 'tab1item2label' ]; ?></h4>
								<p><?php echo $instance[ 'tab1' ][ 'tab1item2text' ]; ?></p>
							</div>
						</div>
						<?php if ( !empty( $instance[ 'tab1' ][ 'tab1item2link' ] ) ) echo '</a>'; ?>
					</li><li class="column col-4-12 column-right">
						<?php if( !empty( $instance[ 'tab1' ][ 'tab1item3link' ] ) ) echo '<a href="' . $instance[ 'tab1' ][ 'tab1item3link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-service-request"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab1' ][ 'tab1item3label' ]; ?></h4>
								<p><?php echo $instance[ 'tab1' ][ 'tab1item3text' ]; ?></p>
							</div>
						</div>
						<?php if ( !empty( $instance[ 'tab1' ][ 'tab1item3link' ] ) ) echo '</a>'; ?>
					</li>
				</ul>

			</div>

			<div id="unit-tab-2">
				<ul class="static-boxes row">
					<li class="column col-4-12 column-left">
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item1link' ] ) ) echo '<a href="' . $instance[ 'tab2' ][ 'tab2item1link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-online-portal"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab2' ][ 'tab2item1label' ]; ?></h4>
								<p><?php echo $instance[ 'tab2' ][ 'tab2item1text' ]; ?></p>
							</div>
						</div>
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item1link' ] ) ) echo '</a>'; ?>
					</li><li class="column col-4-12 column-middle">
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item2link' ] ) ) echo '<a href="' . $instance[ 'tab2' ][ 'tab2item2link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-full-service"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab2' ][ 'tab2item2label' ]; ?></h4>
								<p><?php echo $instance[ 'tab2' ][ 'tab2item2text' ]; ?></p>
							</div>
						</div>
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item2link' ] ) ) echo '</a>'; ?>
					</li><li class="column col-4-12 column-right">
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item3link' ] ) ) echo '<a href="' . $instance[ 'tab2' ][ 'tab2item3link' ] . '">'; ?>
						<div class="sbox-item">
							<div class="icon-box">
								<span class="rdc-icon icon-honest-pricing"></span>
							</div>
							<hr/>
							<div class="content">
								<h4><?php echo $instance[ 'tab2' ][ 'tab2item3label' ]; ?></h4>
								<p><?php echo $instance[ 'tab2' ][ 'tab2item3text' ]; ?></p>
							</div>
						</div>
						<?php if( !empty( $instance[ 'tab2' ][ 'tab2item3link' ] ) ) echo '</a>'; ?>
					</li>
				</ul>
			</div>

		</div>


	</div>
</div>
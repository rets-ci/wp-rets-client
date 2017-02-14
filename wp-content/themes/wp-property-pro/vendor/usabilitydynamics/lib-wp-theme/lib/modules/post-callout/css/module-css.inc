<?php
$id_base = $this->id_base;
return '
	#'.$id_base.'-content {
		height: 255px;
		width: 98%;
	}
	
	#'.$id_base.'-search-wrap .cfp-placeholder {
		color: #AAA;
	}
	
	#'.$id_base.'-search {
		font-size: 16px;
	}
	.'.$id_base.'-loading {
		color: #999;
		padding: 50px;
		text-align: center;
	}
	
	/* Shared post summary styles */
	.'.$id_base.'-post-summary {
		background: #eee;
		border: 1px solid #ddd;
		border-color: #ccc #aaa #aaa #ccc;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		-khtml-border-radius: 5px;
		border-radius: 5px;
		min-height: 130px;
		overflow: hidden;
		padding: 10px;
		position: relative;
	}
	.'.$id_base.'-post-summary h3 {
		font-size: 14px;
		font-weight: normal;
		line-height: 100%;
		margin: 0;
		padding: 0 0 2px;
	}
	.'.$id_base.'-post-summary p.meta {
		font-size: 11px;
		color: #999;
		line-height: 100%;
		margin: 0;
		padding: 2px 0 5px;
	}
	.'.$id_base.'-post-summary .'.$id_base.'-post-content {
		font-size: 11px;
		line-height: 130%;
	}
	.'.$id_base.'-post-summary .'.$id_base.'-post-content img {
		display: block;
		margin: 5px 0;
	}

	/* Listed post summary styles */
	.'.$id_base.'-posts .'.$id_base.'-post-summary {
		display: -moz-inline-box; /* FF2 */
		display: inline-block; /* Standard. IE8+, Saf, FF3+ */
		/**
		 * @bugfix inline-block fix
		 * @see http://blog.mozilla.com/webdev/2009/02/20/cross-browser-inline-block/
		 * @valid no
		 */
		zoom: 1;
		*display: inline;
		margin: 0 10px 10px 0;
		min-height: 130px;
		vertical-align: top;
		width: 215px;
	}
	.'.$id_base.'-posts .'.$id_base.'-post-summary:hover {
		background: #fff;
	}
	.'.$id_base.'-posts .'.$id_base.'-post-summary a.select {
		bottom: 0;
		height: 100%;
		left: 0;
		overflow: hidden;
		position: absolute;
		right: 0;
		text-indent: -1000px;
		top: 0;
		width: 100%;
		background: transparent url(../img/x.gif); /* IE Hax to fix natural z-index layering */
	}
	#'.$id_base.'-post-preview-content a.select {
		display: none;
	}
	
	.'.$id_base.'-post-summary-none {
		background: #ccc;
		color: #999;
		font-size: 20px;
		margin: 0;
		padding: 60px 10px;
		text-align: center;
	}
	.'.$id_base.'-post-summary-none span {
		display: block;
		font-size: 12px;
	}
	
	/* Columns */
	.'.$id_base.'-c6-12 {
		display: inline;
		float: left;
		width: 355px;
		margin-right: 20px;
	}
	
	.'.$id_base.'-c6-34 {
		float: left;
		width: 365px;
	}
	
	#'.$id_base.'-edit-form input[disabled="disabled"], 
	#'.$id_base.'-edit-form input.disabled {
		border: 1px solid #999;
		background-color: #ddd;
	}
	
	.'.$id_base.'-module-title-wrapper input {
		font-size: 18px;
	}
	
	/* Custom content box
	----------------------------------------------------- */
	#'.$this->get_field_name('custom_values').'_fields {
		padding-top: 20px;
		clear: both;
	}
	
	#'.$this->id_base.'-image-select {
		margin-top: 12px;
	}
		
	#'.$id_base.'-post-preview-content h3.cfct-header-small,
	#'.$id_base.'-post-preview-content div.'.$id_base.'-post-content.cfct-content-small {
		font-size: .9em;
	}
	#'.$id_base.'-post-preview-content h3.cfct-header-medium,
	#'.$id_base.'-post-preview-content div.'.$id_base.'-post-content.cfct-content-medium {
		font-size: 1.2em;
	}
	#'.$id_base.'-post-preview-content h3.cfct-header-large,
	#'.$id_base.'-post-preview-content div.'.$id_base.'-post-content.cfct-content-large {
		font-size: 1.7em;
	}
	#'.$id_base.'-post-preview-content.cfct-image-left div.'.$id_base.'-post-content img {
		float: left;
	}
	#'.$id_base.'-post-preview-content.cfct-image-center div.'.$id_base.'-post-content img {
		float: none;
	}
	#'.$id_base.'-post-preview-content.cfct-image-right div.'.$id_base.'-post-content img {
		float: right;
	}
	#'.$id_base.'-post-preview-content .suppressed {
		display: none;
	}
	
	/* Image Chooser Mods
	----------------------------------------------------- */
	#'.$id_base.'-image-select,
	#'.$id_base.'-image-select .cfct-image-select-items-list {
		width:355px;
	}
	#'.$id_base.'-image-select .cfct-image-select-items-list ul li {
		float: left;
	}
';
?>
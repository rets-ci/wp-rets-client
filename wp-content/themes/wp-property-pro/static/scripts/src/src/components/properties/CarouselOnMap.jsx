import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import get from 'lodash/get';
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import { Lib }      from 'app_root/lib.jsx';
import PropertyCard from 'app_root/components/PropertyCard.jsx';
import SearchResultListingPlaceholder from 'app_root/components/properties/SearchResultListingPlaceholder.jsx';


export default class CarouselOnMap extends Component {
  static propTypes = {
    properties: PropTypes.array,
    selectedProperty: PropTypes.string,
    onChangeSlide: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.swiper = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedProperty !== this.props.selectedProperty) {
      this.slideToId(nextProps.selectedProperty);
    }
  }

  slideToId = (propertyId) => {
    const index = (this.props.properties || []).findIndex(e => get(e, '_source.post_meta.rets_mls_number[0]', null) === propertyId);
    if (this.swiper && index > -1) {
      this.swiper.slideTo(index, 0);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // after loading more props, update selected_property
    if (prevProps.properties.length !== this.props.properties.length) {
      const property = this.props.properties[ prevProps.properties.length ];
      if (property) {
        this.props.onChangeSlide(get(property, '_source.post_meta.rets_mls_number[0]', null));
      }
    }
  }

  handleSlideChange = () => {
    const { isEnd, activeIndex, previousIndex } = this.swiper;
    const property = this.props.properties[ activeIndex ];

    this.props.onChangeSlide(get(property, '_source.post_meta.rets_mls_number[0]', null));

    if (isEnd && activeIndex === previousIndex) {
      this.props.onLoadMore();
    }
  }

  render() {
    const { properties, isFetching } = this.props;
    const swiperParams = {
      loop: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 0,
      onInit: (swiper) => {
        this.swiper = swiper;
        // this.swiper.on('slideChangeEnd', this.handleSlideChange);
        this.swiper.on('transitionStart', throttle(this.handleSlideChange, 2000)); // fired twice each slide change
      }
    };

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap hidden-sm-up`}>
      { !isFetching && properties.length > 0 &&
        <Swiper {...swiperParams}>
        {
          properties.map((p, key) => {
            const item = {
              address: get(p, '_source.post_meta.rets_address', [''])[0],
              address_unit: get(p, '_source.post_meta.address_unit', ''),
              location: get(p, '_source.post_meta.wpp_location_pin', []),
              baths: get(p, '_source.post_meta.rets_total_baths', 0),
              beds: get(p, '_source.post_meta.rets_beds', 0),
              city: get(p, '_source.tax_input.location_city.location_city[0].name', ''),
              gallery_images: get(p, '_source.wpp_media', []).map((media) => media.url),
              id: p._id,
              living_area: get(p, '_source.post_meta.rets_living_area', 0),
              lots_size: get(p, '_source.post_meta.rets_lot_size_area', 0),
              price: get(p, '_source.post_meta.rets_list_price[0]', 0),
              post_name: get(p, '_source.post_name', 0),
              state: get(p, '_source.tax_input.location_state.location_state[0].name', ''),
              type: get(p, '_source.tax_input.wpp_listing_type.listing_type[0].slug', ''),
              sub_types: map(get(p, '_source.tax_input.wpp_listing_subtype.listing_sub_types', []), 'name'),
              relative_permalink: get(p, '_source.permalink', ''),
              thumbnail: get(p, '_source.post_meta.rets_thumbnail_url', [''])[0],
              zip: get(p, '_source.post_meta.rets_postal_code[0]', '')
            };

            return (
              <div className="swiper-slide" key={p._id}>
                <PropertyCard data={item} />
              </div>
            )
          })
        }
        </Swiper>
      }

      { properties.length === 0 && !isFetching &&
        <div className={`${Lib.THEME_CLASSES_PREFIX}noresults-banner`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}banner__image`}
            style={{ backgroundImage: `url(${bundle.static_images_url}no-results-banner.png)` }}
          />
          <h1 className={`${Lib.THEME_CLASSES_PREFIX}banner__title`}>
            { 'No Results' }
          </h1>
          <p className={`${Lib.THEME_CLASSES_PREFIX}banner__text`}>
            { 'Your search does not match any listings. Try zooming out or removing your filters.' }
          </p>
        </div>
      }
      { isFetching &&
        <SearchResultListingPlaceholder
          isFetching={ isFetching }
          isMobile={ true }
          onInit={ () => {} }
        />
      }
      </div>
    );
  }
};

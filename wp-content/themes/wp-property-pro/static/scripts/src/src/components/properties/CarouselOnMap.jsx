import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import _ from 'lodash';

import { Lib } from '../../lib.jsx';
import PropertyCard from '../PropertyCard.jsx';


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
    const index = (this.props.properties || []).findIndex(e => e._id === propertyId);

    if (this.swiper && index > -1) {
      this.swiper.slideTo(index);
    }
  }

  render() {
    const { properties } = this.props;

    const swiperParams = {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 0,
      runCallbacksOnInit: true,
      onInit: (swiper) => {
        this.swiper = swiper;
      },
      onSlideChangeEnd: (swiper) => {
        const property = this.props.properties[ swiper.activeIndex ];
        this.props.onChangeSlide(property._id);
      }
    };

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-wrap`}>
      { properties.length > 0 &&
        <Swiper {...swiperParams}>
        {
          properties.map((p, key) => {
            const item = {
              address: _.get(p, '_source.post_meta.rets_address', ''),
              location: _.get(p, '_source.post_meta.wpp_location_pin', []),
              baths: _.get(p, '_source.post_meta.rets_total_baths', 0),
              beds: _.get(p, '_source.post_meta.rets_beds', 0),
              city: _.get(p, '_source.tax_input.wpp_location.wpp_location_city[0].name', ''),
              gallery_images: _.get(p, '_source.wpp_media', []).map((media) => media.url),
              id: p._id,
              living_area: _.get(p, '_source.post_meta.rets_living_area', 0),
              lots_size: _.get(p, '_source.post_meta.rets_lot_size_area', 0),
              price: _.get(p, '_source.post_meta.rets_list_price[0]', 0),
              post_name: _.get(p, '_source.post_name', 0),
              post_type: _.get(p, '_source.tax_input.rets_property_type.rets_property_type[0].name', ''),
              type: _.get(bundle, 'property_types.'+_.get(p, '_source.tax_input.rets_property_type.rets_property_type[0].slug', ''), 'Other'),
              relative_permalink: _.get(p, '_source.permalink', ''),
              thumbnail: _.get(p, '_source.post_meta.rets_thumbnail_url', ''),
              zip: _.get(p, '_source.post_meta.rets_postal_code[0]', '')
            };
            return (
              <div className="swiper-slide" key={key}>
                <PropertyCard data={item} listType={Lib.PROPERTIES_LIST_CAROUSEL} />
              </div>
            )
          })
        }
        </Swiper>
      }
      </div>
    );
  }
};

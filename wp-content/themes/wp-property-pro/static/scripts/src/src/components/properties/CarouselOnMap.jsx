import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Lib } from '../../lib.jsx';
import Swiper from '../Swiper.jsx';
import PropertyCard from '../PropertyCard.jsx';


export default class CarouselOnMap extends Component {
  static propTypes = {
    properties: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(function() {
      this.swiper = Swiper.init(this.swiperElement, {
        nextButton: this.swiperElementNext,
        prevButton: this.swiperElementPrev,
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
      });  
    }, 1000);
  }

  render() {
    const { properties } = this.props;

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "listing-carousel-container"}>
        {
          properties.length > 0
          ? (<div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel`}>
              <div className={`swiper-container ${Lib.THEME_CLASSES_PREFIX}listing-carousel-container`}
                   ref={(r) => this.swiperElement = r}>
                <div className="swiper-wrapper">
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
                        <PropertyCard data={item} listType={Lib.PROPERTIES_LIST_CAROUSEL} key={key}/>
                      )
                    })
                  }
                </div>
              </div>
            </div>)
          : null
        }
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-control-nav text-center`}>
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}prev-nav mr-3 rounded-circle`}
             ref={(r) => this.swiperElementPrev = r}><i
            className="fa fa-angle-left"></i></a>
          <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}next-nav rounded-circle`}
             ref={(r) => this.swiperElementNext = r}><i
            className="fa fa-angle-right"></i></a>
        </div>
      </div>
    );
  }
};

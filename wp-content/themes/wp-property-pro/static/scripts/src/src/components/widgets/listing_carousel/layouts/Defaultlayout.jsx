import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import renderHTML from 'react-render-html';
import get from 'lodash/get';

import PropertyCard from 'app_root/components/PropertyCard.jsx';
import { Lib }      from 'app_root/lib.jsx';


export default class DefaultLayout extends Component {

  static propTypes = {
    item: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.swiper = null;
  }

  handleNavigation(direction) {
    if (direction === 'next') {
      this.swiper.slideNext();
    } else if (direction === 'prev') {
      this.swiper.slidePrev();
    }
  }

  next = () => {
    this.slider.slickNext()
  }

  previous = () => {
    this.slider.slickPrev()
  }

  handlePrevClick = (e) => {
    e.preventDefault();
    this.swiper.slidePrev();
  }

  handleNextClick = (e) => {
    e.preventDefault();
    this.swiper.slideNext();
  }

  render() {
    let { item } = this.props;
    let posts = get(item, 'posts', []);

    const swiperParams = {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 20,
      breakpoints: {
        1200: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 1,
        }
      },
      onInit: (swiper) => {
        this.swiper = swiper;
      },
    };

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel-container`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel-info mx-auto text-center`}>
          { get(item, 'title', null)
            ? <h3 className="mx-auto">{renderHTML(get(item, 'title'))}</h3>
            : null
          }
          { get(item, 'subtitle', null)
            ? <p>{renderHTML(get(item, 'subtitle'))}</p>
            : null
          }
        </div>

        { posts.length > 0 &&
          <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel`}>
            <Swiper {...swiperParams}>
            { posts.map(post =>
              <div className="swiper-slide" key={post.post_name}>
                <PropertyCard data={post} />
              </div>
            )}
            </Swiper>
          </div>
        }
        { posts.length > 0 &&
          <div className={`${Lib.THEME_CLASSES_PREFIX}listing-control-nav text-center`}>
            <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-prev mr-3 rounded-circle`}
               onClick={this.handlePrevClick}>
              <i className="fa fa-angle-left"></i>
            </a>
            <a href="#" className={`${Lib.THEME_CLASSES_PREFIX}nav-next rounded-circle`}
               onClick={this.handleNextClick}>
              <i className="fa fa-angle-right"></i>
            </a>
          </div>
        }
      </div>  
    );
  }
};

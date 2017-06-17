import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import PropertyCard from '../../../PropertyCard.jsx';
import Swiper from '../../../Swiper.jsx';
import {Lib} from '../../../../lib.jsx';
import _ from 'lodash';

export default class DefaultLayout extends Component {
  static propTypes = {
    item: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.swiper = Swiper.init(this.swiperElement, {
      // centeredSlides: window.innerWidth >= Lib.MOBILE_WIDTH,
      slidesPerView: 5,
      nextButton: this.swiperElementNext,
      prevButton: this.swiperElementPrev,
      spaceBetween: 20
    });
  }

  render() {
    let {
      item
    } = this.props;
    let posts = _.get(item, 'posts', []);
    return (
      <div className="row">
        <div className={Lib.THEME_CLASSES_PREFIX + "listing-carousel-container"}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel-info mx-auto text-center`}>
            {
              _.get(item, 'title', null)
                ? <h3 className="mx-auto">{_.get(item, 'title')}</h3>
                : null
            }
            {
              _.get(item, 'subtitle', null)
                ? <p>{_.get(item, 'subtitle')}</p>
                : null
            }
          </div>
          {
            posts.length
              ?
              <div className={`${Lib.THEME_CLASSES_PREFIX}listing-carousel mx-auto`}>
                <div className={`swiper-container ${Lib.THEME_CLASSES_PREFIX}listing-carousel-container`}
                     ref={(r) => this.swiperElement = r}>
                  <div className="swiper-wrapper">
                    {
                      posts.map((post, key) => {
                        return (
                          <PropertyCard data={post} listType={Lib.PROPERTIES_LIST_CAROUSEL} key={key}/>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
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
      </div>
    );
  }
};

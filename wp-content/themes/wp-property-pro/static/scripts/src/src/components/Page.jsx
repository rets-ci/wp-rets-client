import {openFormModal, openLocationModal} from '../actions/index.jsx';
import HeaderDefault from './Headers/HeaderDefault.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Masthead from './widgets/masthead/Masthead.jsx';
import Callout from './widgets/callout/Callout.jsx';
import Testimonials from './widgets/testimonials/Testimonials.jsx';
import {Lib} from '../lib.jsx';
import ListingCarousel from './widgets/listing_carousel/ListingCarousel.jsx';
import FormModals from './Modals/FormModals/Index.jsx';;
import Subnavigation from './widgets/subnavigation/Subnavigation.jsx';
import Tour from './widgets/tour/Tour.jsx';
import Single from './blog/Single.jsx';
import GuideSingle from './guide/Single.jsx';
import get from 'lodash/get';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLocationModal: () => {
      dispatch(openLocationModal(false));
    },

    openFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    }
  }
};

class Page extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    openFormModal: PropTypes.func.isRequired,
    openUserPanel: PropTypes.func.isRequired,
    post: PropTypes.object,
    rows: PropTypes.array
  };

  render() {
    let {
      closeLocationModal,
      formModalOpen,
      history,
      openFormModal,
      openLoginModal,
      openUserPanel,
      post,
      rows
    } = this.props;
    if (get(this.props, 'post.is_blog_single', null)) {
      return <Single post={get(this.props, 'post', {})}/>
    }

    if (get(this.props, 'post.is_guide_single', null)) {
      return <GuideSingle post={get(this.props, 'post', {})}/>
    }
    return (
      <div>
        <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-default row no-gutters`}>
          <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal} />
        </section>
        <div className={`${Lib.THEME_CLASSES_PREFIX}page-content row no-gutters`}>
          {
            rows.map((row) => {
              let cells = get(row, 'cells', []);

              return cells.map(((cell) => {
                    switch (get(cell, 'widget.panels_info.class', '')) {
                      case 'Property_Pro_Masthead_Widget':
                        return <Masthead closeLocationModal={closeLocationModal} widget_cell={cell}/>;
                        break;
                      case 'Property_Pro_Subnavigation_Widget':
                        return <Subnavigation currentUrl={get(this.props, 'post.post_url', '')} post_title={post.post_title} widget_cell={cell} />;
                        break;
                      case 'Property_Pro_Tour_Widget':
                        return <Tour browserHistoryPush={history.push} openFormModal={openFormModal} widget_cell={cell}/>;
                        break;
                      case 'Property_Pro_Listing_Carousel_Widget':
                        return <ListingCarousel widget_cell={cell}/>;
                        break;
                      case 'Property_Pro_Callout_Widget':
                        return <Callout widget_cell={cell}/>;
                        break;
                      case 'Property_Pro_Testimonials_Widget':
                        return <Testimonials widget_cell={cell}/>;
                        break;
                    }
                  }
                )
              )
            })
          }
          <FormModals />
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);

import {openFormModal} from '../actions/index.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
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
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    }
  }
};

class Page extends Component {
  static propTypes = {
    openFormModal: PropTypes.func.isRequired,
    property_search_options: PropTypes.object.isRequired,
    post: PropTypes.object,
    rows: PropTypes.array
  };

  render() {

    if (_.get(this.props, 'post.is_blog_single', null)) {
      return <Single post={_.get(this.props, 'post', {})}/>
    }

    if (_.get(this.props, 'post.is_guide_single', null)) {
      return <GuideSingle post={_.get(this.props, 'post', {})}/>
    }

    let {
      formModalOpen,
      openFormModal,
      property_search_options,
      post,
      rows
    } = this.props;
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}page-content row no-gutters`}>
        {
          rows.map((row) => {
            let cells = _.get(row, 'cells', []);

            return cells.map(((cell) => {
                  switch (_.get(cell, 'widget.panels_info.class', '')) {
                    case 'Property_Pro_Masthead_Widget':
                      return <Masthead property_search_options={property_search_options} widget_cell={cell}/>;
                      break;
                    case 'Property_Pro_Subnavigation_Widget':
                      return <Subnavigation post_title={post.post_title} widget_cell={cell} currentUrl={_.get(this.props, 'post.post_url', '')}/>;
                      break;
                    case 'Property_Pro_Tour_Widget':
                      return <Tour browserHistoryPush={browserHistory.push} openFormModal={openFormModal} widget_cell={cell}/>;
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
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);

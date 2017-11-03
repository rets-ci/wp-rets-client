import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Sticky from 'react-sticky-state';

import { Lib } from 'app_root/lib.jsx';
import RequestButtons from 'app_root/components/PropertySingle/components/RequestButtons.jsx';

class StickyCard extends Component {

  render() {
    const {
      isMobile,
      fromMapView,
      agent,
      listingOffice,
    } = this.props;

    const isFullWidth = fromMapView || isMobile;

    let containerClass = `sticky sticky-at-top ${Lib.THEME_CLASSES_PREFIX}sticky-container`;
    if (isFullWidth) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}full-width`;
    }

    return (
      <Sticky>
        <div className={ containerClass }>
        {isFullWidth &&
          <div className="container">
            <RequestButtons
              saleTypeWithRDC={ this.props.saleTypeWithRDC}
              saleType={ this.props.saleType }
              onClick={ this.props.onClickRequestBtn }
            />
          </div>
        }
        {!isFullWidth &&
          <div className="container"><div className="row"><div className="col-lg-4 offset-lg-8">
            <div className={ `${Lib.THEME_CLASSES_PREFIX}agent-card d-flex flex-column align-items-center` }>
              <div
                className={ `${Lib.THEME_CLASSES_PREFIX}agent-avatar` }
                style={{ backgroundImage: `url(${agent.image})`}}
              />
              <div className={ `${Lib.THEME_CLASSES_PREFIX}agent-name` }>
                { agent.name }
              </div>
              <div className={ `${Lib.THEME_CLASSES_PREFIX}agent-company` }>
                { listingOffice }
              </div>
              <div className={ `${Lib.THEME_CLASSES_PREFIX}agent-phone` }>
                { agent.phone }
              </div>
              <RequestButtons
                saleTypeWithRDC={ this.props.saleTypeWithRDC}
                saleType={ this.props.saleType }
                onClick={ this.props.onClickRequestBtn }
              />
            </div>
          </div></div></div>
        }
        </div>
      </Sticky>
    );
  }
}

StickyCard.propTypes = {
  isMobile: PropTypes.bool,
  fromMapView: PropTypes.bool,
  agent: PropTypes.object,
  listingOffice: PropTypes.string,
  saleType: PropTypes.string,
  saleTypeWithRDC: PropTypes.string,
  onClickRequestBtn: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    isMobile: state.viewport.isMobile,
  }
};

export default connect(mapStateToProps)(StickyCard);

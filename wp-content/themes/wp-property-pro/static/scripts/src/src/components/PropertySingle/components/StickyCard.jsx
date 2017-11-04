import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-sticky-state';

import { Lib } from 'app_root/lib.jsx';
import RequestButtons from 'app_root/components/PropertySingle/components/RequestButtons.jsx';

class StickyCard extends Component {

  render() {
    const {
      agent,
      listingOffice,
      isAgentShown,
    } = this.props;

    let containerClass = `sticky sticky-at-top ${Lib.THEME_CLASSES_PREFIX}sticky-container`;

    if (!isAgentShown) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}agent-hidden`;
    }

    return (
      <Sticky>
        <div className={ containerClass }>
          { !isAgentShown &&
            <div className="container">
              <RequestButtons
                saleTypeWithRDC={ this.props.saleTypeWithRDC}
                saleType={ this.props.saleType }
                onClick={ this.props.onClickRequestBtn }
              />
            </div>
          }
          { isAgentShown &&
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
          }
        </div>
      </Sticky>
    );
  }
}

StickyCard.propTypes = {
  isAgentShown: PropTypes.bool,
  agent: PropTypes.object,
  listingOffice: PropTypes.string,
  saleType: PropTypes.string,
  saleTypeWithRDC: PropTypes.string,
  onClickRequestBtn: PropTypes.func,
};

export default StickyCard;

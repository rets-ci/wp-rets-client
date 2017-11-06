import React, { Component } from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

import { Lib } from 'app_root/lib.jsx';
import { deselectPropertyOnMap } from 'app_root/actions/index.jsx';
import PropertySingle from 'app_root/components/PropertySingle/PropertySingle.jsx';
import Util from 'app_root/components/Util.jsx';


class PropertyPanelOnMap extends Component {

  handleClose = () => {
    this.props.deselectPropertyOnMap();
  }

  handleOpen = () => {
    if (this.props.historyPush && this.props.property) {
      const link = '/' + bundle.property_single_url + '/' + this.props.property.post_name;
      // this.props.historyPush(link);
      window.open(link, '_blank');
    }
  }

  render() {
    const { agents, property, isVisible } = this.props;

    let propertyMeta = {};
    if ( property ) {
      propertyMeta = Util.transformPropertyMeta(property);
    }

    let containerClass = `${Lib.THEME_CLASSES_PREFIX}panel-on-map`;
    if (isVisible) {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}display`;
    } else {
      containerClass += ` ${Lib.THEME_CLASSES_PREFIX}hide`;
    }

    return (
      <div className={containerClass}>
      { property
        ? <PropertySingle
            agents={agents}
            curatedPropertyInfo={propertyMeta}
            elasticSearchSource={property}
            fromMapView={true}
          />
        : <div className={Lib.THEME_CLASSES_PREFIX + "single-container"}></div>
      }
      { isVisible &&
        <span className={`${Lib.THEME_CLASSES_PREFIX}panel-on-map-close d-flex justify-content-center align-items-center`}
          onClick={this.handleClose}
        >
          <i className="fa fa-close"></i>
        </span>
      }
      { isVisible &&
        <span className={`${Lib.THEME_CLASSES_PREFIX}panel-on-map-open d-flex justify-content-center align-items-center`} 
          onClick={this.handleOpen}
        >
          <i className="fa fa-external-link"></i>
        </span>
      }
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deselectPropertyOnMap: (property) => {
      dispatch(deselectPropertyOnMap(property));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyPanelOnMap);

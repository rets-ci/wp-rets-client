import React, { Component } from 'react';
import PropTypes from 'prop-types';
import scrollToElement from 'scroll-to-element';
import get from 'lodash/get';

import { Lib }              from 'app_root/lib.jsx';
import htmlHelper           from 'app_root/helpers/htmlHelper';
import propertyHelper       from 'app_root/helpers/propertyHelper';
import FormFetcher          from 'app_root/components/Forms/FormFetcher.jsx';
import PropertiesModal      from 'app_root/components/Modals/PropertiesModal.jsx';

import PropertyCarousel   from 'app_root/components/PropertySingle/components/Carousel.jsx';
import PropertyMasthead   from 'app_root/components/PropertySingle/components/Masthead.jsx';
import PropertyOverview   from 'app_root/components/PropertySingle/components/Overview.jsx';
import PropertyHighlights from 'app_root/components/PropertySingle/components/Highlights.jsx';
import AttributeTabs      from 'app_root/components/PropertySingle/components/AttributeTabs.jsx';
import ListingProvider    from 'app_root/components/PropertySingle/components/ListingProvider.jsx';
import AgentContactForms  from 'app_root/components/PropertySingle/components/AgentContactForms.jsx';
import StickyCard         from 'app_root/components/PropertySingle/components/StickyCard.jsx';


class Single extends Component {

  constructor(props) {
    super(props);

    this.state = {
      contactFormTab: null
    };
  }

  componentWillReceiveProps(nextProps) {
    var previous_mlsId = get(this.props, 'curatedPropertyInfo.mlsId');
    var next_mlsId = get(nextProps, 'curatedPropertyInfo.mlsId');

    if (previous_mlsId !== next_mlsId) {
      // on map view, when new property card is selected, scroll to top on panel
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
      const node = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}image-mixer`);
      htmlHelper.scrollToElement(container, node, 500);
    }
  }

  handleRequestBtnClick = tab => {
    // scroll-to-element library doesn't work well on map view
    if (this.props.fromMapView) {
      const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
      const node = document.getElementById('agentCardContainer');
      htmlHelper.scrollToElement(container, node, 500);
    } else {
      scrollToElement('#agentCardContainer', { duration: 500 });
    }

    this.setState({ contactFormTab: tab });
  }

  render() {
    let {
      agents,
      elasticSearchSource,
      curatedPropertyInfo,
      fromMapView,
    } = this.props;

    const gridWidth = fromMapView ? 'col-12' : 'col-lg-8';

    const dataForContactForm = propertyHelper.getContactFormData(curatedPropertyInfo, agents);

    const saleType = get(curatedPropertyInfo, 'listing_status_sale', '').replace('for-', '');

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-container` }>

        <PropertyCarousel
          images={ curatedPropertyInfo.images || [] }
        />

        <section className={ `${Lib.THEME_CLASSES_PREFIX}single-sticky-container` }>
          <PropertyMasthead
            curatedPropertyInfo={ curatedPropertyInfo }
            gridWidth={ gridWidth }
          />

          <StickyCard
            fromMapView={ fromMapView }
            onClickRequestBtn={ this.handleRequestBtnClick }
            saleType={ saleType }
            {
              ...dataForContactForm
            }
          />

          <div className="container py-5"><div className="row"><div className={ gridWidth }>
            <PropertyOverview
              curatedPropertyInfo={ curatedPropertyInfo }
              fromMapView={ fromMapView }
            />

            <PropertyHighlights
              curatedPropertyInfo={ curatedPropertyInfo }
              fromMapView={ fromMapView }
            />

            <AttributeTabs
              curatedPropertyInfo={ curatedPropertyInfo }
              esProperty={ elasticSearchSource }
            />

            <ListingProvider
              curatedPropertyInfo={ curatedPropertyInfo }
              fromMapView={ fromMapView }
            />
          </div></div></div>
        </section>

        <div id="agentCardContainer" className="mb-5" ref={(r) => this.contactFormContainer = r}>
          <AgentContactForms
            tabActive={ this.state.contactFormTab }
            curatedPropertyInfo={ curatedPropertyInfo }
            {
              ...dataForContactForm
            }
          />
        </div>
      </div>
    );
  }
}

Single.propTypes = {
  agents: PropTypes.array,
  fromMapView: PropTypes.bool,
  elasticSearchSource: PropTypes.object,
  curatedPropertyInfo: PropTypes.object,
};

export default Single;
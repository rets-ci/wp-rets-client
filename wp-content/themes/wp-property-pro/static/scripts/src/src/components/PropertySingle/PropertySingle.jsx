import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scrollToElement from 'scroll-to-element';
import get from 'lodash/get';

import { Lib }              from 'app_root/lib.jsx';
import htmlHelper           from 'app_root/helpers/htmlHelper';
import { getContactFormData }       from 'app_root/helpers/propertyHelper';
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

    const {
      agents,
      curatedPropertyInfo,
    } = this.props;

    const contactFormData = getContactFormData(curatedPropertyInfo, agents);

    console.debug('RDC agents:', agents);
    console.debug('[PropertySingle agent picked] constructor', contactFormData.agent);
    console.debug('Sale Types:', curatedPropertyInfo.sale_types);
    console.debug('Listing Office:', curatedPropertyInfo.listing_office);
    

    this.state = {
      contactFormTab: null,
      contactFormData,
    };
  }

  componentWillReceiveProps(nextProps) {
    const previous_mlsId = get(this.props, 'curatedPropertyInfo.mlsId');
    const next_mlsId = get(nextProps, 'curatedPropertyInfo.mlsId');
    const isNewProperty = previous_mlsId !== next_mlsId;

    // @event: new property is coming in...
    if (isNewProperty) {
      // on map view, scroll to top on panel
      this.scrollToTop();

      // update contact form data (focused to update agent matching)
      this.setContactFormData(nextProps);
    }
  }

  setContactFormData = (props) => {
    const contactFormData = getContactFormData(props.curatedPropertyInfo, props.agents);
    this.setState({
      contactFormTab: null,
      contactFormData
    });
    console.debug('[PropertySingle agent picked] for new property', contactFormData.agent);
  }

  handleRequestBtnClick = tab => {
    // scroll-to-element library doesn't work well on map view
    if (this.props.fromMapView) {
      this.scrollToContactForm();
    } else {
      scrollToElement('#agent-contact-form', { duration: 500 });
    }

    this.setState({ contactFormTab: tab });
  }

  scrollToTop = () => {
    const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
    const node = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}image-mixer`);
    htmlHelper.scrollToElement(container, node, 500);
  }

  scrollToContactForm = () => {
    const container = document.querySelector(`.${Lib.THEME_CLASSES_PREFIX}single-container`);
    const node = document.getElementById('agent-contact-form');
    htmlHelper.scrollToElement(container, node, 500);
  }

  render() {
    let {
      agents,
      elasticSearchSource,
      curatedPropertyInfo,
      fromMapView,
      viewport,
    } = this.props;

    const { contactFormTab, contactFormData } = this.state;

    const gridWidth = fromMapView ? 'col-12' : 'col-12 col-lg-8';

    const isAgentHiddenOnSticky = fromMapView || (viewport.windowWidth <= Lib.SINGLE_PAGE_STICKY_THRESHOLD);
    const isAgentShownOnSticky = !isAgentHiddenOnSticky;
    const isNarrowAttrTabs = fromMapView || viewport.isMobile;

    let scrollingContent = (
      <div className={ gridWidth }>
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
          isOneColumn={ isNarrowAttrTabs }
        />
      </div>
    );

    let stickyContent = (
      <StickyCard
        isAgentShown={ isAgentShownOnSticky }
        onClickRequestBtn={ this.handleRequestBtnClick }
        { ...contactFormData }
      />
    )

    return (
      <div className={ `${Lib.THEME_CLASSES_PREFIX}single-container` }>

        <PropertyCarousel
          images={ curatedPropertyInfo.images || [] }
          viewport={ viewport }
          fromMapView={ fromMapView }
        />

        <PropertyMasthead
          curatedPropertyInfo={ curatedPropertyInfo }
          gridWidth={ gridWidth }
        />

        <section className={ `${Lib.THEME_CLASSES_PREFIX}single-scrolling-container` }>
          { isAgentShownOnSticky &&
            <div className="container py-5">
              <div className="row">
                { scrollingContent }
                <div className="col-lg-4">
                  { stickyContent }
                </div>
              </div>
            </div>
          }
          { isAgentHiddenOnSticky && stickyContent }
          { isAgentHiddenOnSticky &&
            <div className="container py-5"><div className="row">
              { scrollingContent }
            </div></div>
          }
        </section>

        <div id="agent-contact-form">
          <AgentContactForms
            tabActive={ contactFormTab }
            curatedPropertyInfo={ curatedPropertyInfo }
            { ...contactFormData }
          />
        </div>

        <ListingProvider
          curatedPropertyInfo={ curatedPropertyInfo }
          fromMapView={ fromMapView }
        />
      </div>
    );
  }
}

Single.propTypes = {
  agents: PropTypes.array,
  fromMapView: PropTypes.bool,
  viewport:   PropTypes.object,
  elasticSearchSource: PropTypes.object,
  curatedPropertyInfo: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    viewport: state.viewport,
  }
};

export default connect(mapStateToProps)(Single);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { Lib }      from 'app_root/lib.jsx';
import { getContactFormTabFeeder }       from 'app_root/helpers/propertyHelper';
import FormFetcher  from 'app_root/components/Forms/FormFetcher.jsx';
import JSONSchemaFormContainer
  from 'app_root/components/Forms/JSONSchemaFormContainer.jsx';

let formIdMapper = {
  'request-showing-rent'    : 'form-rent-inquiry',
  'request-showing-sale'    : 'form-buy-inquiry-listing',
  'request-information-sale': 'form-buy-inquiry-listing',
  'request-application'     : 'form-rent-application',
};


class AgentContactForms extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: null
    };
  }

  componentDidMount() {
    let initialTab = this.getInitialTab(this.props.saleTypeWithRDC);
    this.selectTab(initialTab);
    console.debug('[AgentContactForms tab] componentDidMount', initialTab);
  }

  componentWillReceiveProps(nextProps) {
    const previous_mlsId = get(this.props, 'curatedPropertyInfo.mlsId');
    const next_mlsId = get(nextProps, 'curatedPropertyInfo.mlsId');
    const isNewProperty = previous_mlsId !== next_mlsId;

    if (nextProps.tabActive !== null) {
      this.selectTab(nextProps.tabActive);
      console.debug('[AgentContactForms tab] from buttons', nextProps.tabActive);
    }

    if (isNewProperty) {
      let initialTab = this.getInitialTab(nextProps.saleTypeWithRDC);
      this.selectTab(initialTab);
      console.debug('[AgentContactForms tab] for new property', initialTab);
    }
  }

  getInitialTab = (saleTypeWithRDC) => {
    let tab;
    switch (saleTypeWithRDC) {
      case 'rentRDC':
        tab = 'request-showing-rent';
        break;
      case 'saleRDC':
        tab = 'request-showing-sale';
        break;
      case 'saleNotRdc':
        tab = 'request-showing-sale';
        break;
    }
    return tab;
  }

  selectTab = name => {
    this.setState({ selectedTab: name });
  }

  render() {
    let {
      agent,
      listingOffice,
      saleTypeWithRDC,
      curatedPropertyInfo: {
        mlsId,
        post_title,
        officePhoneNumber,
      },
    } = this.props;

    const { selectedTab } = this.state;

    const getInitialFormData = getContactFormTabFeeder(post_title, mlsId);

    let formContent;

    switch (saleTypeWithRDC) {
      case 'rentRDC': {
        formContent = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-rent' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-showing-rent')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-application' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-application')}}>Request Application</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-content`}>
              <FormFetcher formId={formIdMapper[selectedTab]}>
                <JSONSchemaFormContainer formData={getInitialFormData(selectedTab)} jsonSchemaForm={this.props.jsonSchemaForm} showConfirmation={true} />
              </FormFetcher>
            </div>
          </div>
        );
        break;
      }
      case 'rentNOTRdc': {
        formContent = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-content`}>
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-description`}>Please contact {agent.name} at {listingOffice} direct by phone at {agent.phone}. You may also reach {listingOffice} by phone at {officePhoneNumber}. </p>
          </div>
        )
        break;
      }
      case 'saleRDC': {
        formContent = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-content`}>
              <FormFetcher formId={formIdMapper[selectedTab]}>
                <JSONSchemaFormContainer formData={getInitialFormData(selectedTab)} showConfirmation={true} jsonSchemaForm={this.props.jsonSchemaForm} />
              </FormFetcher>
            </div>
          </div>
        );
        break;
      }
      case 'saleNotRdc': {
        formContent = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form-content`}>
              <FormFetcher formId={formIdMapper['request-showing-sale']}>
                <JSONSchemaFormContainer formData={getInitialFormData(selectedTab)} showConfirmation={true}  />
              </FormFetcher>
            </div>
          </div>
        );
      }
      default:
    }

    return (
      <div className="container"><div className="row"><div className="col-md-12">
        <div className={`${Lib.THEME_CLASSES_PREFIX}agent-contact-form`}>

          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card`}>
            <div className="media">
              <img className={`d-flex align-self-start mr-4 ${Lib.THEME_CLASSES_PREFIX}agent-photo`}
                src={ agent.image }
                alt="Agent photo"
                width="100"
              />
              <div className={`media-body ${Lib.THEME_CLASSES_PREFIX}agent-card-content`}>
                <h5>
                  { agent.name }
                </h5>
                <p>
                  { listingOffice }
                </p>
                <div>
                  { agent.phone }
                </div>
              </div>
            </div>
          </div>

          {
            formContent
          }
        </div>
      </div></div></div>
    );
  }
}

AgentContactForms.propTypes = {
  agent: PropTypes.object,
  saleTypeWithRDC: PropTypes.string,
  listingOffice: PropTypes.string,
  tabActive: PropTypes.string,
};

export default AgentContactForms;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Lib }      from 'app_root/lib.jsx';
import FormFetcher  from 'app_root/components/Forms/FormFetcher.jsx';
import JSONSchemaFormContainer
  from 'app_root/components/Forms/JSONSchemaFormContainer.jsx';


let formIdMapper = {
  'request-showing-rent'    : 'form-rent-inquiry',
  'request-showing-sale'    : 'form-buy-inquiry-listing',
  'request-information-sale': 'form-buy-inquiry-listing',
  'request-application'     : 'form-rent-application',
};


let initialFormDataGetter = (address, mlsId) => {
  return (selectedTab) => {
    let obj = {
      'request-information-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'm interested in ${address} (MLS ${mlsId})`
      },
      'request-showing-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'd like to schedule a showing for ${address} (MLS ${mlsId})`
      },
      'request-showing-rent': {
        'powf_7e1aec73bc16e61180e9c4346bace2d4': `I'd like to schedule a showing for ${address} (MLS ${mlsId})`
      }
    };
    return obj[selectedTab] || {};
  }
};

class AgentContactForms extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: null
    };
  }

  componentDidMount() {
    let initialTab;

    switch (this.props.saleTypeWithRDC) {
      case 'rentRDC':
        initialTab = 'request-showing-rent';
        break;
      case 'saleRDC':
        initialTab = 'request-showing-sale';
        break;
      case 'saleNotRdc':
        initialTab = 'request-showing-sale';
        break;
    }

    this.selectTab(initialTab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tabActive !== null) {
      this.selectTab(nextProps.tabActive);
    }
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
        address,
        officePhoneNumber,
      },
    } = this.props;

    const { selectedTab } = this.state;

    const getInitialFormData = initialFormDataGetter(address, mlsId);

    let formContent;

    switch (saleTypeWithRDC) {
      case 'rentRDC': {
        formContent = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-rent' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.selectTab('request-showing-rent')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-application' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.selectTab('request-application')}}>Request an Application</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
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
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-card-description`}>Please contact {agent.name} at {listingOffice} direct by phone at {agent.phone}. You may also reach {listingOffice} by phone at {officePhoneNumber}. </p>
          </div>
        )
        break;
      }
      case 'saleRDC': {
        formContent = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
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
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.selectTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
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

          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-head`}>
            <div className="media">
              <img className={`d-flex align-self-start mr-3 ${Lib.THEME_CLASSES_PREFIX}agent-photo`}
                src={ agent.image }
                alt="Agent photo"
                width="100"
              />
              <div className={`media-body ${Lib.THEME_CLASSES_PREFIX}media-body`}>
                <h5 className="mt-0">
                  { agent.name }
                </h5>
                <p className={`${Lib.THEME_CLASSES_PREFIX}primary-color ${Lib.THEME_CLASSES_PREFIX}secondary-text`}>
                  { listingOffice }
                </p>
                <div className={`${Lib.THEME_CLASSES_PREFIX}phone-number`}>
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

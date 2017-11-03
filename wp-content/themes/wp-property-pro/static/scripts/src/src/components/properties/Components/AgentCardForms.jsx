import FormFetcher from '../../Forms/FormFetcher.jsx';import {Lib} from '../../../lib.jsx';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Util from '../../Util.jsx';

let formIdMapper = {
  'request-showing-rent': 'form-rent-inquiry',
  'request-showing-sale': 'form-buy-inquiry-listing',
  'request-information-sale': 'form-buy-inquiry-listing',
  'request-application': 'form-rent-application',
};


let initialFormData = (post_title, mlsId) => {
  return (selectedTab) => {
    let obj = {
      'request-information-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'm interested in ${post_title} (MLS ${mlsId})`
      },
      'request-showing-sale': {
        'powf_b62d13821a12e61180e4fc15b428cd78': `I'd like to schedule a showing for ${post_title} (MLS ${mlsId})`
      },
      'request-showing-rent': {
        'powf_7e1aec73bc16e61180e9c4346bace2d4': `I'd like to schedule a showing for ${post_title} (MLS ${mlsId})`
      }
    };
    return obj[selectedTab] || {};
  }
};

class AgentCardForms extends Component {
  static propTypes = {
    agent: PropTypes.object,
    address: PropTypes.string,
    correctScenario: PropTypes.string.isRequired,
    officePhoneNumber: PropTypes.string.isRequired,
    listingOffice: PropTypes.string,
    mlsId: PropTypes.string,
    rdcListing: PropTypes.bool.isRequired,
    saleType: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let initialTab = this.getInitialTab(this.props.correctScenario);
    this.setTab(initialTab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.correctScenario !== this.props.correctScenario) {
      let initialTab = this.getInitialTab(nextProps.correctScenario);
      this.setTab(initialTab);
    }
  }

  getInitialTab(correctScenario) {
    let tab;
    switch (correctScenario) {
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

  setTab = name => {
    this.props.setAgentCardTab(name);
  }

  render() {
    let {
      address,
      agent,
      correctScenario,
      officePhoneNumber,
      listingOffice,
      post_title,
      mlsId,
      selectedTab,
      setAgentCardTab
    } = this.props;
    let defaultAgentImage = `${bundle.static_images_url}user-placeholder-image.png`;
    let contactElement;
    switch(correctScenario) {
      case 'rentRDC': {
        let formData = initialFormData(post_title, mlsId);
        contactElement = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-rent' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-showing-rent')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-application' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-application')}}>Request an Application</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
              <FormFetcher formId={formIdMapper[selectedTab]}>
                <JSONSchemaFormContainer formData={formData(selectedTab)} jsonSchemaForm={this.props.jsonSchemaForm} showConfirmation={true} />
              </FormFetcher>
            </div>
          </div>
        );
        break;
      }
      case 'rentNOTRdc': {
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-card-description`}>Please contact {agent.name} at {listingOffice} direct by phone at {agent.phone}. You may also reach {listingOffice} by phone at {officePhoneNumber}. </p>
          </div>
        )
        break;
      }
      case 'saleRDC': {
        let formData = initialFormData(post_title, mlsId);
        contactElement = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
              <FormFetcher formId={formIdMapper[selectedTab]}>
                <JSONSchemaFormContainer formData={formData(selectedTab)} showConfirmation={true} jsonSchemaForm={this.props.jsonSchemaForm} />
              </FormFetcher>
            </div>
          </div>
        );
        break;
      }
      case 'saleNotRdc': {
        let formData = initialFormData(post_title, mlsId);
        contactElement = (
          <div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-tabs d-flex`}>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-showing-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-showing-sale')}}>Request Showing</a>
              </div>
              <div className={`col-6 ${Lib.THEME_CLASSES_PREFIX}tab ${selectedTab === 'request-information-sale' ? Lib.THEME_CLASSES_PREFIX + 'tab-selected' : null}`}>
                <a href="#" onClick={(event) => { event.preventDefault(); this.props.setAgentCardTab('request-information-sale')}}>Request Information</a>
              </div>
            </div>
            <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
              <FormFetcher formId={formIdMapper['request-showing-sale']}>
                <JSONSchemaFormContainer formData={formData(selectedTab)} showConfirmation={true}  />
              </FormFetcher>
            </div>
          </div>
        );
      }
      default:
        
    }

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-head`}>
          <div className="media">
            <img className={`d-flex align-self-start mr-3 ${Lib.THEME_CLASSES_PREFIX}agent-photo`} src={agent.image || defaultAgentImage} alt="Agent photo" width="100" />
              <div className={`media-body ${Lib.THEME_CLASSES_PREFIX}media-body`}>
                <h5 className="mt-0">{agent.name}</h5>
                <p className={`${Lib.THEME_CLASSES_PREFIX}primary-color ${Lib.THEME_CLASSES_PREFIX}secondary-text`}>{listingOffice}</p>
                <div className={`${Lib.THEME_CLASSES_PREFIX}phone-number`}>
                  {this.props.agent.phone}
                </div>
              </div>
          </div>
        </div>
        {contactElement}
      </div>
    );
  }
}

export default AgentCardForms;
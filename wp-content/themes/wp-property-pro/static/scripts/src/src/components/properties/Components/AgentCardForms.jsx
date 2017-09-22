import FormFetcher from '../../Forms/FormFetcher.jsx';import {Lib} from '../../../lib.jsx';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Util from '../../Util.jsx';

let formIdMapper = {
  'request-showing-rent': 'form-rent-inquiry',
  'request-showing-buy': 'form-buy-inquiry-listing',
  'request-application': 'form-rent-application',
};

class AgentCardForms extends Component {
  static propTypes = {
    agent: PropTypes.object,
    address: PropTypes.string,
    correctScenario: PropTypes.string.isRequired,
    officePhoneNumber: PropTypes.string.isRequired,
    listingOffice: PropTypes.string,
    rdcListing: PropTypes.bool.isRequired,
    saleType: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      address,
      agent,
      correctScenario,
      officePhoneNumber,
      listingOffice,
      selectedTab,
      setAgentCardTab
    } = this.props;
    let defaultAgentImage = `${bundle.static_images_url}user-placeholder-image.png`;
    let contactElement;

    switch(correctScenario) {
      case 'rentRDC':
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
                <JSONSchemaFormContainer jsonSchemaForm={this.props.jsonSchemaForm} showConfirmation={true} />
              </FormFetcher>
            </div>
          </div>
        );
        break;
      case 'rentNOTRdc':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-card-description`}>Please contact {agent.name} at {listingOffice} direct by phone at {agent.phone}. You may also reach {listingOffice} by phone at {officePhoneNumber}. </p>
          </div>
        )
        break;
      case 'saleRDC':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Request Showing for {address}</h5>
            <FormFetcher formId={formIdMapper['request-showing-buy']}>
              <JSONSchemaFormContainer showConfirmation={true} />
            </FormFetcher>
          </div>
        );
        break;
      case 'saleNotRdc':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Request Showing for {address}</h5>
            <FormFetcher formId={formIdMapper['request-showing-buy']}>
              <JSONSchemaFormContainer showConfirmation={true} />
            </FormFetcher>
          </div>
        );
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
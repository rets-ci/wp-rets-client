import FormFetcher from '../../Forms/FormFetcher.jsx';import {Lib} from '../../../lib.jsx';
import _ from 'lodash';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Util from '../../Util.jsx';

let hidePartsOfPhoneNumber = (phoneNumber) => {
  if (phoneNumber.includes('-')) {
    let n = phoneNumber.split('-');
    let visibleParts = n.shift();
    let hiddenParts = n.map(d => Array(d.length).join('X'));
    return [visibleParts].concat(hiddenParts).join('-');
  } else {
    return null;
  }
}

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
    listingOffice: PropTypes.string,
    rdcListing: PropTypes.bool.isRequired,
    saleType: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      displayedPhoneNumber: '',
      realNumber: ''
    };
  }

  revealPhoneNumber = () => {
    this.setState({
      displayedPhoneNumber: this.state.realNumber
    })
  }

  componentDidMount() {
    let {
      agent
    } = this.props;
    this.setAgentData();
  }

  componentWillReceiveProps() {
    if (this.props.agent && Object.keys(this.props.agent).length) {
      this.setAgentData();
    }
  }

  setAgentData = () => {
    let {
      agent,
      correctScenario
    } = this.props;
    let realNumber;
    let displayedPhoneNumber;
    
    if (correctScenario === 'rentNOTRdc') {
      displayedPhoneNumber = agent.phone;
      realNumber = agent.phone;
    } else {
      displayedPhoneNumber = agent.phone ? hidePartsOfPhoneNumber(agent.phone) : null;
      realNumber = agent.phone;
    }

    this.setState({
      displayedPhoneNumber: displayedPhoneNumber,
      realNumber: realNumber
    });
  }

  render() {
    let {
      address,
      agent,
      correctScenario,
      listingOffice,
      selectedTab,
      setAgentCardTab
    } = this.props;
    let defaultAgentImage = `${bundle.static_images_url}user-placeholder-image.png`;
    let contactElement;

    let listingOfficeValue = Util.decodeHtml(listingOffice);

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
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-card-description`}>Please contact {agent.name} at {listingOfficeValue} direct by phone at {agent.phone}</p>
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
                <p className={`${Lib.THEME_CLASSES_PREFIX}primary-color ${Lib.THEME_CLASSES_PREFIX}secondary-text`}>{listingOfficeValue}</p>
                <div className={`${Lib.THEME_CLASSES_PREFIX}phone-number`} onClick={this.revealPhoneNumber}>
                  {this.state.displayedPhoneNumber}
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
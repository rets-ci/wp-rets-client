
import FormFetcher from '../../Forms/FormFetcher.jsx';import {Lib} from '../../../lib.jsx';
import _ from 'lodash';
import JSONSchemaFormContainer from '../../Forms/JSONSchemaFormContainer.jsx';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

let getAgentImage = (agentObject) => _.get(agentObject, 'data.images[0][0]', null);
let getAgentName = (agentObject) => _.get(agentObject, 'data.display_name', null);
let getAgentPhone = (agentObject) => _.get(agentObject, 'data.meta.phone_number[0]', null);

let findAgentById = (agents, agentId) => {
  let agent = {};
  let foundAgent = agents.filter(function(a) {
    return a.data.meta.triangle_mls_id ? a.data.meta.triangle_mls_id[0] === agentId : null;
  });
  if (foundAgent.length) {
    agent.image = getAgentImage(foundAgent[0]);
    agent.name = getAgentName(foundAgent[0]);
    agent.phone = getAgentPhone(foundAgent[0]);;
  }
  return agent;
}

let findRandomAgentBySaleType = (agents, saleType) => {
  let agent = {};
  let agentsBySaleTypes = agents.filter(function(a) {
    return a.data.meta.sale_type ? a.data.meta.sale_type[0].includes(saleType) : null;
  });
  if (agentsBySaleTypes.length) {
    let randomAgent = agentsBySaleTypes[Math.floor(Math.random() * agentsBySaleTypes.length)];
    agent.image = getAgentImage(randomAgent);;
    agent.name = getAgentName(randomAgent);;
    agent.phone = getAgentPhone(randomAgent);
  }
  return agent;
}

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
    address: PropTypes.string,
    agents: PropTypes.array.isRequired,
    listingOffice: PropTypes.string,
    RETSAgent: PropTypes.object.isRequired,
    rdcListing: PropTypes.bool.isRequired,
    saleType: PropTypes.string.isRequired
  }

  static defaultProps = {
    RETSAgent: {}
  }

  constructor(props) {
    super(props);
    this.state = {
      agent: {},
      displayedPhoneNumber: ''
    };
  }

  correctAgent = (agentId, agents, scenario) => {
    let agent;
    if (scenario === 'rentRDC') {
      agent = findAgentById(agents, agentId);
    } else if (scenario === 'rentNOTRdc') {
      agent = this.props.RETSAgent;
    } else if (scenario === 'saleRDC') {
      agent = findAgentById(agents, agentId);
    } else if (scenario === 'saleNotRdc') {
      agent = findRandomAgentBySaleType(agents, 'Buy');
    }
    return agent;
  }

  correctScenario = (saleType, rdcListing) => {
    let scenario;
    if (saleType === 'rent' && rdcListing) {
      scenario = 'rentRDC';
    } else if (saleType === 'rent' && !rdcListing) {
      scenario = 'rentNOTRdc';
    } else if (saleType === 'sale' && rdcListing) {
      scenario = 'saleRDC';
    } else if (saleType === 'sale' && !rdcListing) {
      scenario = 'saleNotRdc';
    }
    return scenario;
  }

  revealPhoneNumber = () => {
    this.setState({
      displayedPhoneNumber: this.state.realNumber
    })
  }

  componentDidMount = () => {
    //figure out the correct agent and which scenario here
    let agent = {};
    let correctScenario;
    let realNumber;
    if (this.props.saleType && this.props.rdcListing !== null) {
       correctScenario = this.correctScenario(this.props.saleType, this.props.rdcListing)
    }
    let displayedPhoneNumber;

    if (this.props.RETSAgent.id && this.props.agents && this.props.agents.length) {
      agent = this.correctAgent(
        this.props.RETSAgent.id,
        this.props.agents,
        correctScenario
      );
      if (correctScenario === 'rentNOTRdc') {
        displayedPhoneNumber = agent.phone;
        realNumber = agent.phone;
      } else {
        displayedPhoneNumber = agent.phone ? hidePartsOfPhoneNumber(agent.phone) : null;
        realNumber = agent.phone;
      }
    }
    this.setState({
      agent,
      displayedPhoneNumber: displayedPhoneNumber,
      realNumber: realNumber,
      scenario: correctScenario,
    });
  }

  render() {
    let {
      address,
      agents,
      listingOffice,
      selectedTab,
      setAgentCardTab
    } = this.props;
    
    let {
      agent,
      scenario
    } = this.state;
    let defaultAgentImage = `${bundle.static_images_url}user-placeholder-image.png`;
    let contactElement;

    switch(scenario) {
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
                <JSONSchemaFormContainer jsonSchemaForm={this.props.jsonSchemaForm} />  
              </FormFetcher>
            </div>
          </div>
        );
        break;
      case 'rentNOTRdc':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <p className={`${Lib.THEME_CLASSES_PREFIX}agent-card-description`}>Please contact {agent.name} at {listingOffice} direct by phone at {agent.phone}</p>
          </div>
        )
        break;
      case 'saleRDC':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Request Showing for {address}</h5>
            <FormFetcher formId={formIdMapper['request-showing-buy']}>
              <JSONSchemaFormContainer />
            </FormFetcher>
          </div>
        );
        break;
      case 'saleNotRdc':
        contactElement = (
          <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
            <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Request Showing for {address}</h5>
            <FormFetcher formId={formIdMapper['request-showing-buy']}>
              <JSONSchemaFormContainer />
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
                <p className={`${Lib.THEME_CLASSES_PREFIX}primary-color ${Lib.THEME_CLASSES_PREFIX}secondary-text`}>Red Door Company</p>
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
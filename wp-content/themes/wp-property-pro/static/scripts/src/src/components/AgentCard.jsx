import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Lib} from '../lib.jsx';
import JSONSchemaFormContainer from './Forms/JSONSchemaFormContainer.jsx';

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

class AgentCard extends Component {
  static propTypes = {
    phoneNumber: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      displayedPhoneNumber: ''
    };
  }

  revealPhoneNumber = () => {
    this.setState({
      displayedPhoneNumber: this.props.phoneNumber
    })
  }

  componentDidMount = () => {
    let number = hidePartsOfPhoneNumber(this.props.phoneNumber);
    this.setState({
      displayedPhoneNumber: number
    });
  }

  render() {
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card`}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-head`}>
          <div className="media">
            <img className="d-flex align-self-start mr-3" src={`${bundle.static_images_url}agent-photo.png`} alt="Agent photo" />
              <div className={`media-body ${Lib.THEME_CLASSES_PREFIX}media-body`}>
                <h5 className="mt-0">Germany McNeal</h5>
                <p className={`${Lib.THEME_CLASSES_PREFIX}primary-color ${Lib.THEME_CLASSES_PREFIX}secondary-text`}>Red Door Company</p>
                <div className={`${Lib.THEME_CLASSES_PREFIX}phone-number`} onClick={this.revealPhoneNumber}>
                  {this.state.displayedPhoneNumber}
                </div>
              </div>
          </div>
        </div>
        <div className={`${Lib.THEME_CLASSES_PREFIX}agent-card-body`}>
          <h5 className={`${Lib.THEME_CLASSES_PREFIX}info-section-header`}>Request Showing for 3 Moss Creek Court</h5>
           <JSONSchemaFormContainer jsonSchemaForm={this.props.jsonSchemaForm} /> 
        </div>
      </div>
    );
  }
};

export default AgentCard;
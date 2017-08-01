import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import NavigationIcons from './components/NavigationIcons.jsx';
import UserPanelIcon from './components/UserPanelIcon.jsx';

class HeaderPropertySingle extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-container ${Lib.THEME_CLASSES_PREFIX}header-property-single container-fluid`} >
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
          <div className={`col-1 hidden-md-up ${Lib.THEME_CLASSES_PREFIX}navigation-menu-left`}>
            <UserPanelIcon openUserPanel={this.props.openUserPanel} />
          </div>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo col-2 col-md-2 col-lg-1 my-auto`}>
            {
              _.get(bundle, 'logos.square_logo', null)
                ?
                <a href={_.get(bundle, 'site_url', '')} onClick={(eve) => {
                  eve.preventDefault();
                  browserHistory.push('')
                }} title={_.get(bundle, 'site_name', '')}>
                  <img src={bundle.logos.square_logo} alt={_.get(bundle, 'site_name', '')}
                       className={`${Lib.THEME_CLASSES_PREFIX}logo ${Lib.THEME_CLASSES_PREFIX}square-logo`}/>
                </a>
                : null
            }
          </div>
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-1 col-md-1 offset-md-9 offset-lg-10 d-flex align-items-center justify-content-end"}>
            <NavigationIcons openUserPanel={this.props.openUserPanel} />
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPropertySingle;
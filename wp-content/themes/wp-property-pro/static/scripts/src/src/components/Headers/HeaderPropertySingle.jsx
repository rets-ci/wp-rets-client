import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import NavigationIcons from './components/NavigationIcons.jsx';

class HeaderPropertySingle extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "header-search-container container-fluid"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
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
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-md-2 col-sm-2 offset-8 offset-md-8 offset-lg-9"}>
            <NavigationIcons openUserPanel={this.props.openUserPanel} />
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPropertySingle;
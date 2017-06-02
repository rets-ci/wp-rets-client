import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class HeaderPropertySingle extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    openUserPanel: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "header-search-container"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}header-search-navigation row`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}logo col-sm-2 col-md-1 my-auto mr-auto`}>
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
          <div className={Lib.THEME_CLASSES_PREFIX + "top-nav-bar col-md-2 col-sm-2"}>
            <ul>
              <li><a href="#" title="Favorites" className={Lib.THEME_CLASSES_PREFIX + "favorite"}><i
                className="fa fa-heart"></i></a></li>
              <li><a href="#" title="Notification" className={Lib.THEME_CLASSES_PREFIX + "notification"}><i
                className="fa fa-bell"></i> <span className={Lib.THEME_CLASSES_PREFIX + "indicator"}><i
                className="fa fa-circle"></i></span></a></li>
              <li><a href="#" onClick={this.props.openUserPanel}
                     className={Lib.THEME_CLASSES_PREFIX + "side-navigation"}><span>☰</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderPropertySingle;
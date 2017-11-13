import PropTypes from 'prop-types';
import React, {Component} from 'react';
import get from 'lodash/get';
import {Lib} from 'app_root/lib.jsx';

class NotFound extends Component {
  static propTypes = {
    history: PropTypes.object
  };

  render() {

    let {
      history
    } = this.props;

    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"page-not-found"}>
        <div>
          <h1>Page Not Found</h1>
          <h3>We're sorry, but the page you're looking for no longer exists.</h3>
        </div>
        <div>
          <a href={get(bundle, 'site_url', '')} onClick={(eve) => {
            eve.preventDefault();
            history.push('');
          }} title={get(bundle, 'site_name', '')}>Return Home</a>
        </div>
      </div>
    )
  }
}

export default NotFound;

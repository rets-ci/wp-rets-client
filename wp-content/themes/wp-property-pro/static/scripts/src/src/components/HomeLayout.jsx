import React, {Component, PropTypes} from 'react';
import Header from './Header.jsx';

export default class Home extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    )
  }
};

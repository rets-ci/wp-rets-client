import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Marker extends Component {
  static propTypes = {
    icon: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onClickHandler: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

  }

  render() {

    let {
      icon
    } = this.props;

    return (
      <div><img src={icon.url}/></div>
    );
  }
};

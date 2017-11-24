import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Marker extends Component {
  static propTypes = {
    icon: PropTypes.object.isRequired,
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
      <div><a href="#" onClick={(e) => {
        e.preventDefault();
        this.props.onClickHandler();
      }}><img src={icon.url}/></a></div>
    );
  }
};

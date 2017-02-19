import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {

  };
};

class SearchResult extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};
  }

  render() {
    return (
      <div>Search Result</div>
    )
  }
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResult);

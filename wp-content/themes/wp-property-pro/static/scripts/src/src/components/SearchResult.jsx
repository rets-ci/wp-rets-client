import Api from '../containers/Api.jsx';
import {setMapProps} from '../actions/index.jsx';
import {Lib} from '../lib.jsx'
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';

const mapStateToProps = (state) => {
  return {
    results: get(state, 'mapPropsState.mapProps', [])
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doSearch: (tax, term, saleType, propertyTypes) => {
      let pt = propertyTypes.split(Lib.STRING_ARRAY_DELIMITER);
      let params = {
        propertyTypes: pt,
        saleType: saleType,
        size: 100,
        tax: tax,
        term: term
      };
      let url = Api.getPropertySearchRequestURL();
      Api.search(url, params, function (err, response) {
        dispatch(setMapProps(response.hits.hits.length ? response.hits.hits : []));
      });
    }
  };
};

class SearchResult extends Component {
  static propTypes = {
    doSearch: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let saleType = this.props.params.sale;
    let tax = this.props.params.tax;
    let term = this.props.params.term;
    let propertyTypes = this.props.location.query['wpp_search[property_types]'];
    this.props.doSearch(tax, term, saleType, propertyTypes);
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

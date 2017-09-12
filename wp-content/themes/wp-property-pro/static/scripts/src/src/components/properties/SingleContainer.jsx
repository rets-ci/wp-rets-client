import {
  receivePropertySingleResult,
  requestPropertySingleResetFetching,
  requestPropertySingleResult,
  raiseErrorMessage
} from '../../actions/index.jsx'
import _ from 'lodash';
import Api from '../../containers/Api.jsx';
import LoadingCircle from '../LoadingCircle.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Single from './Single.jsx';

let singlePropertyData = (data) => {
  let {
    ID: id,
    post_date,
    post_content,
    post_meta,
    post_modified,
    post_title,
    tax_input,
    wpp_media
  } = data;

  let address = _.get(post_meta, 'rets_address', null);
  let address_unit = _.get(post_meta, 'address_unit', null);
  let agentId = _.get(post_meta, 'rets_list_agent[0]', null);
  let agentName = _.get(tax_input, 'wpp_agency_agent.listing_agent[0].name', null);
  let agentPhoneNumber = _.get(post_meta, 'rets_la1_agent_phone1_number[0]', null);
  let baths  = _.get(post_meta, 'rets_total_baths', null);
  let beds = _.get(post_meta, 'rets_beds', null);
  let city_state = _.get(tax_input, 'wpp_location.wpp_location_city_state[0].name', null);
  let elementary_school = _.get(tax_input, 'rets_state.wpp_schools.elementary_school', null);
  let formatted_address_simple = _.get(post_meta, 'formatted_address_simple', null);
  let images = wpp_media.map(w => w.url);
  let rets_city = _.get(tax_input, 'rets_city', null);
  let rets_high_school = _.get(tax_input, 'rets_high_school', null);
  let rets_list_price = _.get(post_meta, 'rets_list_price', null);
  let rets_living_area = _.get(post_meta, 'rets_living_area', null);
  let rets_lot_size_area = _.get(post_meta, 'rets_lot_size_area', null);
  let rets_middle_school = _.get(tax_input, 'rets_middle_school', null);
  let rets_postal_code = _.get(post_meta, 'rets_postal_code', null);
  let rets_state = _.get(tax_input, 'rets_state', null);
  let rets_year_built = _.get(post_meta, 'rets_year_built', null);
  let sqft = _.get(post_meta, 'sqft', null);
  let mlsId = _.get(post_meta, 'rets_mls_number[0]');
  let listing_office = _.get(tax_input, 'wpp_office.listing_office[0].name', null);
  let listing_status_sale = _.get(tax_input, 'wpp_listing_status.listing_status_sale[0].slug', null);
  let listing_sub_type = _.get(tax_input, 'wpp_listing_type.listing_sub_type[0].name', null);
  let listing_type = _.get(tax_input, 'wpp_listing_type.listing_type[0].slug', null);
  let officePhoneNumber = _.get(post_meta, 'rets_lo1_office_phone1_number[0]');
  let wpp_location_subdivision = _.get(tax_input, 'rets_state.wpp_location.wpp_location_subdivision', null);
  let wpp_location_city = _.get(tax_input, 'rets_state.wpp_location.wpp_location_city', null);
  let wpp_import_time = _.get(post_meta, 'wpp_import_time[0]', null);

  return {
    address,
    address_unit,
    agentId,
    agentName,
    agentPhoneNumber,
    baths,
    beds,
    city_state,
    elementary_school: _.get(elementary_school, '[0].name', null),
    id,
    images,
    mlsId,
    officePhoneNumber,
    post_date,
    post_content,
    post_modified,
    post_title,
    rets_city: _.get(rets_city, 'rets_city[0].name', null),
    rets_state: _.get(rets_state, 'rets_state[0].name', null),
    formatted_address_simple,
    rets_list_price,
    rets_living_area,
    rets_lot_size_area,
    rets_high_school: _.get(rets_high_school, 'rets_high_school[0].name'),
    rets_middle_school: _.get(rets_middle_school, 'rets_middle_school[0].name', null),
    rets_postal_code,
    rets_year_built,
    sqft,
    wpp_location_subdivision: _.get(wpp_location_subdivision, '[0].name', null),
    wpp_location_city: _.get(wpp_location_city, '[0].name'),
    listing_office,
    listing_status_sale,
    listing_type,
    listing_sub_type,
    wpp_import_time,
    ...data
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.errorMessage,
    isFetching: state.singleProperty.isFetching,
    property: state.singleProperty.property
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    searchProperty: (id) => {
      let url = 'https://' + bundle.elasticsearch_host + '/v3/search/advanced?size=1';
      let query = {
        "query": {
          "bool": {
            "must": [
              {"match":{"_id": id}}
            ]
          }
        }
      };
      dispatch(requestPropertySingleResult());
      Api.search(url, query, (err, data) => {
        if (err) {
          dispatch(requestPropertySingleResetFetching());
          return dispatch(raiseErrorMessage(err));
        }
        if (!_.get(data, 'hits.hits[0]', null)) {
          dispatch(requestPropertySingleResetFetching());
          return dispatch(raiseErrorMessage('property not found'));
        }
        dispatch(receivePropertySingleResult(_.get(data, 'hits.hits[0]._source')));
      });
    }
  }
}

class SingleContainer extends Component {
  static propTypes = {
    agents: PropTypes.array,
    post: (props, propName, componentName) => {
      let errors = [];
      if (props.post && !props.post.post_id) { errors.push('Post ID not defined'); }
      return errors.length ? new Error(errors.join(', ')) : null; 
    },
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    isFetching: PropTypes.bool.isRequired,
    property: PropTypes.object,
    searchProperty: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!_.get(this.props, 'post.post_id', null)) {
      console.log('property id is not defined');
    } else {
      this.props.searchProperty(this.props.post.post_id);
    }
  }

  render() {
    let {
      agents,
      post: {
        errorMessage,
        isFetching,
        post_id : id
      },
      property
    } = this.props;
    return (
      !property ?
        (isFetching ?
          <LoadingAccordion containerHeight="600px" verticallyCentered={true} /> :
          (errorMessage ?
            <ErrorMessage message={errorMessage} />
          :
          <p>Request property id {id} could not be found</p>)
          ):
          <Single
            agents={agents}
            {...singlePropertyData(property)}
            all={property}
          />

    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleContainer);
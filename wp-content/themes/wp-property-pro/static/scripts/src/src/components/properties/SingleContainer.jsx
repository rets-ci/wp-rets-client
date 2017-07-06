import Api from '../../containers/Api.jsx';
import LoadingCircle from '../LoadingCircle.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Single from './Single.jsx';

let singlePropertyData = (data) => {
  let {
    ID: id,
    post_date,
    post_content,
    post_meta: {
      rets_list_price,
      rets_living_area,
      rets_lot_size_area,
      rets_total_baths: baths,
      rets_postal_code,
      rets_year_built,
      beds
    },
    post_modified,
    post_title,
    tax_input: {
      rets_city,
      rets_middle_school,
      rets_high_school,
      rets_state,
      wpp_location: {
        wpp_location_subdivision,
        wpp_location_city
      },
      wpp_schools: {
        elementary_school
      }
    },
    wpp_media
  } = data._source;

  let images = wpp_media.map(w => w.url);

  return {
    baths,
    beds,
    elementary_school: _.get(elementary_school, '[0].name', null),
    id,
    images,
    post_date,
    post_content,
    post_modified,
    post_title,
    rets_city: _.get(rets_city, 'rets_city[0].name', null),
    rets_state: _.get(rets_state, 'rets_state[0].name', null),
    rets_list_price,
    rets_living_area,
    rets_lot_size_area,
    rets_high_school: _.get(rets_high_school, 'rets_high_school[0].name'),
    rets_middle_school: _.get(rets_middle_school, 'rets_middle_school[0].name', null),
    rets_postal_code,
    rets_year_built,
    wpp_location_subdivision: _.get(wpp_location_subdivision, '[0].name', null),
    wpp_location_city: _.get(wpp_location_city, '[0].name'),
    ...data
  }
}

class SingleContainer extends Component {

  static propTypes = {
    post: (props, propName, componentName) => {
      let errors = [];
      if (props.psot && !props.post.post_id) { errors.push('Post ID not defined'); }
      return errors.length ? new Error(errors.join(', ')) : null; 
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      property: null
    };
  }

  render() {
    let {
      post_id : id
    } = this.props.post;

    if (!this.state.property) {
      let query = {
        "query": {
          "bool": {
            "must": [
              {"match":{"_id": id}}
            ]
          }
        }
      };
      let url = 'https://' + bundle.elasticsearch_host + '/v3/_newSearch?size=1';
      Api.search(url, query, data => {

        if (!_.get(data, 'hits.hits[0]', null)) {
          this.setState({property: false});
        } else {
          this.setState({
            property: data.hits.hits[0]
          });
        }
      });
    }
    // property is null = initial state of property, data fetching hasn't even started
    // property is false = property could not be found
    // otherwise property is defined
    return (
      this.state.property !== null ?
        this.state.property ?
          <Single {...singlePropertyData(this.state.property)} />
        : <p>Request property id {id} could not be found</p>
      : <LoadingCircle containerHeight="600px" verticallyCentered={true} />);
  }
};

export default SingleContainer;
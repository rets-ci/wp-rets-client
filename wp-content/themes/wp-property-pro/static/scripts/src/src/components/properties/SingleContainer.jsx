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
    post_modified,
    post_title,
    wpp_media
  } = data._source;

  let images = wpp_media.map(w => w.url);

  return {
    id,
    images,
    post_date,
    post_content,
    post_modified,
    post_title
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
          console.log(data.hits.hits[0]);
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
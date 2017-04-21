import React, {Component, PropTypes} from 'react';
import LoadingCircle from '../LoadingCircle.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';
import Waypoint from 'react-waypoint';
import PropertyCard from '../PropertyCard.jsx';

class SearchResultListing extends Component {
  static propTypes = {
    allowPagination: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    seeMoreHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {loading: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.properties !== this.props.properties) {
      console.log('resetting loading');
      this.setState({loading: false});
    }
  }

  render() {

    let properties = _.get(this.props, 'properties', []);
    let groups = [];

    if (properties) {
      let propertiesGroup = [];
      properties.map((post) => {
        propertiesGroup.push(post);

        if (propertiesGroup.length === Lib.BLOG_POSTS_PER_ROW) {
          groups.push(propertiesGroup);
          propertiesGroup = [];
        }
      });
    }

    return (
      <div className={Lib.THEME_CLASSES_PREFIX + "listing-wrap"} ref={(r) => this.listingWrapElement = r}>
        <div className="container-fluid">
          {
            groups.map((g, group_index) => {


                let groupProperties = g.map((p, i) => {

                  let city = '';
                  let zipCode = '';

                  let listingLocation = _.get(p, '_source.tax_input.wpp_listing_location', []);

                  for (let termInd in listingLocation) {
                    let term = listingLocation[termInd][0];

                    switch (term.term_type) {
                      case 'location-city-state':
                        city = term.name;
                        break;
                      case 'location-zipcode':
                        zipCode = term.name;
                        break;
                    }
                  }

                  let item = {
                    gallery_images: _.get(p, '_source.wpp_media', []).map((media) => media.url),
                    relative_permalink: [_.get(wpp, 'instance.settings.configuration.base_slug'), _.get(p, '_source.post_name', '')].join(Lib.URL_DELIMITER),
                    address: _.get(p, '_source.post_meta.rets_address', ''),
                    full_address: _.get(p, '_source.post_meta.formatted_address_simple', ''),
                    beds: _.get(p, '_source.post_meta.rets_beds', 0),
                    baths: _.get(p, '_source.post_meta.rets_total_baths', 0),
                    price: _.get(p, '_source.post_meta.rets_list_price[0]', 0),
                    thumbnail: _.get(p, '_source.post_meta.rets_thumbnail_url', ''),
                    full_image: true
                  };

                  return (
                    <div className="col-md-6">
                      <PropertyCard data={item} listType={Lib.PROPERTIES_LIST_DEFAULT} key={i}/>
                    </div>
                  )
                });
                return (<div className="row" key={group_index}>{groupProperties}</div>);
              }
            )}
        </div>
        {this.props.allowPagination ?
          <div className={Lib.THEME_CLASSES_PREFIX + "search-result-container"}>
            <div className={Lib.THEME_CLASSES_PREFIX + "search-result-inner-container"}>
              {this.state.loading ?
                <LoadingCircle />
                : null}
              <p>Showing {this.props.properties.length} results</p>
              <Waypoint
                onEnter={() => {
                  this.setState({loading: true});
                  this.props.seeMoreHandler();
                }}
              />
            </div>
          </div>
          : null}
      </div>
    );
  }
}

export default SearchResultListing;

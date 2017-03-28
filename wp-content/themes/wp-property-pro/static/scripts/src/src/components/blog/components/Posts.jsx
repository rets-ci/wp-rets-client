import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingCircle from '../../LoadingCircle.jsx';
import PostCard from './PostCard.jsx';
import {Lib} from '../../../lib.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    posts: _.get(state, 'blogPostsState.posts', []),
    allowPagination: _.get(state, 'blogPostsState.allowPagination', false)
  }
};

class Posts extends Component {
  static propTypes = {
    seeMoreHandler: PropTypes.func.isRequired,
    categoryId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {loading: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts || _.isEmpty(nextProps.posts)) {
      this.setState({loading: false});
    }
  }

  seeMore(e, categoryId) {
    e.preventDefault();

    this.setState({loading: true});
    this.props.seeMoreHandler(this.props.posts.length, categoryId);
  }

  render() {
    let self = this;

    return (
      <section className={Lib.THEME_CLASSES_PREFIX + "blog-posts"}>
        <div className="container">
          <div className="row">
            {!this.state.loading ?
              this.props.posts.map((p, i) => {

                  let item = {
                    title: _.get(p, 'title', ''),
                    excerpt: _.get(p, 'excerpt', ''),
                    image_src: _.get(p, 'image_src', ''),
                    url: _.get(p, 'url', ''),
                    relative_url: _.get(p, 'relative_url', ''),

                  };

                  return (
                      <PostCard data={item} key={i}/>
                  )
                }
              )
              : <LoadingCircle />
            }
          </div>
          {this.props.allowPagination ?
            <div className={`${Lib.THEME_CLASSES_PREFIX}load-more text-center`}>
              {this.state.loading ?
                <LoadingCircle />
                :
                <a href="#" onClick={(e) => self.seeMore.bind(this)(e, this.props.categoryId)}
                   className="btn btn-primary">Load More</a>
              }
            </div>
            : null}
        </div>
      </section>
    );
  }
}

export default connect(
  mapStateToProps
)(Posts);

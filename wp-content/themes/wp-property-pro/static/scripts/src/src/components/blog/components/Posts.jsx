import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import LoadingCircle from 'app_root/components/LoadingCircle.jsx';
import PostCard from 'app_root/components/blog/components/PostCard.jsx';
import {Lib} from 'app_root/lib.jsx';


class Posts extends Component {
  static propTypes = {
    loadMoreHandler: PropTypes.func.isRequired,
    categoryId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts || isEmpty(nextProps.posts)) {
      this.setState({ loading: false });
    }
  }

  handleLoadMore = (e) => {
    e.preventDefault();

    this.setState({ loading: true });
    this.props.loadMoreHandler(this.props.posts.length, this.props.categoryId, this.props.posts);
  }

  render() {
    const posts = get(this.props, 'posts', []);

    return (
      <section className={Lib.THEME_CLASSES_PREFIX + "blog-posts"}>
        <div className="container">

          <div className={`${Lib.THEME_CLASSES_PREFIX}posts-wrapper row`}>
            { posts.map(post =>
                <PostCard data={post} key={post.ID} />
            )}
          </div>

          { this.props.allowPagination &&
            <div className="row">
              <div className={`${Lib.THEME_CLASSES_PREFIX}load-more mx-auto`}>
                { this.state.loading
                    ? <LoadingCircle />
                    : <a href="#" onClick={this.handleLoadMore}
                        className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}load-more-link`}
                      >Load More</a>
                }
              </div>
            </div>
          }
        </div>
      </section>
    );
  }
}

export default Posts;

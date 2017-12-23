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
    this.state = {loading: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts !== this.props.posts || isEmpty(nextProps.posts)) {
      this.setState({loading: false});
    }
  }

  handleLoadMore = (e) => {
    e.preventDefault();

    this.setState({ loading: true });
    this.props.loadMoreHandler(this.props.posts.length, this.props.categoryId, this.props.posts);
  }

  render() {
    let posts = get(this.props, 'posts', []);
    let groups = [];

    if (posts) {
      let postsGroup = [];
      let postsCount = posts.length;
      posts.map((post, key) => {
        postsGroup.push(post);

        if (postsGroup.length === Lib.BLOG_POSTS_PER_ROW || key + 1 === postsCount) {
          groups.push(postsGroup);
          postsGroup = [];
        }
      });
    }

    return (
      <section className={Lib.THEME_CLASSES_PREFIX + "blog-posts"}>
        <div className="container">
            {!this.state.loading || groups ?
              groups.map((g, group_index) => {

                  let groupPosts = g.map((p, i) =>
                    <PostCard data={{
                      title: get(p, 'title', ''),
                      excerpt: get(p, 'excerpt', ''),
                      image_src: get(p, 'image_src', ''),
                      image_title: get(p, 'image_title', ''),
                      image_alt: get(p, 'image_alt', ''),
                      url: get(p, 'url', ''),
                      relative_url: get(p, 'relative_url', '')
                    }} key={get(p, 'title', '')} />
                  );

                  return (<div className={`row ${Lib.THEME_CLASSES_PREFIX}blog-posts-row`}
                               key={group_index}>{groupPosts}</div>);
                }
              )
              : <LoadingCircle />
            }
          {this.props.allowPagination ?
            <div className="row">
              <div className={`${Lib.THEME_CLASSES_PREFIX}load-more mx-auto`}>
                {this.state.loading ?
                  <LoadingCircle />
                  :
                  <a href="#" onClick={this.handleLoadMore}
                     className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}load-more-link`}>Load More</a>
                }
              </div>
            </div>
            : null}
        </div>
      </section>
    );
  }
}

export default Posts;

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import LoadingCircle from '../../LoadingCircle.jsx';
import PostCard from './PostCard.jsx';
import {Lib} from '../../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

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
    if (nextProps.posts !== this.props.posts || isEmpty(nextProps.posts)) {
      this.setState({loading: false});
    }
  }

  seeMore(e, categoryId) {
    e.preventDefault();

    this.setState({loading: true});
    this.props.seeMoreHandler(this.props.posts.length, categoryId, this.props.posts);
  }

  render() {
    let self = this;

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
                  <a href="#" onClick={(e) => self.seeMore.bind(this)(e, this.props.categoryId)}
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

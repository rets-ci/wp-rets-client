import React, {Component, PropTypes} from 'react';
import Masthead from '../widgets/masthead/Masthead.jsx';
import PostCard from './components/PostCard.jsx';
import PostContent from './components/PostContent.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class Single extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {

    let posts = _.get(this.props.post, 'related_posts', []);
    let groups = [];

    if (posts) {
      let postsGroup = [];
      posts.map((post) => {
        postsGroup.push(post);

        if (postsGroup.length === Lib.BLOG_POSTS_PER_ROW) {
          groups.push(postsGroup);
          postsGroup = [];
        }
      });
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <article>
            {
              _.get(this.props.post, 'widgets.masthead', null)
                ? <Masthead widget_cell={_.get(this.props.post, 'widgets.masthead')}/>
                : null
            }
            {
              _.get(this.props.post, 'content', null)
                ? <PostContent content={this.props.post.content}/>
                : null
            }
          </article>
          {
            _.get(this.props.post, 'related_posts', []).length
              ?
              <section className={Lib.THEME_CLASSES_PREFIX + "related-posts"}>
                <div className="container">
                  <div className="row">
                    {
                      _.get(this.props.post, 'category_title', null) && _.get(this.props.post, 'related_posts', []).length
                        ? <div className={`${Lib.THEME_CLASSES_PREFIX}more-posts text-center`}>
                          <h4>More {this.props.post.category_title} Articles</h4>
                        </div>
                        : null
                    }
                  </div>
                  <div className="row">
                    {
                      groups.map((g, group_index) => {
                          let groupPosts = g.map((p, i) =>
                            <PostCard data={p} key={i}/>
                          );
                          return (<div className={`card-deck ${Lib.THEME_CLASSES_PREFIX}blog-posts-row`}
                                       key={group_index}>{groupPosts}</div>);
                        }
                      )
                    }
                  </div>
                </div>
              </section>
              : null
          }
        </div>
      </div>
    )
  }
}

export default Single;

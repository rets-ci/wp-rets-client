import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import HeaderDefault from 'app_root/components/Headers/HeaderDefault.jsx';
import Masthead from 'app_root/components/widgets/masthead/Masthead.jsx';
import PostCard from 'app_root/components/blog/components/PostCard.jsx';
import PostContent from 'app_root/components/blog/components/PostContent.jsx';
import {Lib} from 'app_root/lib.jsx';


class Single extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {

    let {
      history,
      openUserPanel,
      openLoginModal
    } = this.props;

    let posts = get(this.props.post, 'related_posts', []);
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
      <div>
        <section
          className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-default row no-gutters`}>
          <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal}/>
        </section>
        <div className="container-fluid">
          <div className="row">
            <article>
              {
                get(this.props.post, 'widgets.masthead', null)
                  ? <Masthead widget_cell={get(this.props.post, 'widgets.masthead')}/>
                  : null
              }
              {
                get(this.props.post, 'content', null)
                  ? <PostContent content={this.props.post.content}/>
                  : null
              }
            </article>
            {
              get(this.props.post, 'related_posts', []).length
                ?
                <section className={Lib.THEME_CLASSES_PREFIX + "related-posts"}>
                  <div className="container">
                    <div className="row">
                      {
                        get(this.props.post, 'category_title', null) && get(this.props.post, 'related_posts', []).length
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
      </div>
    )
  }
}

export default Single;

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

    const categoryTitle = get(this.props, 'post.category_title')
    const relatedPosts = get(this.props, 'post.related_posts', []);

    return (
      <div>
        <section
          className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-default row no-gutters`}
        >
          <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal}/>
        </section>
        <div className="container-fluid">
          <div className="row">
            <article>
              { get(this.props.post, 'widgets.masthead', null) &&
                  <Masthead widget_cell={get(this.props.post, 'widgets.masthead')}/>
              }
              { get(this.props.post, 'content', null) &&
                  <PostContent content={this.props.post.content}/>
              }
            </article>

            { relatedPosts.length &&
              <section className={Lib.THEME_CLASSES_PREFIX + "related-posts"}>
                <div className="container">
                  <div className="row">
                    { true &&
                        <div className={`${Lib.THEME_CLASSES_PREFIX}more-posts text-center`}>
                          <h4>{`More Property Management Articles`}</h4>
                        </div>
                    }
                  </div>
                  <div className="row">
                  { relatedPosts.map(post =>
                      <PostCard data={post} key={post.ID} />
                  )}
                  </div>
                </div>
              </section>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Single;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import get from 'lodash/get';

import HeaderDefault from 'app_root/components/Headers/HeaderDefault.jsx';
import Masthead from 'app_root/components/widgets/masthead/Masthead.jsx';
import PostCard from 'app_root/components/blog/components/PostCard.jsx';
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

        { get(this.props.post, 'widgets.masthead', null) &&
            <Masthead widget_cell={get(this.props.post, 'widgets.masthead')}/>
        }
        { get(this.props.post, 'content', null) &&
            <section className="container">
              <div className="row"><div className="col-12">
                  <div className={`mx-auto ${Lib.THEME_CLASSES_PREFIX}post-content`}>
                    {renderHTML(get(this.props.post, 'content'))}
                  </div>
              </div></div>
            </section>
        }

        { relatedPosts.length &&
          <section className={Lib.THEME_CLASSES_PREFIX + "related-posts"}>
            <div className="container">
              { categoryTitle &&
                  <h3 className={`${Lib.THEME_CLASSES_PREFIX}more-posts text-center`}>
                    {`More ${categoryTitle} Articles`}
                  </h3>
              }
              <div className={`${Lib.THEME_CLASSES_PREFIX}posts-wrapper row`}>
              { relatedPosts.map(post =>
                  <PostCard data={post} key={post.ID} />
              )}
              </div>
            </div>
          </section>
        }

      </div>
    )
  }
}

export default Single;

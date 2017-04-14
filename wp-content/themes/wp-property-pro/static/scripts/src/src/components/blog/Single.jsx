import React, {Component, PropTypes} from 'react';
import Masthead from '../widgets/masthead/Masthead.jsx';
import PostCard from './components/PostCard.jsx';
import PostContent from './components/PostContent.jsx';
import Footer from '../Footer.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class Single extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  render() {

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
                  {
                    _.get(this.props.post, 'category_title', null) && _.get(this.props.post, 'related_posts', []).length
                      ? <div className={Lib.THEME_CLASSES_PREFIX + "more-posts"}>
                        <h4>More {this.props.post.category_title} Articles</h4>
                      </div>
                      : null
                  }
                  <div className="row">
                    {
                      _.get(this.props.post, 'related_posts', []).map((item) =>
                        <PostCard data={item}/>
                      )
                    }
                  </div>
                </div>
              </section>
              : null
          }
          <Footer/>
        </div>
      </div>
    )
  }
}

export default Single;

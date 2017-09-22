import PropTypes from 'prop-types';
import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import Masthead from '../widgets/masthead/Masthead.jsx';
import HeaderGuide from '../Headers/HeaderGuide.jsx'
import {Lib} from '../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {withRouter} from 'react-router';

class Single extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    post: PropTypes.object
  };

  returnToArchiveHandler = (historyPush) => {
    let parent_category_relative_link = get(this.props.post, 'guide_single_content.parent_category_relative_link', '');

    if (!isEmpty(parent_category_relative_link)) {
      historyPush(parent_category_relative_link);
    }
  }

  nextArticleHandler = (historyPush) => {
    let next_article_relative_link = get(this.props.post, 'guide_single_content.next_article_relative_link', '');

    if (!isEmpty(next_article_relative_link)) {
      historyPush(next_article_relative_link)
    }
  }

  render() {

    let content = get(this.props.post, 'guide_single_content', {});

    return (
      <article className={Lib.THEME_CLASSES_PREFIX + "guide-post"}>
        <div className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}guide-container`}>
          <div className="row no-gutters">
            <div className="col-xl-6">
              <div className="container-fluid">
                <div className="row">
                  <HeaderGuide historyPush={this.props.history.push} />
                  <Masthead widget_cell={get(content, 'masthead', '')}
                            returnToArchiveHandler={() => this.returnToArchiveHandler(this.props.history.push)}
                            nextArticleHandler={() => this.nextArticleHandler(this.props.history.push)}/>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="container-fluid">
                <div className="row">
                  {
                    get(content, 'content', null)
                      ? <section
                        className={Lib.THEME_CLASSES_PREFIX + "article-content"}>{renderHTML(get(content, 'content'))}</section>
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default withRouter(Single);

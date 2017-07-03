import PropTypes from 'prop-types';
import React, {Component} from 'react';
import renderHTML from 'react-render-html';
import Masthead from '../widgets/masthead/Masthead.jsx';
import HeaderGuide from '../Headers/HeaderGuide.jsx'
import Util from '../Util.jsx';
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class Single extends Component {
  static propTypes = {
    post: PropTypes.object
  };

  returnToArchiveHandler() {
    let parent_category_relative_link = _.get(this.props.post, 'guide_single_content.parent_category_relative_link', '');

    if (!_.isEmpty(parent_category_relative_link)) {
      Util.goToUrl(parent_category_relative_link);
    }
  }

  nextArticleHandler() {
    let next_article_relative_link = _.get(this.props.post, 'guide_single_content.next_article_relative_link', '');

    if (!_.isEmpty(next_article_relative_link)) {
      Util.goToUrl(next_article_relative_link);
    }
  }

  render() {

    let content = _.get(this.props.post, 'guide_single_content', {});

    return (
      <article className={Lib.THEME_CLASSES_PREFIX + "guide-post"}>
        <div className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}guide-container`}>
          <div className="row no-gutters">
            <div className="col-xl-6">
              <div className="container-fluid">
                <div className="row">
                  <HeaderGuide/>
                  <Masthead widget_cell={_.get(content, 'masthead', '')}
                            returnToArchiveHandler={this.returnToArchiveHandler.bind(this)}
                            nextArticleHandler={this.nextArticleHandler.bind(this)}/>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="container-fluid">
                <div className="row">
                  {
                    _.get(content, 'content', null)
                      ? <section
                        className={Lib.THEME_CLASSES_PREFIX + "article-content"}>{renderHTML(_.get(content, 'content'))}</section>
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

export default Single;

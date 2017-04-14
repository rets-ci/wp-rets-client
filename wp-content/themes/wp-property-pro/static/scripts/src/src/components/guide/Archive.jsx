import React, {Component, PropTypes} from 'react';
import Masthead from '../widgets/masthead/Masthead.jsx';
import CategoryCard from './components/CategoryCard.jsx';
import ArticleCard from './components/ArticleCard.jsx';
import HeaderGuide from '../Headers/HeaderGuide.jsx'
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class Archive extends Component {
  static propTypes = {
    post: PropTypes.object
  };

  render() {

    let content = _.get(this.props.post, 'guide_content', {});

    let cards = _.get(content, 'items', []).map((item, i) => {
      let last = _.get(content, 'items', []).length === i + 1;
      return (
        <div className="col-md-12" key={i}>
          {
            _.get(item, 'children', null)
              ? <CategoryCard category={item} last={last}/>
              : <ArticleCard article={item} last={last}/>
          }
        </div>
      )
    });

    return (
      <div className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}guide-container`}>
        <div className="row no-gutters">
          <div className="col-lg-6">
            <div className="container">
              <div className="row">
                <HeaderGuide/>
                <Masthead widget_cell={_.get(content, 'masthead')}/>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="container">
              <div className="row">
                <div className={Lib.THEME_CLASSES_PREFIX + "guide-content"}>
                  {cards}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Archive;

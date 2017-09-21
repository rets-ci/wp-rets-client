import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import Masthead from '../widgets/masthead/Masthead.jsx';
import CategoryCard from './components/CategoryCard.jsx';
import ArticleCard from './components/ArticleCard.jsx';
import HeaderGuide from '../Headers/HeaderGuide.jsx'
import {Lib} from '../../lib.jsx';
import _ from 'lodash';

class Archive extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    post: PropTypes.object
  };

  render() {
    let content = _.get(this.props.post, 'guide_content', {});

    let cards = _.get(content, 'items', []).map((item, i) => {
      let last = _.get(content, 'items', []).length === i + 1;
      return (
        <li className={`list-group-item ${Lib.THEME_CLASSES_PREFIX}guide-list-item border-0`} key={i}>
          {
            _.get(item, 'children', null)
              ? <CategoryCard category={item} historyPush={this.props.history.push} last={last}/>
              : <ArticleCard article={item} historyPush={this.props.history.push} last={last}/>
          }
        </li>
      )
    });

    return (
      <div className={`container-fluid ${Lib.THEME_CLASSES_PREFIX}guide-container`}>
        <div className="row no-gutters">
          <div className="col-xl-6">
            <div className="container-fluid">
              <div className="row">
                <HeaderGuide/>
                <Masthead widget_cell={_.get(content, 'masthead')}/>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="container-fluid">
              <div className="row">
                <div className={`${Lib.THEME_CLASSES_PREFIX}guide-content`}>
                  <ul className={`list-group ${Lib.THEME_CLASSES_PREFIX}guide-list`}>
                    {cards}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Archive);

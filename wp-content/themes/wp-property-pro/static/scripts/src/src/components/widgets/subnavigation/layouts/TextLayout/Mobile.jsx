import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';
import Util from '../../../../Util.jsx';
import {Lib} from '../../../../../lib.jsx';
import _ from 'lodash';

class Mobile extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    currentUrl: PropTypes.string.isRequired,
    dropDownOpen: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  handleClickOutside(evt) {
    this.props.handleChange(false);
  }

  selectOption(eve, url) {
    eve.preventDefault();

    Util.goToUrl(url);
  }

  handleChange(open) {
    this.props.handleChange(open);
  }

  render() {

    let self = this;

    let btn = {};
    let links = [];
    let selectedOption = '';
    for (let i in this.props.items) {
      let item = this.props.items[i];
      if (_.get(item, 'classes.0', null) === 'btn') {
        btn = item;
      } else {
        links.push(item);
        if (_.get(item, 'url') == this.props.currentUrl)
          selectedOption = _.get(item, 'title');
      }
    }

    if(_.isEmpty(selectedOption) && !_.isEmpty(links)){
      selectedOption = _.get(links, '0.title', '')
    }

    let selectedOptionClasses = `${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile-selected-option ${Lib.THEME_CLASSES_PREFIX}display`;
    if(this.props.dropDownOpen){
      selectedOptionClasses = `${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile-selected-option ${Lib.THEME_CLASSES_PREFIX}hide`;
    }

    return (
      <div className={`hidden-lg-up ${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile`}>
        <div className={selectedOptionClasses}
             onClick={() => self.handleChange.bind(this)(!this.props.dropDownOpen)}>
          {selectedOption}
          <i className={this.props.dropDownOpen ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
        </div>
        <ul className={Lib.THEME_CLASSES_PREFIX + (this.props.dropDownOpen ? 'display' : 'hide')}>
          {links.map((l, i) => {
              let linkClasses = selectedOption === _.get(l, 'title') ? Lib.THEME_CLASSES_PREFIX + 'active' : '';
              if (selectedOption === _.get(l, 'title')) {
                return (<li onClick={this.props.dropDownOpen && i === 0 ? () => self.handleChange.bind(this)(!this.props.dropDownOpen) : null} key={i}>
                  <a href={_.get(l, 'url')} className={linkClasses}
                     onClick={(eve) => self.selectOption.bind(this)(eve, _.get(l, 'relative_url'))}>{l.title}</a>
                  {this.props.dropDownOpen && i === 0 ?
                    <i className={"fa fa-angle-up"}></i> : null}
                </li>)
              }
              else {
                return (<li onClick={this.props.dropDownOpen && i === 0 ? () => self.handleChange.bind(this)(!this.props.dropDownOpen) : null} key={i}>
                  <a href={_.get(l, 'url')}
                     onClick={(eve) => self.selectOption.bind(this)(eve, _.get(l, 'relative_url'))}>{l.title}</a>
                  {this.props.dropDownOpen && i === 0 ?
                    <i className={"fa fa-angle-up"}></i> : null}
                </li>)
              }

            }
          )}
        </ul>
        {
          _.isEmpty(btn)
            ? null
            :
            <a href={btn.url} className={`btn ${Lib.THEME_CLASSES_PREFIX}subnavigation-btn`}>{btn.title}</a>
        }
      </div>
    );
  }
}

export default onClickOutside(Mobile);

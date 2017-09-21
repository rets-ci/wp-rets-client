import PropTypes from 'prop-types';
import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';
import {Lib} from '../../../../../lib.jsx';
import _ from 'lodash';
import Util from '../../../../Util.jsx';

class Mobile extends Component {
  static propTypes = {
    historyPush: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    currentUrl: PropTypes.string.isRequired,
    dropDownOpen: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
    openFormModal: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonDisplay: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }


  handleScroll(event) {
    let scrollTop = _.get(event, 'srcElement.body.scrollTop', _.get(event, 'pageY', 0));

    if (scrollTop <= Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && _.get(this.state, 'buttonDisplay', false)) {
      this.setState({buttonDisplay: false});
    } else if (scrollTop > Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && !_.get(this.state, 'buttonDisplay', false)) {
      this.setState({buttonDisplay: true});
    }
  }

  handleClickOutside(evt) {
    this.props.handleChange(false);
  }

  selectOption(eve, url) {
    eve.preventDefault();

    historyPush(url);
  }

  handleChange(open) {
    this.props.handleChange(open);
  }

  render() {

    let {
      openFormModal
    } = this.props;

    let self = this;

    let btn = {};
    let links = [];
    let selectedOption = '';
    for (let i in this.props.items) {
      let item = this.props.items[i];
      if (_.get(item, 'classes.0', null) === 'btn') {
        btn = item;
        btn['formModalId'] = Util.getFormModalIdFromCSSClass(item.classes);
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
      <div className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile`}>
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
            <a href={btn.url} onClick={btn.formModalId ? ((event) => { event.preventDefault(); openFormModal(btn.formModalId, true)}) : null} className={`btn ${Lib.THEME_CLASSES_PREFIX}subnavigation-btn ${_.get(this.state, 'buttonDisplay', false) === false ? Lib.THEME_CLASSES_PREFIX+'hide' : ''}`}>{btn.title}</a>
        }
      </div>
    );
  }
}

export default onClickOutside(Mobile);

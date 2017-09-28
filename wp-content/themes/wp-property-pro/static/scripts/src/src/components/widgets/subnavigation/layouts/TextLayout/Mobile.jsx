import PropTypes from 'prop-types';
import React, {Component} from 'react';
import onClickOutside from 'react-onclickoutside';
import {Lib} from '../../../../../lib.jsx';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
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
    window.removeEventListener('scroll', this.handleScroll, true);
  }


  handleScroll(event) {
    let scrollTop = get(event, 'srcElement.body.scrollTop', get(event, 'pageY', 0));

    if (scrollTop <= Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && get(this.state, 'buttonDisplay', false)) {
      this.setState({buttonDisplay: false});
    } else if (scrollTop > Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && !get(this.state, 'buttonDisplay', false)) {
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
      if (get(item, 'classes.0', null) === 'btn') {
        btn = item;
        btn['formModalId'] = Util.getFormModalIdFromCSSClass(item.classes);
      } else {
        links.push(item);
        if (get(item, 'url') == this.props.currentUrl)
          selectedOption = get(item, 'title');
      }
    }

    if(isEmpty(selectedOption) && !isEmpty(links)){
      selectedOption = get(links, '0.title', '')
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
              let linkClasses = selectedOption === get(l, 'title') ? Lib.THEME_CLASSES_PREFIX + 'active' : '';
              if (selectedOption === get(l, 'title')) {
                return (<li onClick={this.props.dropDownOpen && i === 0 ? () => self.handleChange.bind(this)(!this.props.dropDownOpen) : null} key={i}>
                  <a href={get(l, 'url')} className={linkClasses}
                     onClick={(eve) => self.selectOption.bind(this)(eve, get(l, 'relative_url'))}>{l.title}</a>
                  {this.props.dropDownOpen && i === 0 ?
                    <i className={"fa fa-angle-up"}></i> : null}
                </li>)
              }
              else {
                return (<li onClick={this.props.dropDownOpen && i === 0 ? () => self.handleChange.bind(this)(!this.props.dropDownOpen) : null} key={i}>
                  <a href={get(l, 'url')}
                     onClick={(eve) => self.selectOption.bind(this)(eve, get(l, 'relative_url'))}>{l.title}</a>
                  {this.props.dropDownOpen && i === 0 ?
                    <i className={"fa fa-angle-up"}></i> : null}
                </li>)
              }

            }
          )}
        </ul>
        {
          isEmpty(btn)
            ? null
            :
            <a href={btn.url} onClick={btn.formModalId ? ((event) => { event.preventDefault(); openFormModal(btn.formModalId, true)}) : null} className={`btn ${Lib.THEME_CLASSES_PREFIX}subnavigation-btn ${get(this.state, 'buttonDisplay', false) === false ? Lib.THEME_CLASSES_PREFIX+'hide' : ''}`}>{btn.title}</a>
        }
      </div>
    );
  }
}

export default onClickOutside(Mobile);

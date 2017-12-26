import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import throttle from 'lodash/throttle';

import { Lib } from 'app_root/lib.jsx';
import Util from 'app_root/components/Util.jsx';


class Mobile extends Component {
  static propTypes = {
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

    this.handleScroll = throttle(this.handleScroll, 1000);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  }

  handleScroll = (event) => {
    let scrollTop = get(event, 'srcElement.body.scrollTop', get(event, 'pageY', 0));

    if (scrollTop <= Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && this.state.buttonDisplay) {
      this.setState({buttonDisplay: false});
    } else if (scrollTop > Lib.SUBNAVIGATION_MOBILE_HEIGHT_FOR_BUTTON_DISPLAY && !this.state.buttonDisplay) {
      this.setState({buttonDisplay: true});
    }
  }

  handleClickOutside = evt => {
    this.props.handleChange(false);
  }

  handleChange = open => {
    this.props.handleChange(open);
  }

  render() {
    let {
      openFormModal
    } = this.props;

    let btn = {};
    let links = [];
    let selectedOption = '';
    for (let i in this.props.items) {
      let item = this.props.items[i];
      if (get(item, 'classes.0', null) === 'btn') {
        btn = item;
        if (btn.classes.filter(d => d.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0).length) {
          btn['formModalId'] = Util.getFormModalIdFromCSSClass(item.classes);
        }
      } else {
        links.push(item);
        if (get(item, 'url') == this.props.currentUrl)
          selectedOption = get(item, 'title');
      }
    }

    if (isEmpty(selectedOption) && !isEmpty(links)) {
      selectedOption = get(links, '0.title', '')
    }

    let selectedOptionClasses = `${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile-selected-option ${Lib.THEME_CLASSES_PREFIX}display`;
    if (this.props.dropDownOpen) {
      selectedOptionClasses = `${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile-selected-option ${Lib.THEME_CLASSES_PREFIX}hide`;
    }

    return (
      <div className={`hidden-md-up ${Lib.THEME_CLASSES_PREFIX}subnavigation-mobile`}>
        <div className={selectedOptionClasses} onClick={() => this.handleChange(!this.props.dropDownOpen)}>
          {selectedOption}
          <i className={this.props.dropDownOpen ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
        </div>
        <ul className={Lib.THEME_CLASSES_PREFIX + (this.props.dropDownOpen ? 'display' : 'hide')}>
          { links.map((link, i) => {
              let linkClasses = selectedOption === get(link, 'title') ? Lib.THEME_CLASSES_PREFIX + 'active' : '';
              return (
                <li key={i}
                  onClick={this.props.dropDownOpen && i === 0 ? () => this.handleChange(!this.props.dropDownOpen) : null}
                >
                  <Link className={linkClasses} to={get(link, 'relative_url', '/')}>{link.title}</Link>
                  { this.props.dropDownOpen && i === 0 &&
                    <i className={"fa fa-angle-up"}></i>
                  }
                </li>
              )
            })
          }
        </ul>
        { !isEmpty(btn) &&
            <a href={btn.url}
              onClick={btn.formModalId ? ((event) => { event.preventDefault(); openFormModal(btn.formModalId, true)}) : null}
              className={`btn ${Lib.THEME_CLASSES_PREFIX}subnavigation-btn ${this.state.buttonDisplay === false ? Lib.THEME_CLASSES_PREFIX+'hide' : ''}`}
            >{btn.title}</a>
        }
      </div>
    );
  }
}

export default onClickOutside(Mobile);

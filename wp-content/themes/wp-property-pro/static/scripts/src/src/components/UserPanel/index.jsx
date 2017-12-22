import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Lib }      from 'app_root/lib.jsx';
import { curateMenuItems } from 'app_root/helpers/menuHelper';
import BootstrapModal from 'app_root/components/Modals/components/BootstrapModal.jsx';


class UserPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mainItems: [],
      moreItems: [],
      hasMore: false,
      isMoreOpen: false,
    };
  }

  componentDidMount() {
    const menuData = curateMenuItems(this.props.menuItems)

    this.setState({
      mainItems: menuData.mainItems,
      moreItems: menuData.moreItems,
      hasMore: menuData.hasMore,
    });
  }

  openModal = (modalId) => {
    this.props.closeUserPanel();
    this.props.openFormModal(modalId, true);
  }

  toggleMoreMenu = () => {
    this.setState(prevState => {
      return {
        isMoreOpen: !prevState.isMoreOpen
      }
    });
  }

  itemClass = (item) => {
    if (item.isBordered) {
      return `${Lib.THEME_CLASSES_PREFIX}menu-item ${Lib.THEME_CLASSES_PREFIX}menu-item--bordered`;
    } else {
      return `${Lib.THEME_CLASSES_PREFIX}menu-item`;
    }
  }

  render() {
    const { panelOpen, closeUserPanel } = this.props;
    const { mainItems, moreItems, hasMore, isMoreOpen } = this.state;

    return (
      <BootstrapModal
        classes={ ['sidebar sidebar--navigation sidebar--right'] }
        id={ 'UserPanel' }
        open={ panelOpen }
        closeModal={ closeUserPanel }
      >
        <div className={`${Lib.THEME_CLASSES_PREFIX}menu-wrapper`}>
          <div className={`${Lib.THEME_CLASSES_PREFIX}menu__main-items`}>
          { mainItems.map(item =>
            <div key={ item.id }
                className={
                  `${Lib.THEME_CLASSES_PREFIX}menu-item` +
                  (item.isBordered ? ` ${Lib.THEME_CLASSES_PREFIX}menu-item--bordered`: '')
                }
            >
              <Link
                key={ item.id }
                to={ item.relative_url }
                onClick={ item.isModal ? this.openModal.bind(this, item.modalId) : null }
              >
                <span className={`${Lib.THEME_CLASSES_PREFIX}menu-icon`}>{ item.icon && <img src={ item.icon } /> }</span>
                <p className={`${Lib.THEME_CLASSES_PREFIX}menu-label`}>{ item.title }</p>
              </Link>
            </div>
          )}
          </div>

          { hasMore &&
            <div className={`${Lib.THEME_CLASSES_PREFIX}menu__more-items`}>
              <div className={`${Lib.THEME_CLASSES_PREFIX}menu-item ${Lib.THEME_CLASSES_PREFIX}menu-item--expander`} onClick={ this.toggleMoreMenu }>
                <a>
                  <span className={`${Lib.THEME_CLASSES_PREFIX}menu-icon fa fa-bars`}></span>
                  <p className={`${Lib.THEME_CLASSES_PREFIX}menu-label`}>More</p>
                  <span className={ isMoreOpen ? 'fa fa-caret-up' : 'fa fa-caret-down' }></span>
                </a>
              </div>

              { moreItems.map(item =>
                <div key={ item.id }
                    className={
                      `${Lib.THEME_CLASSES_PREFIX}menu-item` +
                      (item.isBordered ? ` ${Lib.THEME_CLASSES_PREFIX}menu-item--bordered`: '') +
                      (!isMoreOpen ? ` ${Lib.THEME_CLASSES_PREFIX}menu-item--hidden` : '')
                    }
                >
                  <Link
                    key={ item.id }
                    to={ item.relative_url }
                    onClick={ item.isModal ? this.openModal.bind(this, item.modalId) : null }
                  >
                    <span className={`${Lib.THEME_CLASSES_PREFIX}menu-icon`}>{ item.icon && <img src={ item.icon } /> }</span>
                    <p className={`${Lib.THEME_CLASSES_PREFIX}menu-label`}>{ item.title }</p>
                  </Link>
                </div>
              )}
            </div>
          }
        </div>
      </BootstrapModal>
    );
  }
}

UserPanel.propTypes = {
  openFormModal: PropTypes.func.isRequired,
  closeUserPanel: PropTypes.func.isRequired,
  panelOpen: PropTypes.bool,
  menuItems: PropTypes.array,
};

export default UserPanel

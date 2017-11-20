import PropTypes from 'prop-types';
import React, {Component} from 'react';
import get from 'lodash/get';
import HeaderDefault from 'app_root/components/Headers/HeaderDefault.jsx';
import LocationModal from 'app_root/components/Modals/LocationModal.jsx';
import TitleDescriptionLayout from 'app_root/components/widgets/masthead/layouts/TitleDescriptionLayout.jsx'
import {Lib} from 'app_root/lib.jsx';

import 'not-found.scss';

class NotFound extends Component {
  static propTypes = {
    history: PropTypes.object,
    openLoginModal: PropTypes.func.isRequired,
    openUserPanel: PropTypes.func.isRequired
  };

  render() {

    let {
      closeLocationModal,
      history,
      openLoginModal,
      openUserPanel,
      searchOptions
    } = this.props;
    return (
      <div className={Lib.THEME_CLASSES_PREFIX+"page-not-found"}>
        <div className={`${Lib.THEME_CLASSES_PREFIX}page-not-found-container h-100`}>
          <div className="h-100 d-flex flex-column">
            <div>
              <section className={`${Lib.THEME_CLASSES_PREFIX}toolbar ${Lib.THEME_CLASSES_PREFIX}header-default row no-gutters`}>
                <HeaderDefault historyPush={history.push} openUserPanel={openUserPanel} openLoginModal={openLoginModal} />
              </section>
              <div className={`${Lib.THEME_CLASSES_PREFIX}page-content row no-gutters`}>
              <section className={`jumbotron ${Lib.THEME_CLASSES_PREFIX}masthead text-center ${Lib.THEME_CLASSES_PREFIX}not-found`}>
                <LocationModal closeModal={closeLocationModal} />
                <div className="container">
                  <div className="row">
                    <div className="mx-auto">
                      <img className={`${Lib.THEME_CLASSES_PREFIX}not-found-img`} src={`${bundle.static_images_url}404.png`} />
                    </div>
                    <TitleDescriptionLayout
                      searchOptions={searchOptions}
                      title={"Page Not Found"}
                      subtitle={"We're sorry, but the page you're looking for no longer exists. Start a new search below!"}
                    />
                  </div>
                </div>
              </section>
              </div>              
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NotFound;

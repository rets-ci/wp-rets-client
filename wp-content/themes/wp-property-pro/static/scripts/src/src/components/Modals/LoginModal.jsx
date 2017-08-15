import {openLoginModal} from '../../actions/index.jsx';
import BootstrapModal from './components/BootstrapModal.jsx';
import {Lib} from '../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return {
    // formModalId: state.formModal.id,
    // formModalOpen: state.formModal.open
    loginModalOpen: state.loginModal.open
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeLoginModal: () => {
      dispatch(openLoginModal(false));
    }
  }
};

class LoginModal extends Component {
  static propTypes = {
    closeLoginModal: PropTypes.func,
    loginModalOpen: PropTypes.bool.isRequired
  }

  render() {
    let {
      loginModalOpen
    } = this.props;
    return (
      <BootstrapModal
        id='loginModal'
        closeModal={() => this.props.closeLoginModal()}
        open={loginModalOpen}
      >
        <div className={`row ${Lib.THEME_CLASSES_PREFIX}login-modal-container`}>
          <div className="col-sm-6">
            <div className="card">
              <img className="card-img-top" src={`${bundle.static_images_url}landlord.png`} alt="Landlord" width="80" />
              <div className="card-block">
                <h4 className="card-title">Landlord</h4>
                <a href="https://app.propertyware.com/pw/portals/reddoorcompany/owner.action" className={`btn btn-primary ${Lib.THEME_CLASSES_PREFIX}primary-button`}>Landlord Login</a>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <img className="card-img-top" src={`${bundle.static_images_url}tenant.png`} alt="Tenant" width="80" />
              <div className="card-block">
                <h4 className="card-title">Tenant</h4>
                <a href="https://app.propertyware.com/pw/portals/reddoorcompany/tenant.action" className={`btn btn-primary`}>Tenant Login</a>
              </div>
            </div>
          </div>
        </div>
      </BootstrapModal>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (LoginModal);
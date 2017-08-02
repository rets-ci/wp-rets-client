import {openFormModal} from '../../../actions/index.jsx';
import Buy from './Buy.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = state => {
  return {
    formModalId: state.formModal.id,
    formModalOpen: state.formModal.open
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    closeFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    }
  }
};

class FormModals extends Component {

  static propTypes = {
    formModalId: PropTypes.string,
    formModalOpen: PropTypes.bool
  }
  
  render() {
    let {
      formModalId,
      formModalOpen
    } = this.props;

    return (
      <div>
        {(() => {
          switch(formModalId) {
            case 'Buy':
              return <Buy closeModal={() => this.props.closeFormModal(formModalId, false)} open={formModalOpen} />;
            default:
              null;
          }
        }) ()}
      </div>
    );
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormModals);

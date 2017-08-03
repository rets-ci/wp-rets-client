import React from 'react';
import {connect} from 'react-redux';
import DefaultLayout from './layouts/DefaultLayout.jsx';
import {Lib} from '../../../lib.jsx';
import {openFormModal} from '../../../actions/index.jsx';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    }
  }
};

const CalloutContent = ({widget_cell, openFormModal}) => {

  if (!widget_cell){
    return null;
  }

  let container;
  switch (widget_cell.widget.fields.layout) {
    case 'default_layout':
    default:
      container = <DefaultLayout item={widget_cell.widget.fields} openFormModal={openFormModal} />;
      break;
  }

  return (
    <section className={Lib.THEME_CLASSES_PREFIX+"callout"}>
      {container}
    </section>
  );
};

const Callout = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalloutContent);

export default Callout;
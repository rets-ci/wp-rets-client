import {openModal, setSearchProps} from '../actions/index.jsx';
import Api from '../containers/Api.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash'
import {Lib} from '../lib.jsx'

const stateToProps = (state) => {
  return {
    open: state.modal ? state.modal.openModal : false,
    searchResults: _.get(state, 'searchPropsState.searchProps', []),
  }
};

const dispatchToProps = (dispatch, ownProps) => {
  return {
    closeModal: () => {
      dispatch(openModal(false));
    },

    searchHandler: (term) => {
        let searchParams = {
          term: term
        };
        Api.selectQuery(searchParams,
          function (rows) {
            dispatch(setSearchProps(rows));
          }
        );
    }
  };
};

class Modal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }

  handleClose(eve) {
    eve.preventDefault();
    this.props.closeModal();
  }

  handleSearchValueChange(eve) {
    let val = eve.target.value;
    this.setState({searchValue: val});
    this.props.searchHandler(val);
  }

  render() {
    let {
      searchResults
    } = this.props;
    let resultsElements = searchResults.map((s, k) => {
      return (
        <div>
          <div key={k} className="search-title">
            <div className="container">
             <h4>{s.text}</h4>
            </div>
          </div>
          {s.children.length ?
            <ol>
              {s.children.map((c, i) =>
                <li key={i}><a href="#"><div className="container">{c.text}</div></a></li>
              )}
            </ol>
          : null}
        </div>
       )
    });
    return (
      <div className="search-modal" style={{display: this.props.open ? 'block' : 'none'}}>
        <a href="#" className="close-panel" onClick={this.handleClose.bind(this)}>
          <i className="fa fa-times"></i>
        </a>
        <form method="get" className="form-inline">
          <div className="container">
            <i className="fa fa-search"></i>
            <input
              className="form-control"
              id={Lib.THEME_PREFIX + "search-input"}
              onChange={this.handleSearchValueChange.bind(this)}
              type="text"
              value={this.state.searchValue}
            />
            <button type="button" className="btn btn-primary">Search</button>
          </div>
       </form>
       <div className="search-modal-box">
         {resultsElements}
       </div>
      </div>
    );
  }
};

export default connect(
    stateToProps,
    dispatchToProps
)(Modal);

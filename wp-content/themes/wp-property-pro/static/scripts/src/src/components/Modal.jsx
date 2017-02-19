import { openModal, setSearchProps } from '../actions/index.jsx';
import Api from '../containers/Api.jsx';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import _ from 'lodash'
import {Lib} from '../lib.jsx'

const mapStateToProps = (state) => {
  return {
    open: state.modal ? state.modal.openModal : false,
    searchResults: _.get(state, 'searchPropsState.searchProps', []),
    searchType: _.get(state, 'searchType.searchType', '')
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      this.searchInput.focus();
    }
  }

  handleClose(eve) {
    eve.preventDefault();
    this.props.closeModal();
  }

  handleResultClick(eve, tax, term, searchType) {
    eve.preventDefault();
    console.log('handleResultClick');
    browserHistory.push(`/search-result?term=${term}&tax=${tax}&searchType=${searchType}`);
  }

  handleSearchValueChange(eve) {
    let val = eve.target.value;
    this.setState({searchValue: val});
    this.props.searchHandler(val);
  }

  render() {
    let {
      searchResults,
      searchType
    } = this.props;
    let self = this;
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
                <li key={i}>
                  <a href="#" onClick={(eve) => self.handleResultClick.bind(this)(eve, s.key, c.text, searchType)}>
                    <div className="container">{c.text}</div>
                  </a>
                </li>
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
              autoComplete="off"
              className="form-control"
              id={Lib.THEME_PREFIX + "search-input"}
              onChange={this.handleSearchValueChange.bind(this)}
              ref={(input) => { this.searchInput = input; }}
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
    mapStateToProps,
    mapDispatchToProps
)(Modal);

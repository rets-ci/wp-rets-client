import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const filterTermContent = function ({term, tax, clearTermFilter}) {

    if (!term)
        return (<div></div>);

    let termId = 'tax-' + tax;

    return (<div className="search-term" id={termId}><b>{tax}</b> - <span>{term}</span> <a href="javascript:" onClick={clearTermFilter}>X</a></div>)
};

const filterTerm = connect(
    mapStateToProps,
    mapDispatchToProps
)(filterTermContent);

export default filterTerm
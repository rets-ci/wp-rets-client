import React from 'react'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const filterTermContent = function ({term, tax, clearTermFilter}) {

    if (!term)
        return (<div></div>);

    return (<div className="search-term" data-tax={tax}><b>{tax}</b> - <span>{term}</span> <a
        href="javascript:" onClick={clearTermFilter}>X</a></div>)
};

const filterTerm = connect(
    mapStateToProps
)(filterTermContent);

export default filterTerm
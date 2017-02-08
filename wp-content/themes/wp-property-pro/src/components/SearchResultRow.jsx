import React from 'react'
import {connect} from 'react-redux'
import {Lib} from '../lib.jsx'
import _ from 'lodash'

const mapStateToProps = (state) => {
    return {
        currentState: state
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const SearchResultRowContent = function ({prop, clickHandler, filterTerms}) {

    if (!prop)
        return (<div></div>);

    let taxTitle = _.get(prop, 'text', '');

    let children = prop.children.map((child) => {

        let type = jQuery('#' + Lib.THEME_PREFIX + 'search_type').val();
        let id = _.get(child, 'id', '');
        let tax = _.get(prop, 'key', '');
        let term = _.get(child, 'text', '');
        let url = [type, tax, id.toLowerCase().replace(/\s+/g, '')].join('/');

        return (<li><a href={url} onClick={(event) => {
            clickHandler(tax, term, filterTerms);
            event.preventDefault();
            event.stopPropagation();
        }}
        >{id}</a></li>)
    });

    return (
        <li>{taxTitle}
            <ul>{children}</ul>
        </li>
    )
};

const SearchResultRow = connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultRowContent);

export default SearchResultRow
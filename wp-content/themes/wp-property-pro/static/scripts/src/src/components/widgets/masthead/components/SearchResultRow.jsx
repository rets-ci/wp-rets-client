import React, {Component, PropTypes} from 'react'
import {Lib} from '../../../../lib.jsx'

export default class SearchResultRowContent extends Component {
  static propTypes = {
    prop: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
    filterTerms: PropTypes.array
  };

  render() {
    let taxTitle = this.props.prop.text;
    let children = this.props.prop.children.map((child) => {
      let type = jQuery('#' + Lib.THEME_PREFIX + 'search_type').val();
      let id = child.id;
      let tax = this.props.prop.key;
      let term = child.text;
      let url = [type, tax, id.toLowerCase().replace(/\s+/g, '')].join('/');
      return (<li><a href={url} onClick={function(event) {
          this.props.clickHandler(tax, term, this.props.filterTerms);
          event.preventDefault();
          event.stopPropagation();
      }.bind(this)}
      >{id}</a></li>)
    });
    return (
      <li>{taxTitle}
          <ul>{children}</ul>
      </li>
    );
  }
}

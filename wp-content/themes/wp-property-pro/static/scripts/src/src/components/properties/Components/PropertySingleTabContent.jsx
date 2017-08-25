import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

function showContentValue(data, esReference, booleanField) {
  if (!esReference || (!_.get(data, esReference, null) && !booleanField )) { return 'N/A'; }
  let v = _.get(data, esReference);
  let value;
  if (v instanceof Array) {
    value = v.map(d => d.name).join(', ');

    if (booleanField) {
      value = value.includes('No') || value.includes('no') || !value ? 'No' : 'Yes';
    }
  } else if (typeof v !== 'string') {
    console.log('return value in property single is an object, most likely a path referencing issue: ', value);
    value = 'N/A';
  } else {
    value = v;
    if (booleanField) {
      value = value.includes('no') || !value ? 'No' : 'Yes';
    }
  }
  return value;
}


function getContent(content, data) {
  let contentElements = content.map(c => {
    return ['N/A', '0'].indexOf(showContentValue(data, c.esReference, c.booleanField)) < 0 ?
      <li key={JSON.stringify(c)}>
        <span className={`${Lib.THEME_CLASSES_PREFIX}item-name`}>{c.name}:</span> {showContentValue(data, c.esReference, c.booleanField)}
      </li>
      : null;
  });
  return contentElements;
}

class PropertySingleTabContent extends Component {
  static propTypes = {
    tab: PropTypes.array,
    data: PropTypes.object
  }

  render() {
    let {
      tab,
      data,
    } = this.props;
    let elements = [];
    let visibleTabs = {};

    tab.forEach(colsObject => {
      Object.keys(colsObject).forEach((col, i) => {
        let colVisible = !!colsObject[col].map(c => showContentValue(data, c.esReference, c.booleanField) !== 'N/A').filter(d => d).length;
        visibleTabs[col] = colVisible;
      });
    });
  
    return (
      <div className="d-flex">
        {tab.map((p, i) =>
          <div className={Object.keys(p).some(d => visibleTabs[d]) ? "col" : null} key={i}>
            {Object.keys(p).some(d => visibleTabs[d]) ?
              <div key={JSON.stringify(p)}>
                {Object.keys(p).map((head, i) =>
                  <div key={head + i}>
                    <div className={`${Lib.THEME_CLASSES_PREFIX}property-single-div`} key={head + JSON.stringify(p[head])}>
                      <h3>{head}</h3>
                      <ul>
                        {getContent(p[head], data)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            : null}
          </div>
        )}
      </div>
    );
  }
}

export default PropertySingleTabContent;
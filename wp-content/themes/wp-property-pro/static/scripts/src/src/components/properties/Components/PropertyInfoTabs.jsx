import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {merge} from 'lodash';

import PropertySingleTabContent from './PropertySingleTabContent.jsx';

let getAllTabData = (propertyData, colNumbers) => {
	let propertyDataModified = propertyData;
	var allItems = [];
	Object.keys(propertyDataModified).forEach((tabs) => {
		propertyDataModified[tabs].forEach(cols => {
			Object.keys(cols).forEach(item => {
				allItems.push({[item]: cols[item]});
			})
		});
	});

	let itemsPerCol = Math.floor(allItems.length / colNumbers);
	let colsArray = [];
	for (var i = 0; i < colNumbers; i++) {
		(function () {
			let obj = {};
			let itemPerColLocal = itemsPerCol;
			while(itemPerColLocal > 0) {
				let poppedItem = allItems.shift();
				merge(obj, poppedItem);
				itemPerColLocal--;
			}
			if (i === (colNumbers - 1)) {
				allItems.forEach(a => {
					merge(obj, a);
				});
			}
			colsArray.push(obj);
		})(itemsPerCol)
	}

	return colsArray;

};

class PropertyInfoTabs extends Component {
  constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'Rooms'
		}
  }
  
  selectTab = (tab) => {
		this.setState({
			selectedTab: tab
		});
  }

  render() {
    let {
      data,
      propertyDataStructure
    } = this.props;
		let {
			selectedTab
    } = this.state;
    
    let propertyDataStructureModified = Object.assign({}, propertyDataStructure);
		propertyDataStructureModified['All'] = getAllTabData(Object.assign({}, propertyDataStructure), 3);
    return (
      <div className="App">
        <div id={`${Lib.THEME_CLASSES_PREFIX}property-details`}>
					<div className="card text-center mb-4">
						<div className="card-header">
							<ul className="nav nav-tabs card-header-tabs">
								{Object.keys(propertyDataStructureModified).map((p, i) =>
									<li className="nav-item" key={p}>
										<a
											className={`nav-link ${selectedTab === p ? 'active' : ''}`}
											href="#"
											onClick={(event) => { event.preventDefault(); this.selectTab(p); }}
										>{p}</a>
									</li>
								)}
							</ul>
						</div>
						<div className="card-block">
							<div>
								<PropertySingleTabContent
									tab={propertyDataStructureModified[selectedTab]}
									data={data}
								/>
							</div>
						</div>
					</div>
        </div>
      </div>
    );
  }
};

export default PropertyInfoTabs;

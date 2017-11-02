import {Lib} from '../../../lib.jsx';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import merge from 'lodash/merge';

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

	static propTypes = {
		propertyDataStructure: PropTypes.array.isRequired
	}

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
    
    // let propertyDataStructureModified = Object.assign({}, propertyDataStructure);
		// propertyDataStructureModified['All'] = getAllTabData(Object.assign({}, propertyDataStructure), 3);
		// console.log('property info tabs: ', propertyDataStructureModified);
		let tabs = propertyDataStructure.map(p => p.name);
		let content = propertyDataStructure.filter(d => d.name === selectedTab).length ? propertyDataStructure.filter(d => d.name === selectedTab)[0] : null;
    return (
			<div id={`${Lib.THEME_CLASSES_PREFIX}property-details`}>
				<div className="card text-center mb-4">
					<div className="card-header">
						<ul className="nav nav-tabs card-header-tabs">
							{tabs.map((tab) =>
								<li className="nav-item" key={tab}>
									<a
										className={`nav-link ${selectedTab === tab ? 'active' : ''}`}
										href="#"
										onClick={(event) => { event.preventDefault(); this.selectTab(tab); }}
									>{tab}</a>
								</li>
							)}
						</ul>
					</div>
					<div className="card-block">
						<div>
							<PropertySingleTabContent
								content={content}
								data={data}
							/>
						</div>
					</div>
				</div>
			</div>
    );
  }
};

export default PropertyInfoTabs;

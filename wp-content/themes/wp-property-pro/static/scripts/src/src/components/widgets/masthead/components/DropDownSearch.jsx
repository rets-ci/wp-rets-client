import React, {Component, PropTypes} from 'react';
import onClickOutside from 'react-onclickoutside';

class DropDownSearch extends Component {
  static propTypes = {
    handleChange: PropTypes.func,
    handleOptionSelect: PropTypes.func,
    labels: PropTypes.array,
    open: PropTypes.bool.isRequired,
    selectedOption: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  handleClickOutside(evt) {
   this.props.handleChange(false);
 }

 selectOption(eve, option) {
   // consume the event argument before calling the parent callback
   eve.preventDefault();
   this.props.handleOptionSelect(option);
 }

  render() {
    let self = this;
    return (
      <div className="drop-search">
        <div id="search-options-type-container" onClick={() => self.props.handleChange(true)}>
          {this.props.selectedOption}
          <i className="fa fa-caret-down"></i>
        </div>
        <ul style={{display: this.props.open ? 'block' : 'none'}}>
          {this.props.labels.map((l, i) =>
            <li key={i}><a href="#" onClick={(eve) => self.selectOption.bind(this)(eve, l)}>{l}</a></li>
          )}
        </ul>
      </div>
    );
  }
};

export default onClickOutside(DropDownSearch);

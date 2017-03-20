import React, {Component, PropTypes} from 'react';
import Desktop from './TextLayout/Desktop.jsx';
import Mobile from './TextLayout/Mobile.jsx';

class TextLayout extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    currentUrl: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      dropDownOpen: false
    };
  }

  handleSearchDropDownChange(open) {
    this.setState({dropDownOpen: open});
  }

  render() {
    return (
      <nav>
        <Mobile items={this.props.items} currentUrl={this.props.currentUrl} dropDownOpen={this.state.dropDownOpen}
                handleChange={this.handleSearchDropDownChange.bind(this)}/>
        <Desktop items={this.props.items} currentUrl={this.props.currentUrl}/>
      </nav>
    );
  }
}

export default TextLayout;

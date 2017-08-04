import PropTypes from 'prop-types';
import {openFormModal} from '../../../../actions/index.jsx';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Desktop from './TextLayout/Desktop.jsx';
import Mobile from './TextLayout/Mobile.jsx';

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    openFormModal: (id, open) => {
      dispatch(openFormModal(id, open));
    }
  }
};

class TextLayoutContent extends Component {
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
                handleChange={this.handleSearchDropDownChange.bind(this)} openFormModal={this.props.openFormModal} />
        <Desktop items={this.props.items} currentUrl={this.props.currentUrl} openFormModal={this.props.openFormModal} />
      </nav>
    );
  }
}

const TextLayout = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextLayoutContent);

export default TextLayout;

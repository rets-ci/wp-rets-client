import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

const DURATION = 500;

class GroupTransition extends Component {

  constructor(props) {
    super(props);

    this.state = {
      elements: [],
    };
    this.prevCount = 0;
  }

  componentDidMount() {
    this.setState({
      elements: this.props.children
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      elements: nextProps.children,
    });

    if (this.props.children.length < nextProps.children.length) {
      this.prevCount = this.props.children.length;
    }

    if (this.props.children.length > nextProps.children.length) {
      this.prevCount = 0;
    }
  }

  render() {
    let { fromFilterModal } = this.props;
    let { elements } = this.state;

    return (
      <TransitionGroup>
      { elements && elements.map((dom, index) => {
          let delay = DURATION * (index + 1);

          if (fromFilterModal) { // hack for properties filter modal
            if (index < this.prevCount) {
              delay = 0;
            } else {
              delay = delay - DURATION * this.prevCount;
            }
          }

          return (
            <CSSTransition
              key={ dom.key || index }
              timeout={{
                enter: delay,
                exit: 0
              }}
              classNames="toggle"
            >
            {
              React.cloneElement(dom, { className: `${dom.props.className || ''} toggle` })
            }
            </CSSTransition>
          );
        })
      }
      </TransitionGroup>
    );
  }
}

export default GroupTransition;

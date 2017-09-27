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
  }

  componentDidMount() {
    this.setState({
      elements: this.props.children
    });
    this.prevCount = -1;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      elements: nextProps.children,
    });

    if (this.props.children.length < nextProps.children.length) {
      this.prevCount = this.props.children.length;
    }

    if (this.props.children.length > nextProps.children.length) {
      this.prevCount = -1;
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
            if (this.prevCount === -1) { // initial open
              delay = delay + DURATION;
            } else if (index < this.prevCount) {  // view more - previous items
              delay = 0;
            } else { // view more - exiting items
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

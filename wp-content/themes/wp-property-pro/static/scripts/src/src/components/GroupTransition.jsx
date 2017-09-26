import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

class GroupTransition extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      elements: []
    };
    this.tick = null;
  }

  clearElements = () => {
    this.setState({
      elements: []
    });
    clearInterval(this.tick);
  }

  resetElements = (elements) => {
    const self = this;
    let index = 0;

    this.clearElements();
    this.tick = setInterval(pushElement, 500);

    function pushElement() {
      if (index === elements.length) {
        clearInterval(this.tick);
      } else {
        self.setState({
          elements: [
            ...self.state.elements,
            elements[index++]
          ]
        });
      }
    }
  }

  componentDidMount() {
    this.resetElements(this.props.children);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.resetElements(nextProps.children);
    }
  }

  componentWillUnmount() {
    this.clearElements();
  }

  render() {
    const { elements } = this.state;

    return (
      <TransitionGroup>
      { elements && elements.map((dom, index) => (
          <CSSTransition
            timeout={500}
            classNames="toggle"
            key={index}
          >
            {dom}
          </CSSTransition>
        ))
      }
      </TransitionGroup>
    );
  }
}

export default GroupTransition;

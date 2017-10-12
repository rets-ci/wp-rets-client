import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

import { Lib } from 'app_root/lib.jsx';


const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={500}
    classNames="fade"
  >
    {children}
  </CSSTransition>
);

class SearchResultsGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.setState({
      items: this.props.children
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.children,
    });
  }

  handleItemClick = (item) => {
    this.props.onClickResult(item)
  }

  render() {
    let { items } = this.state;
    let { group } = this.props;

    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-result-group`}>
        <h4 className={`${Lib.THEME_CLASSES_PREFIX}search-title container text-left`}>{group.text}</h4>
        <TransitionGroup className="list-group">
          {group.children.map((item, i) =>
            <Fade key={i}>
              <div onClick={this.handleItemClick.bind(this, item)} className="list-group-item">
                <div className="container text-left">{item.text}</div>
              </div>
            </Fade>
          )}
        </TransitionGroup>
      </div>
    );
  }
}

export default SearchResultsGroup;

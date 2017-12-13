import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import CSSTransition from 'react-transition-group/CSSTransition';

import { Lib } from 'app_root/lib.jsx';

const PAGE_SIZE = Lib.AGGREGATION_PAGE_SIZE;


const Fade = ({ children, ...props }) => (
  <CSSTransition
    {...props}
    timeout={500}
    classNames="fade"
  >
    {children}
  </CSSTransition>
);

class PaginatedSearchResults extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      itemsInitial: [],
      itemsVisible: [],
      offset: 0,
      hasMoreItems: false,
    };
  }

  componentDidMount() {
    const { group } = this.props;
    if (group && group.children) {
      this.setState({
        title: group.text,
        itemsInitial: group.children,
        itemsVisible: group.children.slice(0, PAGE_SIZE),
        offset: PAGE_SIZE,
        hasMoreItems: group.children.length > PAGE_SIZE,
      });
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  handleItemClick = (item) => {
    this.props.onClickResult(item)
  }

  handleMoreClick = () => {
    if (!this.state.hasMoreItems) {
      return;
    }

    this.setState(prevState => {
      const total = prevState.itemsInitial.length;
      const hasMoreItems = total > prevState.offset + PAGE_SIZE;
      const newItems = prevState.itemsInitial.slice(prevState.offset, prevState.offset + PAGE_SIZE)

      return {
        itemsVisible: prevState.itemsVisible.concat(newItems),
        offset: prevState.offset + PAGE_SIZE,
        hasMoreItems,
      };
    });
  }

  render() {
    let { title, itemsVisible, hasMoreItems } = this.state;
    let { className } = this.props;
    return (
      <div className={`${Lib.THEME_CLASSES_PREFIX}search-result-group ${className || ''}`}>
        <h4 className={`${Lib.THEME_CLASSES_PREFIX}search-title container text-left`}>{title}</h4>
        <TransitionGroup className="list-group">
          {itemsVisible.map((item, i) =>
            <Fade key={i}>
              <div onClick={this.handleItemClick.bind(this, item)} className="list-group-item">
                <div className="container text-left">{item.text}</div>
              </div>
            </Fade>
          )}
        </TransitionGroup>
        {hasMoreItems &&
          <div className={`${Lib.THEME_CLASSES_PREFIX}view-link container text-left`} onClick={this.handleMoreClick}>
            {`+ Load More`}
          </div>
        }
      </div>
    );
  }
}

export default PaginatedSearchResults;

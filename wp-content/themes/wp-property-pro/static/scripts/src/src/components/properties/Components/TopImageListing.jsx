import React, {Component, PropTypes} from 'react';

class TopImageListing extends Component {
  static propTypes = {
    images: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div style={{backgroundColor: 'black', height: '100px'}}>

      </div>
    )
  }
}

export default TopImageListing;
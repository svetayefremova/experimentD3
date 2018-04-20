import React, { Component } from 'react';

class Spots extends Component {
  componentDidMount() {
    console.log('mount');
    this.createSpots();
  }

  createSpots = () => {
    const svg = this.node;
  };

  render() {
    return (
      <div>
        <svg 
          ref={node => this.node = node} 
          width={600}
          height={600}>
        </svg>
      </div>
    );
  }
}

export default Spots;
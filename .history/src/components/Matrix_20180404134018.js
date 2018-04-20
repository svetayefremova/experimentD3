import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class Matrix extends Component {
  componentDidMount() {
    this.createMatrix();
  }

  createMatrix = () => {
    const node = this.node;
    
  };

  render() {
    return (
      <div className="Matrix">
        <svg 
          ref={node => this.node = node} 
          width={500}
          height={500}>
        </svg>
      </div>
    );
  }
}

export default Matrix;
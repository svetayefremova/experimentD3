import React, { Component } from 'react';
import { csv } from 'd3-fetch';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import './Matrix.scss';

const WIDTH = 500;
const HEIGHT = 500;

class Matrix extends Component {
  componentDidMount() {
    this.createMatrix();
  }

  createMatrix = async () => {
    const node = this.node;

    const data = await csv('./matrixNodes.csv');
    console.log(data);
  };

  render() {
    return (
      <div className="Matrix">
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Matrix;
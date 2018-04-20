import React, { Component } from 'react';
import { csv } from 'd3-fetch';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import nodes from './matrixNodes.csv';
import edges from './matrixEdges.csv';
import './Matrix.scss';

const WIDTH = 500;
const HEIGHT = 500;

class Matrix extends Component {
  componentDidMount() {
    this.createMatrix();
  }

  createMatrix = () => {
    const node = this.node;
    console.log(edges);
    const edgeHash = {};
    for (let x in edges) {
        const id = edges[x].source + "-" + edges[x].target;
        edgeHash[id] = edges[x];
    };
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
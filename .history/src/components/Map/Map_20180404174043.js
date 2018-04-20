import React, { Component } from 'react';
import { scalePoint } from 'd3-scale';
import { axisTop, axisLeft } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import './Map.scss';

const WIDTH = 500;
const HEIGHT = 500;

class Map extends Component {
  componentDidMount() {
	  this.createMap();
  }

  createMap = () => {
    const svg = this.node;

   
  };

  render() {
    return (
      <div className="Map">
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Map;
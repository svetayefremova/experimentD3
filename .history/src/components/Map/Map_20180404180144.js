import React, { Component } from 'react';
import { json } from 'd3-fetch';
import { scalePoint } from 'd3-scale';
import { axisTop, axisLeft } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import WorldData from 'world-map-geojson';
import './Map.scss';

const WIDTH = 500;
const HEIGHT = 500;

class Map extends Component {
  componentDidMount() {

	  this.createMap();
  }

  createMap = () => {
    const svg = this.node;

    console.log(WorldData);
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
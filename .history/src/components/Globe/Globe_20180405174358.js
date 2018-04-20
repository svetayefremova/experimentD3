import React, { Component } from 'react';
import { select, selectAll, event } from 'd3-selection';
import { geoPath, geoGraticule, geoOrthographic } from 'd3-geo';
import { zoom } from 'd3-zoom';
import WorldData from 'world-map-geojson';
import cities from './cities.csv';

const WIDTH = 700;
const HEIGHT = 500;
const projection = geoOrthographic()
  .scale(200)
  .translate([WIDTH / 2, HEIGHT / 2])
  .center([0,0]);
const path = geoPath(projection);
const graticule = geoGraticule();

class Globe extends Component {
  componentDidMount() {
	this.createGlobe();
  }

  createGlobe = () => {
    const svg = this.node;
  };

  render() {
    return (
      <div className="Globe">
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Globe;
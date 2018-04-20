import React, { Component } from 'react';
import { select } from 'd3-selection';
import { mercator, geoPath, geoNaturalEarth1 } from 'd3-geo';
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
    const projection = geoNaturalEarth1();
    select(svg)
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", geoPath(projection))
      .attr("class", "countries");
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
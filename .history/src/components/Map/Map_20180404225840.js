import React, { Component } from 'react';
import { select } from 'd3-selection';
import { geoPath, geoNaturalEarth1 } from 'd3-geo';
import WorldData from 'world-map-geojson';
import cities from './cities.csv';
import './Map.scss';

const WIDTH = 500;
const HEIGHT = 500;

class Map extends Component {
  componentDidMount() {
	  this.createMap();
  }

  createMap = () => {
    const svg = this.node;
    const projection = geoNaturalEarth1()
      .scale(80)
      .translate([WIDTH / 2, HEIGHT / 2]);
    console.log(projection([122, 12]));

    select(svg)
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", geoPath(projection))
      .style("fill", "gray");
    
    select(svg).selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .style("fill", "red")
      .attr("class", "cities")
      .attr("r", 3)
      .attr("cx", d => projection([d.x,d.y])[0])
      .attr("cy", d => projection([d.x,d.y])[1]);
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
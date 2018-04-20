import React, { Component } from 'react';
import { select, selectAll } from 'd3-selection';
import { geoPath, geoNaturalEarth1, geoBounds, geoCentroid } from 'd3-geo';
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
      .scale(90)
      .translate([WIDTH / 2, HEIGHT / 2]);

    select(svg)
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", geoPath(projection))
      .attr("class", "countries")
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

    selectAll("path.countries")
      .on("mouseover", (d) => this.centerBounds(svg, geoBounds(d), geoCentroid(d), projection))
      .on("mouseout", this.clearCenterBounds)
  };

  centerBounds(svg, bounds, center, projection) {
    console.log(center);
    select(svg)
      .append("rect")
      .attr("class", "bbox")
      .attr("x", bounds[0][0])
      .attr("y", bounds[0][1])
      .attr("width", bounds[1][0] - bounds[0][0])
      .attr("height", bounds[1][1] - bounds[0][1])
      .style("fill", "none")
      .style("stroke-dasharray", "5 5")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .style("pointer-events", "none");

    select(svg)
      .append("circle")
      .attr("class", "centroid")
      .style("fill", "red")
      .attr("r", 5)
      .attr("cx", center[0])
      .attr("cy", center[1])
      .style("pointer-events", "none");
  }

  clearCenterBounds() {
    selectAll("circle.centroid").remove();
    selectAll("rect.bbox").remove();
  }

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
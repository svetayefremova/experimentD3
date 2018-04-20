import React, { Component } from 'react';
import { select, selectAll, event } from 'd3-selection';
import { geoPath, geoGraticule } from 'd3-geo';
import { geoFahey } from 'd3-geo-projection';
import { zoom } from 'd3-zoom';
import WorldData from 'world-map-geojson';
import cities from './cities.csv';
import './Map.scss';

const WIDTH = 700;
const HEIGHT = 500;
const projection = geoFahey()
  .scale(120)
  .translate([WIDTH / 2, HEIGHT / 2]);
const path = geoPath(projection);
const graticule = geoGraticule();

class Map extends Component {
  componentDidMount() {
	  this.createMap();
  }

  createMap = () => {
    const node = this.node;
    const svg = select(node).append("g");
    
    select(svg)
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", path)
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
      .on("mouseover", (d) => this.centerBounds(svg, path.bounds(d), path.centroid(d)))
      .on("mouseout", this.clearCenterBounds);

    select(svg).append("path")
      .datum(graticule)
      .attr("class", "graticule line")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");
    
    select(svg).append("path")
      .datum(graticule.outline)
      .attr("class", "graticule outline")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1px");

    const mapZoom = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [-WIDTH * 2, -HEIGHT * 2],
        [WIDTH * 2, HEIGHT * 2]
      ])
      .on("zoom", zoomed);
    function zoomed(d) {
      console.log('zoomed');
      console.log(event);
      g.attr("transform", event.transform);
    }

    select(svg).call(mapZoom);
  };

  centerBounds(svg, bounds, center) {
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
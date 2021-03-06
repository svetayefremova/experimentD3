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

class Map extends Component {
  constructor() {
    super();
    this.projection = geoFahey()
      .scale(120)
      .translate([WIDTH / 2, HEIGHT / 2]);
    this.path = geoPath(this.projection);
    this.graticule = geoGraticule();
  }
  componentDidMount() {
	  this.createMap();
  }

  createMap = () => {
    const svg = this.node;
    const view = select(svg)
      .attr("class", "svg")
      .append("g")
      .attr("class", "view");

    view
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "countries")
      .style("fill", "gray");
    
    view.selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .style("fill", "red")
      .attr("class", "cities")
      .attr("r", 3)
      .attr("cx", d => this.projection([d.x,d.y])[0])
      .attr("cy", d => this.projection([d.x,d.y])[1]);

    selectAll("path.countries")
      .on("mouseover", (d) => this.createCenterBounds(view.node(), this.path.bounds(d), this.path.centroid(d)))
      .on("mouseout", this.clearCenterBounds);

    view.append("path")
      .datum(this.graticule)
      .attr("class", "graticule line")
      .attr("d", this.path)
      .style("fill", "none")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");
    
    view.append("path")
      .datum(this.graticule.outline)
      .attr("class", "graticule outline")
      .attr("d", this.path)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1px");  
    
    this.mapZoom = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [-WIDTH * 2, -HEIGHT * 2],
        [WIDTH * 2, HEIGHT * 2]
      ])
      .on("zoom", () => view.attr("transform", event.transform));
  
    select('svg').call(this.mapZoom);
  };

  createCenterBounds(node, bounds, center) {
    select(node)
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

    select(node)
      .append("circle")
      .attr("class", "centroid")
      .style("fill", "red")
      .attr("r", 4)
      .attr("cx", center[0])
      .attr("cy", center[1])
      .style("pointer-events", "none");
  }

  clearCenterBounds() {
    selectAll("circle.centroid").remove();
    selectAll("rect.bbox").remove();
  }

  onZoomIn = () => {
    this.mapZoom.scaleBy(select('svg'), 2)
  }

  onZoomOut = () => {
    this.mapZoom.scaleBy(select('svg'), 0.5)
  }

  render() {
    return (
      <div className="Map">
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
        <div className="Map-controls">
          <button onClick={this.onZoomOut}>Zoom out</button>
          <button onClick={this.onZoomIn}>Zoom in</button>
        </div>
      </div>
    );
  }
}

export default Map;
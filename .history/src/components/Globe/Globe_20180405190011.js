import React, { Component } from 'react';
import { select, selectAll, event, mouse } from 'd3-selection';
import { geoPath, geoOrthographic, geoGraticule } from 'd3-geo';
import { drag } from 'd3-drag';
import WorldData from 'world-map-geojson';
import cities from './cities.csv';

const WIDTH = 700;
const HEIGHT = 500;

class Globe extends Component {
  constructor() {
    super();
    this.projection = geoOrthographic()
      .scale(250)
      .translate([WIDTH / 2, HEIGHT / 2])
      .clipAngle(90);
    this.path = geoPath(this.projection);
    this.graticule = geoGraticule();
  }

  componentDidMount() {
	  this.createGlobe();
  }

  createGlobe = () => {
    const svg = this.node;

    select(svg)
      .attr('class', 'svg')
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "countries")
      .style("fill", "gray");

    select(svg).selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .style("fill", "red")
      .attr("class", "cities")
      .attr("r", 3)
      .attr("cx", d => this.projection([d.x,d.y])[0])
      .attr("cy", d => this.projection([d.x,d.y])[1]);

    selectAll("path.countries")
      .on("mouseover", d => {})
      .on("mouseout", d => {});

    select(svg).append("path")
      .datum(this.graticule)
      .attr("class", "graticule line")
      .attr("d", this.path)
      .style("fill", "none")
      .style("stroke", "lightgray")
      .style("stroke-width", "1px");
    
    select(svg).append("path")
      .datum(this.graticule.outline)
      .attr("class", "graticule outline")
      .attr("d", this.path)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "1px");  

    const mapDrag = drag()    
      .on("start", this.startRotating)
      .on("drag", this.onRotating)
      .on("end", this.stopRotating);

    select(svg).call(mapDrag); 
  };

  startRotating() {
    const gpos0 = this.projection.invert(mouse(this));

    select('svg')
      .insert("path")
      .datum({type: "Point", coordinates: gpos0})
      .attr("class", "point")
      .attr("d", this.path); 
  }

  stopRotating() {
    select('svg').on("mousemove", null);
  }

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
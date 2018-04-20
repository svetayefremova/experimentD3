import React, { Component } from 'react';
import { select, selectAll, event, mouse } from 'd3-selection';
import { geoPath, geoOrthographic } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
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

class Globe extends Component {
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
      .attr("d", path)
      .attr("class", "countries")
      .style("fill", "gray");

    const mapZoom = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [-WIDTH * 2, -HEIGHT * 2],
        [WIDTH * 2, HEIGHT * 2]
      ])
      .on("zoom", () => svg.attr("transform", event.transform));

    select(svg).call(mapZoom);
    
    select(svg)
      .on("mousedown", this.startRotating)
      .on("mouseup", this.stopRotating);
  };

  startRotating() {
    const rotateScale = scaleLinear()
      .domain([0, WIDTH])
      .range([-180, 180]);

    select('svg')
      .on('mousemove', () => {
        const p = mouse(this);
        projection.rotate([rotateScale(p[0]), 0]);
        this.zoomed();
      });
  }

  stopRotating() {
    select('svg').on("mousemove", null);
  }

  zoomed() {
    const currentRotate = projection.rotate()[0];
      
    selectAll("circle.cities")
      .style("display", d => d.y + currentRotate < 90 && d.y + currentRotate > -90 ? "block" : "none");
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
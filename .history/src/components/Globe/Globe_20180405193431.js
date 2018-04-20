import React, { Component } from 'react';
import { select, selectAll, event, mouse } from 'd3-selection';
import { geoPath, geoOrthographic, geoGraticule } from 'd3-geo';
import { scaleLinear } from 'd3-scale';
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
    console.log(cities);

    select(svg)
      .attr('class', 'svg')
      .selectAll("path")
      .data(WorldData.features)
      .enter()
      .append("path")
      .attr("d", this.path)
      .attr("class", "country")
      .style("fill", "gray");

    select(svg).selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .style("fill", "red")
      .attr("class", "city")
      .attr("r", 3)
      .attr("cx", d => this.projection([d.x,d.y])[0])
      .attr("cy", d => this.projection([d.x,d.y])[1]);

    selectAll("path.country")
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

    const λ = scaleLinear()
      .domain([0, WIDTH])
      .range([-180, 180]);

    const φ = scaleLinear()
      .domain([0, HEIGHT])
      .range([90, -90]);

    const pointpath = (d, r) => {
      const pr = this.path.pointRadius(r);
      return pr({
        type: "Point",
        coordinates: [d.x, d.y]
      })
    }

    const mapDrag = drag().subject(() => {
        const r = this.projection.rotate();
        return {
          x: λ.invert(r[0]),
          y: φ.invert(r[1])
        };
      })
      .on("drag", () => {
        this.projection.rotate([λ(event.x), φ(event.y)]);
        select(svg).selectAll("path.city").attr("d", d => {
          console.log(d);
          //return pointpath(d, d.magnitude * 2.5);
        });
        select(svg).selectAll("path.graticule").attr("d", this.path);
      });

    select(svg).call(mapDrag); 
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
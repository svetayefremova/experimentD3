import React, { Component } from 'react';
import { select, selectAll, event } from 'd3-selection';
import { geoPath, geoOrthographic, geoGraticule, geoDistance, geoArea } from 'd3-geo';
import { extent } from 'd3-array';
import { scaleLinear, scaleQuantize } from 'd3-scale';
import { interpolatePuRd } from 'd3-scale-chromatic';
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
      .attr("class", "country")
      .style("fill", "gray");

    selectAll(".country")
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
  
    const xScale = scaleLinear()
      .domain([0, WIDTH])
      .range([-180, 180]);

    const yScale = scaleLinear()
      .domain([0, HEIGHT])
      .range([90, -90]);

    const pointpath = (d, r) => {
      const pr = this.path.pointRadius(r);
      return pr({
        type: "Point",
        coordinates: [d.x, d.y]
      })
    }

    select(svg)
      .selectAll(".city")
      .data(cities)
      .enter()
      .append("path")
      .attr("class", "city")
      .attr("d", d => pointpath(d, 0))
      .transition()
      .delay((d, i) => i * 200)
      .duration(200)
      .attr("d", (d) => pointpath(d, 5));
    
    select(svg)
      .selectAll('.label')
      .data(cities)
      .enter()
      .append('text')
      .attr("class", "label")
      .text(d => d.label);

    //this.positionLabels();

    const mapDrag = drag().subject(() => {
      const r = this.projection.rotate();
      return {
        x: xScale.invert(r[0]),
        y: yScale.invert(r[1])
      };
    })
      .on("drag", () => {
        this.projection.rotate([xScale(event.x), yScale(event.y)]);
        select(svg).selectAll(".city").attr("d", d => pointpath(d, 5));
        select(svg).selectAll(".graticule").attr("d", this.path);
        select(svg).selectAll(".country").attr("d", this.path);
      });

    select(svg).call(mapDrag); 

    const featureData = selectAll(".country").data();
    const realFeatureSize = extent(featureData, d => geoArea(d));
    const newFeatureColor = scaleQuantize(interpolatePuRd).domain(realFeatureSize);
    selectAll(".country")
      .style("fill", (d, i) => newFeatureColor(geoArea(d)));
  };

  // positionLabels() {
  //   const centerPos = this.projection.invert([WIDTH/2, HEIGHT/2]);
  //   const proj = (d) => {
  //     this.projection([d.x, d.y]);
  //     return d;
  //   }

  //   select('svg').selectAll(".label")
  //     .attr("transform", (d) => {
  //       const loc = proj([d.x, d.y]),
  //         x = loc[0],
  //         y = loc[1];
  //       console.log(loc);
  //       const offset = x < WIDTH/2 ? -5 : 5;
  //       return "translate(" + (x+offset) + "," + (y-2) + ")"
  //     })
  //     .style("display", (d) => {
  //       const dim = geoDistance([d.x, d.y], centerPos);
  //       return (dim > 1.57) ? 'none' : 'inline';
  //     })
  // }

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
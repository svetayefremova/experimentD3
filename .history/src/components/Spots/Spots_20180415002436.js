import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';

const WIDTH = 600;
const HEIGHT = 600;

class Spots extends Component {
  componentDidMount() {
    this.createSpots();
  }

  createSpots = () => {
    const svg = this.node;
    
    const nodes = range(200).map(() => {
      return {
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT
      };
    });

    const d3Voronoi = voronoi();

    select(svg).append("g")
      .attr("class", "polygons")
      .selectAll("path")
      .data(d3Voronoi.polygons(nodes))
      .enter().append("path")
      .call((d) => d
        .attr("d", data => data ? `M${data.join("L")}Z` : null)
      );
    
    select(svg).append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(d3Voronoi.links(nodes))
      .enter().append("line")
      .call(link => link
        .attr("x1", d => d.source[0])
        .attr("y1", d => d.source[1])
        .attr("x2", d => d.target[0])
        .attr("y2", d => d.target[1])
      );
  
    select(svg).append("g")
      .attr("class", "sites")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 2.5)
      .call(site => site
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
      );

    // function redrawLink(link) {
    //   link
    //     .attr("x1", d => d.source[0])
    //     .attr("y1", d => d.source[1])
    //     .attr("x2", d => d.target[0])
    //     .attr("y2", d => d.target[1]);
    // }
      
    // function redrawSite(site) {
    //   site
    //     .attr("cx", d => d[0])
    //     .attr("cy", d => d[1]);
    // }
  };

  render() {
    return (
      <div>
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Spots;
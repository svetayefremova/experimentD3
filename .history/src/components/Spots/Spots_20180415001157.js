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

    const vor = voronoi(nodes);

    select(svg).append("g")
      .attr("class", "polygons")
      .selectAll("path")
      .data(vor.polygons(nodes))
      .enter().append("path")
      .call((path) => path.attr("d", d => d ? `M${d.join("L")}Z` : null));
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
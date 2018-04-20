import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { select } from 'd3-selection';

const data = [
  {n: 0, r: 0}, 
  {n: 100, r: 50}, 
  {n: 200, r: 300}, 
  {n: 400, r: 400}
]

class Linear extends Component {
  componentDidMount() {
    this.createLinear();
  }

  createLinear = () => {
    const svg = this.svg;

    const xLineScale = scaleLinear()
      .domain(extent(data, function(d) {return d.n}))
      .range([0, 300]);
    const yLineScale = scaleLinear()
      .domain(extent(data, function(d) {return d.r}))
      .range([0, 300]);

    select(svg).selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
        .attr('cx', function(d,i) {return xLineScale(d.n)})
        .attr('cy', function(d,i) { return yLineScale(d.r)})
        .attr('r', 15);
  };

  render() {
    return (
      <div>
        <svg 
          ref={svg => this.svg = svg} 
          width={300}
          height={300}>
        </svg>
      </div>
    );
  }
}

export default Linear;
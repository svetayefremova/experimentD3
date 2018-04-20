import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { select } from 'd3-selection';

const data = [
  {friends: 5, salary: 22000},
  {friends: 3, salary: 18000}, 
  {friends: 10, salary: 88000},
  {friends: 0, salary: 180000}, 
  {friends: 27, salary: 56000},
  {friends: 8, salary: 74000}
]

class Linear extends Component {
  componentDidMount() {
    this.createLinear();
  }

  createLinear = () => {
    const svg = this.svg;

    const xLineScale = scaleLinear()
      .domain(extent(data, d => d.salary))
      .range([0, 300]);
    const yLineScale = scaleLinear()
      .domain(extent(data, d => d.friends))
      .range([0, 300]);

    select(svg).selectAll('circle')
      .data(data).enter()
      .append('circle')
        .attr('cx', (d,i) => xLineScale(d.salary))
        .attr('cy', (d,i) => yLineScale(d.friends))
        .attr('r', 5);
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
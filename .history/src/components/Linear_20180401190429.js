import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisRight } from 'd3-axis';

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
    const WIDTH = 300;
    const HEIGHT = 300;

    const xScale = scaleLinear()
      .domain(extent(data, d => d.salary))
      .range([0, WIDTH]);
    const yScale = scaleLinear()
      .domain(extent(data, d => d.friends))
      .range([0, HEIGHT]);

    const xAxis = axisBottom(xScale).ticks(4);
    select(svg)
      .append("g")
      .attr("id", "xAxisG")
      .attr("transform", "translate(0,30)")
      .call(xAxis);
      
    const yAxis = axisRight(yScale).ticks(16).tickSize(HEIGHT);
    select(svg)
      .append("g")
      .attr("id", "yAxisG")
      .attr("transform", "translate(0,30)")
      .call(yAxis);

    select(svg).selectAll('circle')
      .data(data).enter()
      .append('circle')
        .attr('cx', (d,i) => xScale(d.salary))
        .attr('cy', (d,i) => yScale(d.friends))
        .attr('r', 5);
  };

  render() {
    return (
      <div className='linear'>
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
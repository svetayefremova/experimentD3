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
];
const SVG_WIDTH = 300;
const SVG_HEIGHT = 300;
const MARGIN = {top: 15, left: 15, bottom: 15, right: 15};
const WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right;
const HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom;

class Linear extends Component {
  componentDidMount() {
    this.createLinear();
  }

  createLinear = () => {
    const svg = this.svg;

    const chart = select(svg).append('g')
      .attr('id', 'chart')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const xScale = scaleLinear()
      .domain(extent(data, d => d.salary))
      .range([0, WIDTH]);
    const yScale = scaleLinear()
      .domain(extent(data, d => d.friends))
      .range([0, HEIGHT]);

    const xAxis = axisBottom(xScale).ticks(4).tickSize(WIDTH);
    chart
      .append("g")
      .attr("id", "xAxisG")
      .attr('transform', 'translate(0, 0)')
      .call(xAxis)
      
    const yAxis = axisRight(yScale).ticks(27).tickSize(HEIGHT);
    chart
      .append("g")
      .attr("id", "yAxisG")
      .call(yAxis);

    chart.selectAll('circle')
      .data(data).enter()
      .append('circle')
        .attr('cx', (d,i) => xScale(d.salary))
        .attr('cy', (d,i) => 27 - yScale(d.friends))
        .attr('r', 5);
  };

  render() {
    return (
      <div className='linear'>
        <svg 
          ref={svg => this.svg = svg} 
          width={SVG_WIDTH}
          height={SVG_HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Linear;
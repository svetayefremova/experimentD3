import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveCardinal } from 'd3-shape';

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
    data.sort((a,b) => b.salary - a.salary);
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
      .range([HEIGHT, 0]);

    const xAxis = axisBottom(xScale).ticks(4).tickSize(WIDTH);
    chart
      .append("g")
      .attr("id", "xAxisG")
      .call(xAxis)
      
    const yAxis = axisLeft(yScale).ticks(27).tickSize(-HEIGHT);
    chart
      .append("g")
      .attr("id", "yAxisG")
      .call(yAxis);

    chart.selectAll('circle')
      .data(data).enter()
      .append('circle')
        .attr('cx', d => xScale(d.salary))
        .attr('cy', d => yScale(d.friends))
        .attr('r', 5);

    const chartLine = line().x(d =>  xScale(d.salary)).y(d => yScale(d.friends)).curve(curveCardinal);
    chart
      .append("path")
      .attr("d", chartLine(data))
      .attr("fill", "none")
      .attr("stroke", "darkred")
      .attr("stroke-width", 2);
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
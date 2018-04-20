import React, { Component } from 'react';
import { select } from 'd3-selection';
import { merge } from 'd3-array';
import { values} from 'd3-collection';
import { forceSimulation, forceLink, forceCollide, forceCenter, forceManyBody } from 'd3-force';

import graph from './adjustmentList.json';

const WIDTH = 600;
const HEIGHT = 600;

class AdjustmentList extends Component {
  componentDidMount() {
    this.createAdjustmentList();
  }

  componentDidUpdate() {
    this.createAdjustmentList();
  }

  createAdjustmentList = () => {
    const svg = this.svg;

    const nodes = values(graph),
          links = merge(nodes.map(source => {
            return source.map((target, index) => {
              return {
                source: source, 
                target: graph[target],
                index: index
              };
            });
          }));

    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-60))
      .force('link', forceLink(links).strength(1).distance(60))
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2));

    const link = select(svg).selectAll(null)
      .data(links)
      .enter()
      .append('line');

    const node = select(svg).selectAll(null)
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 3);

    const label = select(svg).selectAll(null)
      .data(nodes)
      .enter()
      .append('text')
      .text((d, i) => `${i + 1} : [${d}]`)
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 12);

    const tick = () => {
      link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x)
         .attr("cy", d => d.y);

      label.attr("x", d => d.x - 5)
         .attr("y", d =>  d.y - 15);
    };

    simulation
      .on('tick', tick)
      .force('link')
      .links(links)
  };

  render() {
    return (
      <div>
        <svg 
          ref={svg => this.svg = svg} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default AdjustmentList;
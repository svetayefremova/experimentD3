import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import './Spots.scss';

const WIDTH = 400;
const HEIGHT = 400;
const HEART_STR = "M240.438984,75.1180229 C213.906656,13.0479209 138.485199,27.5290591 138.001548,99.5711057 C137.727478,139.139685 173.916719,153.927901 198.010636,169.746443 C221.387137,185.100328 238.004604,206.070503 240.608262,215 C242.841121,206.248285 261.360952,184.667995 282.988245,169.31411 C306.634785,152.521808 343.271403,138.703311 342.997334,99.1387726 C342.485469,26.9189442 265.766213,15.5207045 240.438984,75.1180229 Z";
const HEART = new Path2D(HEART_STR);
const heart = [{
  x: 240.438984,
  y: 75.1180229
}, {
  x: 213.906656,
  y: 13.0479209
}, {
  x: 138.485199,
  y: 27.5290591
}, {
  x: 138.001548,
  y: 99.5711057
}, {
  x: 137.727478,
  y: 139.139685
}, {
  x: 173.916719,
  y: 153.927901
}, {
  x: 198.010636,
  y: 185.100328
}, {
  x: 221.387137,
  y: 13.0479209
}, {
  x: 238.004604,
  y: 206.070503
}, {
  x: 240.608262,
  y: 215
}, {
  x: 242.841121,
  y: 206.248285
}, {
  x: 261.360952,
  y: 184.667995
}, {
  x: 282.988245,
  y: 169.31411
}, {
  x: 306.634785,
  y: 152.521808
}, {
  x: 343.271403,
  y: 138.703311
}, {
  x: 342.997334,
  y: 99.1387726
}, {
  x: 342.485469,
  y: 26.9189442
}, {
  x: 265.766213,
  y: 15.5207045
}]

class Spots extends Component {
  componentDidMount() {
    this.createSpots();
  }

  createSpots = () => {
    const canvas = this.node;
    select(canvas)
      .attr('width', WIDTH)
      .attr('height', HEIGHT);
    const ctx = canvas.getContext('2d');

    const nodes = [].concat(heart);

    range(50).map(() => {
      let x = Math.random() * WIDTH;
      let y = Math.random() * HEIGHT;

      if (!ctx.isPointInPath(HEART, x, y)) {
        do {
          x = Math.random() * WIDTH;
          y = Math.random() * HEIGHT;
        } while (!ctx.isPointInPath(HEART, x, y))
      } else {
        nodes.push({x, y});
      }

      return nodes;
    });

    const d3Voronoi = voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    ctx.globalCompositeOperation = "source-over";
    
    ctx.beginPath();
    nodes.forEach((d) => {
      ctx.lineTo(d.x, d.y)
    });
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.stroke();
    //ctx.clip();

    // ctx.beginPath();
    // links.forEach((d) => {
    //   ctx.moveTo(d.source.x, d.source.y);
    //   ctx.lineTo(d.target.x, d.target.y);
    // });
    // ctx.strokeStyle = "rgba(0,0,0,0.4)";
    // ctx.stroke();

    ctx.beginPath();
    nodes.forEach((d) => {
      ctx.moveTo(d.x + 2.5, d.y);
      ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI, false);
    });
    ctx.fillStyle = "black";
    ctx.fill();

    // select(canvas).append("g")
    //   .attr("class", "polygons")
    //   .selectAll("path")
    //   .data(d3Voronoi.polygons(nodes))
    //   .enter().append("path")
    //   .call((path) => path
    //     .attr("d", d => d ? `M${d.join("L")}Z` : null)
    //   );
    
    // select(canvas).append("g")
    //   .attr("class", "links")
    //   .selectAll("line")
    //   .data(d3Voronoi.links(nodes))
    //   .enter().append("line")
    //   .call(link => link
    //     .attr("x1", d => d.source.x)
    //     .attr("y1", d => d.source.y)
    //     .attr("x2", d => d.target.x)
    //     .attr("y2", d => d.target.y)
    //   );
  
    // select(canvas).append("g")
    //   .attr("class", "points")
    //   .selectAll("circle")
    //   .data(nodes)
    //   .enter().append("circle")
    //   .attr("r", 2.5)
    //   .call(point => point
    //     .attr("cx", d => d.x)
    //     .attr("cy", d => d.y)
    //   );
  };

  render() {
    return (
      <div>
        <canvas 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </canvas>
      </div>
    );
  }
}

export default Spots;
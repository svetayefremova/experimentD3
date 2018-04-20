import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import './Spots.scss';

const WIDTH = 400;
const HEIGHT = 400;
const data = [{
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
}, {
  x: 240.438984,
  y: 75.1180229
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

    const nodes = [].concat(data);
    const d3Line = line()
      .x(d => d.x)
      .y(d => d.y);
    const heart = d3Line(data);
 
    range(50).map(() => {
      let x = Math.random() * WIDTH;
      let y = Math.random() * HEIGHT;

      if (!ctx.isPointInPath(heart, x, y)) {
        do {
          x = Math.random() * WIDTH;
          y = Math.random() * HEIGHT;
        } while (!ctx.isPointInPath(heart, x, y))
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
    data.forEach((d) => {
      ctx.lineTo(d.x, d.y)
    });
    ctx.clip();

    ctx.beginPath();
    links.forEach((d) => {
      ctx.moveTo(d.source.x, d.source.y);
      ctx.lineTo(d.target.x, d.target.y);
    });
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.stroke();

    ctx.beginPath();
    nodes.forEach((d) => {
      ctx.moveTo(d.x + 2.5, d.y);
      ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI, false);
    });
    ctx.fillStyle = "black";
    ctx.fill();
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
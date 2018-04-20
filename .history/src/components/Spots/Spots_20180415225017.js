import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { scaleSequential } from 'd3-scale';
import { interpolatePuRd } from 'd3-scale-chromatic';
import { timer } from 'd3-timer';
import data from './heart.csv';
import './Spots.scss';

const WIDTH = 600;
const HEIGHT = 600;

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
    ctx.translate(43, 64);

    const colorScale = scaleSequential(interpolatePuRd);

    for (let el of data) {
      const color = colorScale(Math.random());
      Object.assign(el, { color, radius: 0 });
    }

    const nodes = [].concat(data);
    const d3Line = line()
      .x(d => d.x)
      .y(d => d.y);
    const heart = new Path2D(d3Line(data));
 
    range(50).map(() => {
      let x = Math.random() * WIDTH;
      let y = Math.random() * HEIGHT;

      if (!ctx.isPointInPath(heart, x, y)) {
        do {
          x = Math.random() * WIDTH;
          y = Math.random() * HEIGHT;
        } while (!ctx.isPointInPath(heart, x, y))
      } else {
        const color = colorScale(Math.random());
        nodes.push({x, y, color, radius: 0});
      }

      return nodes;
    });

    const d3Voronoi = voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    this.drawCanvas(nodes, links, ctx);
  };

  drawCanvas(nodes, links, ctx) {
    // clip with heart shape
    ctx.beginPath();
    data.forEach((d) => {
      ctx.lineTo(d.x, d.y)
    });
    ctx.clip();

    ctx.globalCompositeOperation = "soft-light";

    // bubbles
    const time = timer(elapsed => {
      if (elapsed > 1500) time.stop();
      nodes.forEach((d) => {
        const radius = WIDTH * (0.1 + Math.random() * 0.25);
        const rad = d.radious + 10
        if (rad < radius) d.radious = rad;
      });
    }, 150);

    nodes.forEach((d) => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.arc(d.x, d.y, 0, 0, 2 * Math.PI, false);
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.closePath();
    });

    ctx.globalCompositeOperation = "source-over";

    //  lines that connected points
    ctx.beginPath();
    links.forEach((d) => {
      ctx.moveTo(d.source.x, d.source.y);
      ctx.lineTo(d.target.x, d.target.y);
    });
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.stroke();

    // points
    ctx.beginPath();
    nodes.forEach((d) => {
      ctx.moveTo(d.x + 2.5, d.y);
      ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI, false);
    });
    ctx.fillStyle = "rgba(255,255,255)";
    ctx.fill();
  }

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
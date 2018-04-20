import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { scaleSequential } from 'd3-scale';
import { interpolateInferno } from 'd3-scale-chromatic';
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

    const colorScale = scaleSequential(interpolateInferno);

    for (let el of data) {
      const color = colorScale(Math.random());
      const radius = WIDTH * (0.1 + Math.random() * 0.15);
      Object.assign(el, { color, radius: 0, max_radius: radius, isDrawing: true });
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
        const radius = WIDTH * (0.1 + Math.random() * 0.15);
        nodes.push({x, y, color, radius: 0, max_radius: radius, isDrawing: true});
      }

      return nodes;
    });

    const d3Voronoi = voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    this.drawCanvas(nodes, links, ctx);

    const time = timer(elapsed => {
      if (elapsed > 15000) time.stop();

      nodes.forEach((d, i) => {
        if (d.isDrawing) {
          d.radius = d.radius + 1.5;
          if (d.radius >= d.max_radius) {
            d.isDrawing = false;
          }
        }
      });

      this.drawCanvas(nodes, links, ctx);
    });
  };

  drawCanvas(nodes, links, ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // clip with heart shape
    ctx.beginPath();
    data.forEach((d) => {
      ctx.lineTo(d.x, d.y)
    }); 
    ctx.clip();

    ctx.globalCompositeOperation = "soft-light";

    // bubbles
    nodes.forEach((d) => {
      console.log(d);
      ctx.beginPath();
      ctx.moveTo(d.x + d.radius, d.y);
      ctx.arc(d.x, d.y, d.radius, 0, 2 * Math.PI, false);
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

    this.drawCurve(nodes, 1, ctx); 
  }

  drawCurve(points, tension, ctx) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    var t = (tension != null) ? tension : 1;
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = (i > 0) ? points[i - 1] : points[0];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = (i != points.length - 2) ? points[i + 2] : p2;

      var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
      var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

      var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
      var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.stroke();
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
import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { scaleSequential } from 'd3-scale';
import { interpolateInferno } from 'd3-scale-chromatic';
import { timer } from 'd3-timer';
import { quadtree } from 'd3-quadtree';
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

    // choose color scale for bubbles
    const colorScale = scaleSequential(interpolateInferno);

    // create first nodes points with the current data
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

    // randomly create points which will be located inside current shape of points (f.e heart shape)
    range(50).map(() => {
      let x = Math.random() * WIDTH;
      let y = Math.random() * HEIGHT;
      const d3Quadtree = quadtree()
        .extent([[0, 0], [WIDTH, HEIGHT]])
        .x(d => d.x)
        .y(d => d.y)
        .addAll(nodes);
      const searchRadius = 80;

      if (!ctx.isPointInPath(heart, x, y)) {
        do {
          x = Math.random() * WIDTH;
          y = Math.random() * HEIGHT;
        } while (!ctx.isPointInPath(heart, x, y))
      } else {
        const radius_x1 = x - searchRadius,
              radius_x2 = x + searchRadius,
              radius_y1 = y - searchRadius,
              radius_y2 = y + searchRadius;

        let minDistance = 30;

        d3Quadtree.visit((node, x1, y1, x2, y2) => {
          if (node.data) {
            const point = node.data;
            console.log('node', node.data);
            console.log('random', x, y);
            // const dx = x - point.x,
            //       dy = y - point.y,
            //       d2 = dx * dx + dy * dy;
            // console.log('d2', d2);

            const d = minDistance * minDistance - ((point.x - x) * (point.x - x)) + ((point.y - y) * (point.y - y));
            console.log(d);
                  
            //console.log('point', x, y, dx, dy, d2, r2);
          }
          // const p = node.data,
          //   dx = x - p[0],
          //   dy = y - p[1],
          //   d2 = dx * dx + dy * dy,
          //   r2 = 10;

          // console.log(dx, dy);

          // if (d2 < r2) {
          //   minDistance = 0;
          //   return true;
          // };

          // const d = Math.sqrt(d2) - p[2];
          // if (d < minDistance) minDistance = d;
          // const result = !minDistance || x1 > radius_x2  || x2 < radius_x1 || y1 > radius_y2 || y2 < radius_y1;
          
          // console.log(result);
        });  


        // const color = colorScale(Math.random());
        // const radius = WIDTH * (0.1 + Math.random() * 0.15);
        // nodes.push({x, y, color, radius: 0, max_radius: radius, isDrawing: true});
      }

      return nodes;
    });

    // create voronoi canvas with randomly created points
    const d3Voronoi = voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    // draw voronoi canvas
    this.drawCanvas(nodes, links, ctx);

    // animation of bubbles
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
      ctx.beginPath();
      this.drawCurve(d, ctx);
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

  drawCurve(d, ctx) {
    const points = [];
    let angle = 0;

    function createCirclePoints(angle) {
      if (angle > 360) {
        return;
      }
      const x = d.x + Math.cos(angle) * d.radius;
      const y = d.y + Math.sin(angle) * d.radius;

      points.push({ x, y });
      angle = angle + 45;
      createCirclePoints(angle);
    }

    createCirclePoints(angle);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = (i > 0) ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = (i != points.length - 2) ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6 * 1;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * 1;

      const cp2x = p2.x - (p3.x - p1.x) / 6 * 1;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * 1;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
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
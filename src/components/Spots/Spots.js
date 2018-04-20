import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { line } from 'd3-shape';
import { select } from 'd3-selection';
import { scaleSequential, scaleLinear } from 'd3-scale';
import { interpolateInferno } from 'd3-scale-chromatic';
import { timer } from 'd3-timer';
import { easePoly } from 'd3-ease';
import data from './heart.csv';
import './Spots.scss';

const WIDTH = 550;
const HEIGHT = 550;
const CURVE_POINTS = 9;

class Spots extends Component {
  componentDidMount() {
    this.createSpots();
  }

  createSpots = () => {
    const canvas = this.node;
    const ctx = canvas.getContext('2d'); 
    select(canvas)
      .attr("width", 2 * WIDTH)
      .attr("height", 2 * HEIGHT);
    ctx.scale(2, 2);
    const nodes = [];  

    // create first nodes points with the current data
    const startPoints = [].concat(data);

    // create shape path (heart)
    const d3Line = line()
      .x(d => d.x)
      .y(d => d.y);
    const heart = new Path2D(d3Line(data));

    // randomly create points which will be located inside current shape of points (f.e heart shape)
    range(70).map(() => {
      return this.findBestPoints(startPoints, ctx, heart);
    });

    // choose color scale for bubbles
    const colorScale = scaleSequential(interpolateInferno);
    // assign extra values for each point
    startPoints.forEach((coordinates) => {
      const color = colorScale(Math.random());
      const max_radius = WIDTH * (0.1 + Math.random() * 0.12);
      const delay =  Math.random() * 900;
      const center_point = { x: coordinates.x, y: coordinates.y };
      const pointData = {
        ...coordinates, 
        color, 
        radius: 0,
        max_radius, 
        isDrawing: true, 
        points: [center_point],
        delay
      };
      nodes.push(pointData);
    });

    // create voronoi canvas 
    const d3Voronoi = voronoi()
     .x(d => d.x)
     .y(d => d.y); 
    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    // draw voronoi canvas
    this.drawCanvas(nodes, links, ctx);

    // generate curve points for each node
    nodes.forEach(d => {
      this.generateCurvePoints(d, CURVE_POINTS);
    });

    // animation of bubbles
    this.animate(nodes, links, ctx);
  };

  generateCurvePoints(d, num) {
    const random = scaleLinear().range([num - 2, num + 2])
    const coords = d.points.pop();
    let angle = 0;
    generate(angle);

    function generate(angle) {
      if (angle >= 360) {
        return;
      }
      const x = coords.x + Math.cos(angle) * d.radius;
      const y = coords.y + Math.sin(angle) * d.radius;
      d.points.push({ x, y });
      angle = angle + 360 / random(Math.random());
      generate(angle);
    } 
  }

  animate(nodes, links, ctx) {
    const duration = 4000;
    const timeScale = scaleLinear()
      .domain([0, duration])
      .range([0, 1]);

    const time = timer(elapsed => {
      if (elapsed > 15000) time.stop();
     
      nodes.forEach((d, i) => {
        const t = easePoly(timeScale(elapsed - d.delay));
        if (d.isDrawing) {
          const num = d.points.length;
          d.points.forEach((p, i) => {
            p.x += t * Math.cos(Math.PI * 2 / num * i) * 10 * Math.random();
            p.y += t * Math.sin(Math.PI * 2 / num * i) * 10 * Math.random();
            const radius = Math.sqrt((d.x - p.x) * (d.x - p.x) + (d.y - p.y) * (d.y - p.y));
            d.radius = radius;
          });

          if (d.radius >= d.max_radius) {
            d.isDrawing = false;
            d.radius = 0;
          }
        }
      });

      this.drawCanvas(nodes, links, ctx);
    });
  }

  findBestPoints(nodes, ctx, heart) {
    let x = Math.random() * WIDTH;
    let y = Math.random() * HEIGHT;
   
    if (!ctx.isPointInPath(heart, x, y)) {
      do {
        x = Math.random() * WIDTH;
        y = Math.random() * HEIGHT;
      } while (!ctx.isPointInPath(heart, x, y));   
    } else {
      const searchRadius = 50;
      const isPointInsideSearchRadius = nodes.find(point => {
        const circle = [point.x, point.y, searchRadius];
        return this.pointInCircle([x, y], circle) === true;
      });

      if (isPointInsideSearchRadius) {
        // recursion if point is too close to current nodes
        this.findBestPoints(nodes, ctx, heart);
      } else {
        nodes.push({x, y});
      }
    }

    return nodes;
  }

  pointInCircle(point, circle) {
    const x = point[0], y = point[1],
          cx = circle[0], cy = circle[1], r = circle[2];
    return this.distance([cx, cy], [x, y]) <= r;
  }

   // Euclidean distance between two points
  distance(p0, p1) {
    const x0 = p0[0], y0 = p0[1],
          x1 = p1[0], y1 = p1[1];
    return Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2));
  }

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
    nodes.forEach((d, i) => {
      ctx.beginPath();
      this.drawCurve(ctx, d.points);
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
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.stroke();

    // points
    ctx.beginPath();
    nodes.forEach((d) => {
      ctx.moveTo(d.x + 2.5, d.y);
      ctx.arc(d.x, d.y, 2.5, 0, 2 * Math.PI, false);
    });
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
  }

  drawCurve(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = (i > 0) ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = (i !== points.length - 2) ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / CURVE_POINTS * 2;
      const cp1y = p1.y + (p2.y - p0.y) / CURVE_POINTS * 2;

      const cp2x = p2.x - (p3.x - p1.x) / CURVE_POINTS * 2;
      const cp2y = p2.y - (p3.y - p1.y) / CURVE_POINTS * 2;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  }

  render() {
    return (
      <div className="Spots">
        <canvas 
          className="responsive-canvas"
          ref={node => this.node = node}
          width={WIDTH}
          height={HEIGHT}
          >
        </canvas>
      </div>
    );
  }
}

export default Spots;
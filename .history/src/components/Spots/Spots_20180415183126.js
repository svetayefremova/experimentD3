import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { quadtree } from 'd3-quadtree';
import './Spots.scss';

const WIDTH = 600;
const HEIGHT = 600;
const HEART = new Path2D("M240.438984,75.1180229 C213.906656,13.0479209 138.485199,27.5290591 138.001548,99.5711057 C137.727478,139.139685 173.916719,153.927901 198.010636,169.746443 C221.387137,185.100328 238.004604,206.070503 240.608262,215 C242.841121,206.248285 261.360952,184.667995 282.988245,169.31411 C306.634785,152.521808 343.271403,138.703311 342.997334,99.1387726 C342.485469,26.9189442 265.766213,15.5207045 240.438984,75.1180229 Z");

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
    ctx.scale(2,2);

    const nodes = [];

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

    console.log(nodes);

    const d3Voronoi = voronoi()
      .x(d => d.x)
      .y(d => d.y);

    const diagram = d3Voronoi(nodes);
    const links = diagram.links();

    //ctx.globalCompositeOperation = "source-over";

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

  bestCircleGenerator(maxRadius, padding) {
    // const svg = this.node;
    // const chart = select(svg);
    // const canvas = chart.append("canvas");
    // const context = canvas.node().getContext("2d");

    // const d3Quadtree = quadtree().extent([[0, 0], [WIDTH, HEIGHT]]),
    //       searchRadius = maxRadius * 2;

    // return function(k) {
    //   let bestX, bestY, bestDistance = 0;

    //   for (var i = 0; i < k || bestDistance < padding; ++i) {
    //     let x = Math.random() * WIDTH;
    //     let y = Math.random() * HEIGHT;

    //     if (!context.isPointInPath(HEART, x, y)) {
    //       do {
    //         x = Math.random() * WIDTH;
    //         y = Math.random() * HEIGHT;
    //       } while (!context.isPointInPath(HEART, x, y))
    //     }

    //     let rx1 = x - searchRadius,
    //         rx2 = x + searchRadius,
    //         ry1 = y - searchRadius,
    //         ry2 = y + searchRadius,
    //         minDistance = maxRadius;

    //     d3Quadtree.visit((node, x1, y1, x2, y2) => {
    //       if (p = node.data) {
    //         let p,
    //             dx = x - p[0],
    //             dy = y - p[1],
    //             d2 = dx * dx + dy * dy;
    //             r2 = 10;

    //         if (d2 < r2) return minDistance = 0, true; // within a circle
    //         let d = Math.sqrt(d2) - p[2];
    //         if (d < minDistance) minDistance = d;
    //       }
    //       return !minDistance || x1 > rx2 || x2 < rx1 || y1 > ry2 || y2 < ry1; // or outside search radius
    //     });

    //     if (minDistance > bestDistance) bestX = x, bestY = y, bestDistance = minDistance;
    //   }

    //   const best = [bestX, bestY, bestDistance - padding];
    //   d3Quadtree.add(best);
    //   return best;
    // };
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
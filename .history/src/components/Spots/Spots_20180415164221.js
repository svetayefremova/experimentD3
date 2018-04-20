import React, { Component } from 'react';
import { voronoi } from 'd3-voronoi';
import { range } from 'd3-array';
import { select } from 'd3-selection';
import { quadtree } from 'd3-quadtree';
import './Spots.scss';

const WIDTH = 600;
const HEIGHT = 600;

class Spots extends Component {
  componentDidMount() {
    this.createSpots();
  }

  createSpots = () => {
    const svg = this.node;
    const chart = select(svg);
    const canvas = chart.append("canvas");
    const context = canvas.node().getContext("2d");
    const heart = new Path2D("M240.438984,75.1180229 C213.906656,13.0479209 138.485199,27.5290591 138.001548,99.5711057 C137.727478,139.139685 173.916719,153.927901 198.010636,169.746443 C221.387137,185.100328 238.004604,206.070503 240.608262,215 C242.841121,206.248285 261.360952,184.667995 282.988245,169.31411 C306.634785,152.521808 343.271403,138.703311 342.997334,99.1387726 C342.485469,26.9189442 265.766213,15.5207045 240.438984,75.1180229 Z");
    
    const nodes = range(200).map(() => {
      return {
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT
      };
    });

    const d3Voronoi = voronoi()
      .x(d => d.x + Math.random() - 0.5)
      .y(d => d.y + Math.random() - 0.5);

    select(svg).append("g")
      .attr("class", "polygons")
      .selectAll("path")
      .data(d3Voronoi.polygons(nodes))
      .enter().append("path")
      .call((path) => path
        .attr("d", d => d ? `M${d.join("L")}Z` : null)
      );
    
    select(svg).append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(d3Voronoi.links(nodes))
      .enter().append("line")
      .call(link => link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      );
  
    select(svg).append("g")
      .attr("class", "points")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 2.5)
      .call(point => point
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
      );

    // function redrawLink(link) {
    //   link
    //     .attr("x1", d => d.source[0])
    //     .attr("y1", d => d.source[1])
    //     .attr("x2", d => d.target[0])
    //     .attr("y2", d => d.target[1]);
    // }
      
    // function redrawSite(site) {
    //   site
    //     .attr("cx", d => d[0])
    //     .attr("cy", d => d[1]);
    // }
  };

  bestCircleGenerator(maxRadius, padding) {
    var quadtree = quadtree().extent([[0, 0], [width, height]]),
        searchRadius = maxRadius * 2,
        maxRadius2 = maxRadius * maxRadius;

    return function(k) {
      var bestX, bestY, bestDistance = 0;

      for (var i = 0; i < k || bestDistance < padding; ++i) {
        var x = Math.random() * width;
        var y = Math.random() * height;

        // Check if point is in the SVG path
        if (!context.isPointInPath(heart, x, y)) {
          do {
            x = Math.random() * width;
            y = Math.random() * height;
          } while (!context.isPointInPath(heart, x, y))
        }

        var rx1 = x - searchRadius,
            rx2 = x + searchRadius,
            ry1 = y - searchRadius,
            ry2 = y + searchRadius,
            minDistance = maxRadius; // minimum distance for this candidate

        quadtree.visit(function(node, x1, y1, x2, y2) {

          if (p = node.data) {
            var p,
                dx = x - p[0],
                dy = y - p[1],
                d2 = dx * dx + dy * dy;
                r2 = 10;

            if (d2 < r2) return minDistance = 0, true; // within a circle
            var d = Math.sqrt(d2) - p[2];
            if (d < minDistance) minDistance = d;
          }
          return !minDistance || x1 > rx2 || x2 < rx1 || y1 > ry2 || y2 < ry1; // or outside search radius
        });

        if (minDistance > bestDistance) bestX = x, bestY = y, bestDistance = minDistance;
      }

      var best = [bestX, bestY, bestDistance - padding];
      quadtree.add(best);
      return best;
    };

  render() {
    return (
      <div>
        <svg 
          ref={node => this.node = node} 
          width={WIDTH}
          height={HEIGHT}>
        </svg>
      </div>
    );
  }
}

export default Spots;
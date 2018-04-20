import React, { Component } from 'react';
import './BarChart.scss';
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { schemeCategory10 } from 'd3-scale-chromatic';

const paragraph = 'Palestinians in Gaza have marched in their thousands to the Israel border at the start of a six-week-long protest. Palestinian officials say dozens have been wounded by Israeli gunfire, after earlier reporting the death of a farmer due to tank fire. The Israeli military reported "rioting" at six places and said it was "firing towards';

class Words extends Component {
  componentDidMount() {
    this.createWords();
  }

  getData = (text) => {
    const data = [];
    const regex_symbols = /[&\/\\#,+()$~%.'":*?<>{}]/g;
    const arr = text.toLowerCase().replace(regex_symbols,'').split(' ');
    
    const words = arr.reduce((obj, value) => {
      if (!obj[value]) {
        obj[value] = 1;
      } else {
        obj[value] = obj[value] + 1;
      }
      return obj;
    }, {});
  
    for (let name of Object.keys(words)) {
      data.push({name, size: words[name]});
    }
  
    return data;
  }

  draw = (svg, data, layout) => {
    select(svg).append("g")
      .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
      .selectAll("text")
      .data(data)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("fill", (d, i) => schemeCategory10[i])
      .style("font-family", "Arial")
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.name);
  }

  createWords = () => {
    const svg = this.node;
    const data = this.getData(paragraph);
    const layout = cloud()
        .size([500, 500])
        .words(data)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.size * 14)
        .on("end", () => this.draw(svg, data, layout));  

    layout.start();
  };

  render() {
    return (
      <div>
        <svg 
          ref={node => this.node = node} 
          width={500}
          height={500}>
        </svg>
      </div>
    );
  }
}

export default Words;
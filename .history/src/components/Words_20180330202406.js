import React, { Component } from 'react';
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { schemeCategory10 } from 'd3-scale-chromatic';

const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Lorem ipsum dolor sit amet';

class Words extends Component {
  componentDidMount() {
    this.createWords();
  }

  createWords = () => {
    const svg = this.node;
    const data = this.getData(paragraph);
    const layout = cloud()
        .size([300, 300])
        .words(data)
        .rotate(0)
        .fontSize(d => d.size * 14)
        .on("end", () => this.draw(svg, data, layout));  

    layout.start();
  };

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
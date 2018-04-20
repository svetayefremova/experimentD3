import React, { Component } from 'react';
import './BarChart.scss';
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { schemeCategory10 } from 'd3-scale-chromatic';

// const data = [
//     {name: "apple", size: 85},
//     {name: "banana", size: 40},
//     {name: "orange", size: 30},
//     {name: "grapes", size: 24},
//     {name: "peach", size: 13},
//     {name: "plump", size: 11}
// ];

const paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Lorem ipsum dolor sit amet';

class Words extends Component {
  componentDidMount() {
    this.createWords();
  }

  getData = (text) => {
    //const regex_symbols = /[-!$%^&*()_+|~=`{}[]:;?,.@#]/g;
    const data = [];
    const arr = text.toLowerCase().replace(/[,.]/g,'').split(' ');
    
    const values = arr.reduce( (obj, value) => {
      if (!obj[value]) {
        obj[value] = 1;
      } else {
        obj[value] = obj[value] + 1;
      }
      return obj;
    }, {});
  
    for (let el of Object.keys(values)) {
      data.push({name: el, size: values[el]});
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
        .on("end", (svg, data, layout) => this.draw(svg, data, layout));  

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
import React, { Component } from 'react';
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { scalePow } from 'd3-scale';
import { max } from 'd3-array';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';
import { drag } from 'd3-drag';

const WORDS_AMMOUNT = 100;
const PARAGRAPH = `How the Word Cloud Generator Works The layout algorithm for positioning words without overlap is available on GitHub under an open source license as d3-cloud. Note that this is the only the layout algorithm and any code for converting text into words and rendering the final output requires additional development. As word placement can be quite slow for more than a few hundred words, the layout algorithm can be run asynchronously, with a configurable time step size. This makes it possible to animate words as they are placed without stuttering. It is recommended to always use a time step even without animations as it prevents the browser’s event loop from blocking while placing the words. The layout algorithm itself is incredibly simple. For each word, starting with the most “important”: Attempt to place the word at some starting point: usually near the middle, or somewhere on a central horizontal line. If the word intersects with any previously placed words, move it one step along an increasing spiral. Repeat until no intersections are found. The hard part is making it perform efficiently! According to Jonathan Feinberg, Wordle uses a combination of hierarchical bounding boxes and quadtrees to achieve reasonable speeds. Glyphs in JavaScript There isn’t a way to retrieve precise glyph shapes via the DOM, except perhaps for SVG fonts. Instead, we draw each word to a hidden canvas element, and retrieve the pixel data. Retrieving the pixel data separately for each word is expensive, so we draw as many words as possible and then retrieve their pixels in a batch operation. Sprites and Masks My initial implementation performed collision detection using sprite masks. Once a word is placed, it doesn't move, so we can copy it to the appropriate position in a larger sprite representing the whole placement area. The advantage of this is that collision detection only involves comparing a candidate sprite with the relevant area of this larger sprite, rather than comparing with each previous word separately. Somewhat surprisingly, a simple low-level hack made a tremendous difference: when constructing the sprite I compressed blocks of 32 1-bit pixels into 32-bit integers, thus reducing the number of checks (and memory) by 32 times. In fact, this turned out to beat my hierarchical bounding box with quadtree implementation on everything I tried it on (even very large areas and font sizes). I think this is primarily because the sprite version only needs to perform a single collision test per candidate area, whereas the bounding box version has to compare with every other previously placed word that overlaps slightly with the candidate area. Another possibility would be to merge a word’s tree with a single large tree once it is placed. I think this operation would be fairly expensive though compared with the analagous sprite mask operation, which is essentially ORing a whole block.;`;

class Words extends Component {
  componentDidMount() {
    this.createWords();
  }

  createWords = () => {
    const svg = this.node;
    const data = this.getData(PARAGRAPH);
    const fontSizeScale = scalePow().exponent(1).domain([0,1]).range([16, 100]);
    const maxSize = max(data, d => d.size);
    const layout = cloud()
        .size([600, 600])
        .words(data)
        .padding(3)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => fontSizeScale(d.size/maxSize))
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

    for (let text of Object.keys(words)) {
      data.push({text, size: words[text]});
    }

    data.sort((a,b) => b.size - a.size);
  
    if (data.length > WORDS_AMMOUNT) {
      return data.slice(0, WORDS_AMMOUNT);
    }
  
    return data;
  }

  draw = (svg, data, layout) => {
    select(svg).append("g")
      .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
      .selectAll("text")
      .data(data)
      .enter().append('text')
      .style('fill', (d, i) => schemeCategory10[i])
      .style('font-family', 'Impact')
      .style('font-weight', 'bold')
      .style("fill-opacity", 0)
      .attr('text-anchor', 'middle')
      .text(d => d.text)
      .transition()
      .duration(1200)
      .style('font-size', d => `${d.size}px`)
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .style("fill-opacity", 1);

    const text = select(svg).selectAll("text");

    text.call(drag()
        .on("start", (d) => {console.log(d)})
        .on("drag", () => {})
        .on("end", () => {}));
  }

  render() {
    return (
      <div>
        <svg 
          ref={node => this.node = node} 
          width={600}
          height={600}>
        </svg>
      </div>
    );
  }
}

export default Words;
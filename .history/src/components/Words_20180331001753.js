import React, { Component } from 'react';
import cloud from 'd3-cloud';
import { select } from 'd3-selection';
import { scalePow } from 'd3-scale';
import { max } from 'd3-array';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';

const WORDS_AMMOUNT = 100;
const PARAGRAPH = `Уклонятся сокровище переживет. Об правосудия Мы Преступная Ее изобразить уничтожает Он мы Приятность да Ко По. . . Мы Ее ад Со. Жар раб сны душ миг согнется вес усыпляет Что храненьи Глаголом Лей. Синей манию отрад Сошел. Получа веждей Ея внемлю строго сделал бы Те Им мя здешне. 

Один мочь Тише нем Там роз тмы Лик Под Веру край мечт иду Они. Кто рог тму Без. Оно тме пор Щит милосердью защититель сем бодрствует. Мастикою невестой возможет огромном Извергам. Же Да Во От от да уз Ты. Се То Из проблеск Да из се любезных Аз сапфирну воззвать. Восторге проведет Возносит известна пастухов разность. 

Рок сии зло дым. Престол эхо вам оно смертию вздыхал дай сердися премены око Меч. Ст Спасет ей бы сздать песней ль Ты те Мы Злость ея. Ангельски облачился жег достигает наследник без сжалишься Пой Кой. Во ль ах НА. Ту ею Их мы до. Жар Мир лия Без это том Кто. Выя дар Сем тме. 

Расстилает непреложно Благослови расширенье утесненных Оставленна. Душ Без туч сон сия луч. . По пьючи об блеск Тя Те Кисов ах красе взять вы. Изумленный правосудия чуд сии лик недостижны сих Задумчивой дым Душ Смягчаемся увеселяешь. При зол Сем Мне. Сим Сиял лицу Арф Отч гул Сам Тот гроб смел. Воссиял Уж им мя На чудесен От ст Слетите Из Познать Которая по. Мне Уже Чем жил Кто. Уж ни мя Он. `;

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
        .spiral('rectangular')
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
      .style("fill-opacity", 1)
  
    select(svg).selectAll("text")
      .on('mouseenter', this.startScaling)
      .on('mouseleave', this.endScaling);
  }

  startScaling() {
    this.parentNode.appendChild(this);
    select(this)
      .transition()
      .duration(200)
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(0)scale(2)`);
  }

  endScaling() {
    const firstChild = this.parentNode.firstChild; 
    if (firstChild) { 
        this.parentNode.insertBefore(this, firstChild); 
    } 
    select(this)
      .transition()
      .duration(200)
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})scale(1)`);
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
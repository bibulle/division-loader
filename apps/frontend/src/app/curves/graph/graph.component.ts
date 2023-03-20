/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CharacterStats, GraphTypeKey, Stat, StatDescription } from '@division-loader/apis';
import * as d3 from 'd3';
import { NumberValue } from 'd3';

@Component({
  selector: 'division-loader-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, OnChanges {
  @Input()
  charactersStats: CharacterStats[] = [];

  @Input()
  graphType = GraphTypeKey.TIME;

  @Input()
  statName?: StatDescription;

  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef | undefined;

  characters: Character[] = [];
  created = false;
  private margin = { top: 90, right: 120, bottom: 40, left: 70 };
  private width = 0;
  private height = 0;
  private svg: any;
  private tooltip: any;
  private TEXT_SPACE = 9;

  language = 'en';

  private myD3Category = [
    // "#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f",
    '#1b70fc',
    '#d50527',
    '#158940',
    '#f898fd',
    '#24c9d7',
    '#cb9b64',
    '#866888',
    '#22e67a',
    '#e509ae',
    '#9dabfa',
    '#437e8a',
    '#b21bff',
    '#ff7b91',
    '#94aa05',
    '#ac5906',
    '#82a68d',
    '#fe6616',
    '#7a7352',
    '#f9bc0f',
    // "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070",
    '#b65d66',
    '#07a2e6',
    '#c091ae',
    '#8a91a7',
    '#ea42fe',
    '#9e8010',
    '#10b437',
    '#c281fe',
    '#f92b75',
    '#07c99d',
    '#a946aa',
    '#bfd544',
    '#16977e',
    '#ff6ac8',
    '#a88178',
    '#5776a9',
    '#678007',
    '#fa9316',
    '#85c070',
    '#6aa2a9',
    '#989e5d',
    '#fe9169',
    '#cd714a',
    '#6ed014',
    '#c5639c',
    '#c23271',
    '#698ffc',
    '#678275',
    '#c5a121',
    '#a978ba',
    '#ee534e',
    '#d24506',
    '#59c3fa',
    '#ca7b0a',
    '#6f7385',
    '#9a634a',
    '#48aa6f',
    '#ad9ad0',
    '#d7908c',
    '#6a8a53',
    '#8c46fc',
    '#8f5ab8',
    '#fd1105',
    '#7ea7cf',
    '#d77cd1',
    '#a9804b',
    '#0688b4',
    '#6a9f3e',
    '#ee8fba',
    '#a67389',
    '#9e8cfe',
    '#bd443c',
    '#6d63ff',
    '#d110d5',
    '#798cc3',
    '#df5f83',
    '#b1b853',
    '#bb59d8',
    '#1d960c',
    '#867ba8',
    '#18acc9',
    '#25b3a7',
    '#f3db1d',
    '#938c6d',
    '#936a24',
    '#a964fb',
    '#92e460',
    '#a05787',
    '#9c87a0',
    '#20c773',
    '#8b696d',
    '#78762d',
    '#e154c6',
    '#40835f',
    '#d73656',
    '#1afd5c',
    '#c4f546',
    '#3d88d8',
    '#bd3896',
    '#1397a3',
    '#f940a5',
    '#66aeff',
    '#d097e7',
    '#fe6ef9',
    '#d86507',
    '#8b900a',
    '#d47270',
    '#e8ac48',
    '#cf7c97',
    '#cebb11',
    '#718a90',
    '#e78139',
    '#ff7463',
    '#bea1fd',
  ];

  ngOnInit() {
    this.created = false;

    // console.log(`${this.statName} ${this.graphType}`);
    if (!this.statName) {
      switch (this.graphType) {
        case GraphTypeKey.TIME:
        default:
          this.statName = { key: 'timePlayed', displayName: 'Time Played', description: '' };
          break;
        case GraphTypeKey.LEVEL:
          this.statName = { key: 'highestPlayerLevel', displayName: 'Player Level', description: '' };
          break;
        case GraphTypeKey.PVE_KILLS:
          this.statName = { key: 'killsNpc', displayName: 'NPC Kills', description: '' };
          break;
        case GraphTypeKey.PVP_KILLS:
          this.statName = { key: 'killsPvP', displayName: 'PvP Kills', description: '' };
          break;
      }
    }

    setTimeout(() => {
      // console.log('ngOnInit');
      this.initChart();
      this.updateChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('ngOnChanges');
    // console.log(changes);

    if (changes['statName']) {
      this.updateChart();
    } else if (changes['charactersStats']) {
      this.updateChart();
    }
  }

  private initChart(): void {
    console.log('initChart');

    if (!this.chartContainer) {
      console.error('chart container not found !!');
      return;
    }
    const element = this.chartContainer.nativeElement;

    this.width = element.offsetWidth - this.margin.right - this.margin.left;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // Create the SVG container
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .classed('svg-content', true)
      .append('g')
      .attr('class', 'all group')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // manage locale
    // this._getLocaleLabels();
    GraphComponent._defineLocalFormatter(this.language);

    /* create tooltip div */
    this.tooltip = d3.select(element).append('div').attr('id', 'tooltip').attr('class', 'tooltip');

    // define the axis
    this.svg.append('g').attr('class', 'x axis');
    this.svg.append('g').attr('class', 'y axis').append('text').attr('class', 'y-axis-label');

    // define the clip rect
    this.svg.append('clipPath').attr('id', 'clip').append('rect').attr('class', 'clip-rect');

    this.created = true;
    //    this.updateChart(this.characters);
  }

  private updateChart(): void {
    // console.log(`updateChart ${this.statName}`);
    if (!this.created || !this.chartContainer) {
      return;
    }

    if (!this.charactersStats || this.charactersStats.length === 0) {
      return;
    }
    // console.log('updateChart');

    this.width = this.chartContainer.nativeElement.offsetWidth - this.margin.right - this.margin.left;
    this.height = this.chartContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    // calculate data (group by character+add last(with dateEnd))
    this.characters = this.charactersStats
      .reduce((result, stats) => {
        let char = result.find((ch) => ch.name === stats.userId);
        if (!char) {
          char = { name: stats.userId, values: [] };
          result.push(char);
        }
        char.values.push(stats);
        return result;
      }, [] as Character[])
      .map((ch) => {
        const lastVal = ch.values[ch.values.length - 1];
        if (lastVal.dateStart !== lastVal.dateEnd) {
          const addedVal = { ...lastVal };
          addedVal.dateStart = addedVal.dateEnd;
          ch.values.push(addedVal);
        }
        return ch;
      });

    // Sort data (depending on the curve)
    this.characters.sort((d1, d2) => {
      return d3.ascending(+this._getYMax(d2.values[d2.values.length - 1]), +this._getYMax(d1.values[d1.values.length - 1]));
    });

    // console.log(this.characters);

    // get the global list
    const allData: CharacterStats[] = d3.merge(
      this.characters.map(function (d) {
        // console.log(d);
        return d.values;
      })
    );

    // Calculate de date_min
    let dateMin = new Date();
    allData.forEach((v: CharacterStats) => {
      // if (v.dateStart.getTime() < dateMin.getTime() && this._getYMax(v) > Graph.MIN_VALUES[that.graphType]) {
      if (v.dateStart.getTime() < dateMin.getTime()) {
        dateMin = v.dateStart;
      }
    });

    // calculate the scales
    const xScale = d3.scaleTime().domain([dateMin.getTime(), new Date()]).range([0, this.width]);

    const yMin = d3.min(allData, (d) => +this._getYMax(d));
    const yMax = d3.max(allData, (d) => +this._getYMax(d));
    const yScale = d3
      .scalePow()
      // .exponent(Graph.POW_VALUES[this.graphType])
      .domain([yMin ? yMin : 0, yMax ? yMax : 0])
      .range([this.height, 0]);
    const color = d3.scaleOrdinal(this.myD3Category).domain(
      this.characters.map(function (d) {
        return d.name;
      })
    );

    // Calculate the x ticks count
    let resultTickValues = xScale.ticks();
    let tempXTickValues = [];

    while (resultTickValues.length > Math.max(2, this.width / 100)) {
      for (let i = (resultTickValues.length + 1) % 2; i <= resultTickValues.length; i += 2) {
        tempXTickValues.push(resultTickValues[i]);
      }
      resultTickValues = tempXTickValues;
      tempXTickValues = [];
    }

    // ---------
    // Draw the axis
    // ---------
    const xAxis = d3.axisBottom(xScale).tickSizeInner(-this.height).tickSizeOuter(0).tickPadding(10).tickValues(resultTickValues).tickFormat(GraphComponent._multiFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeInner(-this.width).tickSizeOuter(0).tickPadding(10);

    if (this.statName?.key === 'timePlayed') {
      yAxis.tickFormat(GraphComponent._multiFormatTimePlayed);
    }

    this.svg
      .selectAll('g.x.axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);
    this.svg.selectAll('g.y.axis').call(yAxis);

    const yAxisLabel = this.svg.selectAll('.y-axis-label').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.71em').attr('dx', '-.2em').style('text-anchor', 'end');

    // this._translateService.get(Graph.Y_LABEL[this.graphType]).subscribe((text) => {
    //   yAxisLabel.text(text);
    // });
    yAxisLabel.text(this.statName?.displayName);

    // ---------
    // create clip path
    // ---------
    this.svg.selectAll('.clip-rect').attr('width', this.width).attr('height', this.height);

    // ---------
    // add path
    // ---------
    const area = d3
      .area<CharacterStats>()
      .curve(d3.curveBasis)
      .x((d) => {
        return xScale(this._getX(d));
      })
      .y0((d) => {
        return yScale(this._getYMax(d));
      })
      .y1((d) => {
        return yScale(this._getYMax(d));
      });

    const areas = this.svg
      .selectAll('.area')
      .data(this.characters, (d: Character) => {
        return d.name;
      })
      .attr('d', (d: Character) => {
        return area(d.values);
      });
    areas
      .enter()
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .attr('class', (d: Character) => {
        // console.log("area K" + d.key + " Char_" + d.charNum);
        return 'area K' + d.name;
      })
      .attr('d', (d: Character) => {
        return area(d.values);
      })
      .style('stroke', (d: Character) => {
        return color(d.name);
      })
      .style('fill', (d: Character) => {
        return color(d.name);
      })
      .style('opacity', () => {
        return 0.2;
      });

    // ---------
    // add lines
    // ---------
    const line = d3
      .line<CharacterStats>()
      .curve(d3.curveBasis)
      .x((d) => {
        return xScale(this._getX(d));
      })
      .y((d) => {
        // return (y((getYMax(d)+getYMin(d))/2));
        return yScale(this._getYMax(d));
      });

    const lines = this.svg
      .selectAll('.line')
      .data(this.characters, (d: Character) => {
        return d.name;
      })
      .attr('d', (d: Character) => {
        return line(d.values);
      });
    lines
      .enter()
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .attr('class', (d: Character) => {
        return 'line K' + d.name;
      })
      .attr('d', (d: Character) => {
        return line(d.values);
      })
      .style('stroke', (d: Character) => {
        return color(d.name);
      });

    // ---------
    // add texts
    // ---------
    const textsPositions: number[] = [];

    // create background
    const textBoxes = this.svg
      .selectAll('.text-box')
      .data(this.characters, (d: Character) => {
        return d.name;
      })
      .attr('class', (d: Character) => {
        // console.log(d);
        return 'text-box UB' + d.name;
      });
    textBoxes
      .enter()
      .append('rect')
      .attr('class', (d: Character) => {
        // console.log(d);
        return 'text-box UB' + d.name;
      });

    // create texts
    // const getTextBox = (selection: any) => {
    //   console.log(selection);
    //   console.log(this);
    //   selection.each((d: any) => {
    //     console.log(d);
    //     // d.bbox = this.getBBox();
    //   });
    // };

    const texts = this.svg
      .selectAll('.text')
      .data(this.characters, (d: Character) => {
        return d.name;
      })
      .attr('x', (d: Character) => {
        // console.log(that._getX(d.values[d.values.length - 1]));
        return xScale(this._getX(d.values[d.values.length - 1])) + 8;
      })
      .attr('y', (d: Character) => {
        let pos = yScale(+this._getYMax(d.values[d.values.length - 1]));

        pos = this._checkPosition(pos, textsPositions);
        textsPositions.push(pos);

        return pos;
      })
      .attr('dy', '.35em')
      .style('font-size', '0.7em')
      .html((d: Character) => this._getLabel(d))
      .call(() => {
        // console.log(selection);
        // console.log(this);
      });
    texts
      .enter()
      .append('text')
      .attr('class', (d: Character) => {
        // console.log(d);
        return 'text U' + d.name;
      })
      .attr('x', (d: Character) => {
        return xScale(this._getX(d.values[d.values.length - 1])) + 8;
      })
      .attr('y', (d: Character) => {
        let pos = yScale(this._getYMax(d.values[d.values.length - 1]));

        pos = this._checkPosition(pos, textsPositions);
        textsPositions.push(pos);

        return pos;
      })
      .attr('dy', '.35em')
      .html((d: Character) => this._getLabel(d))
      .attr('fill', function (d: Character) {
        return color(d.name);
      })
      .on('mouseover', (event: MouseEvent, d: Character) => {
        //console.log(`mouseover ${d.userId}`);
        //console.log(d);
        d3.selectAll('.text.U' + d.name).classed('mouseover', true);
        d3.selectAll('.line.K' + d.name).classed('mouseover', true);
        d3.selectAll('.area.K' + d.name).classed('mouseover', true);

        this.tooltip.html(this._getTitle(d));
        this.tooltip.transition().duration(50).style('opacity', 0.9).style('z-index', 10);

        let top = (event.target as SVGGraphicsElement).getBBox().y + (event.target as SVGGraphicsElement).getBBox().height + this.margin.top - 2;
        const maxTop = this.height + this.margin.top + this.margin.bottom - this.tooltip.node().getBoundingClientRect().height;
        if (top > maxTop) {
          top = maxTop;
          // console.log(top);
        }
        this.tooltip.style('top', top + 'px').style('right', this.margin.right - 6 + 'px');
      })
      .on('mouseout', (event: MouseEvent, d: Character) => {
        //console.log(`mouseout ${d.userId}`);
        //console.log(d);
        d3.selectAll('.text.U' + d.name).classed('mouseover', false);
        d3.selectAll('.line.K' + d.name).classed('mouseover', false);
        d3.selectAll('.area.K' + d.name).classed('mouseover', false);
        this.tooltip
          .style('opacity', 0)
          .style('z-index', 0)
          .style('top', this.height * 2 + 'px');
      })
      .call(() => {
        // console.log(selection);
        // console.log(selection.getBBox());
        // console.log(this);
      });

    // resize text background
    // this.svg
    //   .selectAll('.text-box')
    //   .data(this.characters, (d: Character) => {
    //     return d.name;
    //   })
    //   .attr('x', function (d:any) {
    //     return d.bbox.x;
    //   })
    //   .attr('y', function (d:any) {
    //     return d.bbox.y;
    //   })
    //   .attr('width', function (d:any) {
    //     return d.bbox.width;
    //   })
    //   .attr('height', function (d:any) {
    //     return d.bbox.height;
    //   });

    // Disable lines
    d3.selectAll('.Char_NotDisplayed').style('display', 'none');
    // switch (that.graphType) {
    //   case GraphTypeKey.TRIUMPH:
    //     // GraphTypeKey.TIME:
    //     d3.selectAll('.Char_3').style('display', 'none');
    //     d3.selectAll('.Char_2').style('display', 'none');
    //     break;
    //   default:
    //     d3.selectAll('.Char_3').style('display', 'inline');
    //     d3.selectAll('.Char_2').style('display', 'inline');
    //     break;
    // }
  }

  onResize() {
    // console.log('onResize : ' + this.chartContainer.nativeElement.offsetWidth + 'x' + this.chartContainer.nativeElement.offsetHeight);

    this._refreshSize();
  }

  _refreshSize() {
    setTimeout(() => {
      this.updateChart();
    });
  }

  _getX(d: CharacterStats) {
    return d.dateStart;
  }

  _getYMax(d: CharacterStats): number {
    const attr: string = this.statName ? this.statName.key : 'timePlayed';
    const stat = (d.stats as any)[attr] as Stat;

    return stat && stat.value && !isNaN(+stat.value) ? +stat.value : 0;
  }

  _getLabel(d: Character): string {
    return d.name;
  }

  _getTitle(d: Character) {
    // console.log(d.values[d.values.length - 1]);
    let title = '';

    title += `<div class="left">`;
    title += `<div class="label">Name</div>`;
    title += `<div class="label">Level</div>`;
    title += `</div>`;
    title += `<div class="right">`;
    title += `<div class="value">${d.values[d.values.length - 1].userId}</div>`;
    title += `<div class="value">${d.values[d.values.length - 1].stats.highestPlayerLevel.displayValue}</div>`;

    return title;
  }

  /**
   * Function to calculate labels positions
   */
  _checkPosition(pos: number, textPositions: number[], step = 1, count = 1): number {
    if (count > 800) {
      return 2 * this.height;
    }
    // console.log(count);

    let nextStep = -1 * step;
    if (step < 0) {
      nextStep += 1;
    }
    if (step > 0) {
      nextStep -= 1;
    }
    // console.log(step);
    // console.log(nextStep);

    let ok = true;
    if (pos > this.height + this.TEXT_SPACE || pos < -1 * (this.margin.top - this.TEXT_SPACE)) {
      ok = false;
    }
    // console.log(pos);
    textPositions.forEach((p) => {
      if (Math.abs(pos - p) < this.TEXT_SPACE) {
        ok = false;
      }
    });

    if (ok) {
      return pos;
    } else {
      return this._checkPosition(pos + step, textPositions, nextStep, count + 1);
    }
  }

  // Tick format management
  private static _getLocaleFormat(loc: string) {
    switch (loc) {
      case 'fr':
        return d3.timeFormatLocale({
          dateTime: '%a %b %e %X %Y',
          date: '%m/%d/%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
          shortDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          shortMonths: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        });
      case 'en':
      default:
        return d3.timeFormatLocale({
          dateTime: '%a %b %e %X %Y',
          date: '%m/%d/%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        });
    }
  }

  private static _defineLocalFormatter(loc: string) {
    const d3Locale = GraphComponent._getLocaleFormat(loc);

    GraphComponent.formatMillisecond = d3Locale.format('.%L');
    GraphComponent.formatSecond = d3Locale.format(':%S');
    GraphComponent.formatMinute = d3Locale.format('%I:%M');
    GraphComponent.formatHour = d3Locale.format('%I %p');
    GraphComponent.formatDay = d3Locale.format('%a %d');
    GraphComponent.formatWeek = d3Locale.format('%b %d');
    GraphComponent.formatMonth = d3Locale.format('%B');
    GraphComponent.formatYear = d3Locale.format('%Y');
  }

  private static formatMillisecond: (date: Date) => string;
  private static formatSecond: (date: Date) => string;
  private static formatMinute: (date: Date) => string;
  private static formatHour: (date: Date) => string;
  private static formatDay: (date: Date) => string;
  private static formatWeek: (date: Date) => string;
  private static formatMonth: (date: Date) => string;
  private static formatYear: (date: Date) => string;

  //noinspection TsLint
  private static _multiFormat(date: Date | NumberValue): string {
    return (
      d3.timeSecond(date as Date) < date
        ? GraphComponent.formatMillisecond
        : d3.timeMinute(date as Date) < date
        ? GraphComponent.formatSecond
        : d3.timeHour(date as Date) < date
        ? GraphComponent.formatMinute
        : d3.timeDay(date as Date) < date
        ? GraphComponent.formatHour
        : d3.timeMonth(date as Date) < date
        ? d3.timeWeek(date as Date) < date
          ? GraphComponent.formatDay
          : GraphComponent.formatWeek
        : d3.timeYear(date as Date) < date
        ? GraphComponent.formatMonth
        : GraphComponent.formatYear
    )(date as Date);
  }

  private static _multiFormatTimePlayed(value: Date | NumberValue): string {
    let ret = '';
    let val = Math.floor(+value / (60 * 60));

    if (val >= 48) {
      ret += ' ' + Math.floor(val / 24) + 'd';
      val = val % 48;
    }
    ret += ' ' + val + 'h';

    return ret;
  }
}

class Character {
  name = '';
  values: CharacterStats[] = [];
}

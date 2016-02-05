import d3 from 'd3'
import css from './index.css'

const rawData = [{'date':'2016-01-06','hours':2.7},{'date':'2016-01-07','hours':1.735},{'date':'2016-01-08','hours':0.5219},{'date':'2016-01-09','hours':0.0},{'date':'2016-01-10','hours':0.0},{'date':'2016-01-11','hours':2.2708},{'date':'2016-01-12','hours':1.2692},{'date':'2016-01-13','hours':0.2219},{'date':'2016-01-14','hours':3.2722},{'date':'2016-01-15','hours':0.3353},{'date':'2016-01-16','hours':0.5389},{'date':'2016-01-17','hours':0.0},{'date':'2016-01-18','hours':1.3308},{'date':'2016-01-19','hours':2.1228},{'date':'2016-01-20','hours':1.0539},{'date':'2016-01-21','hours':0.0},{'date':'2016-01-22','hours':1.2525},{'date':'2016-01-23','hours':1.8133},{'date':'2016-01-24','hours':1.9583},{'date':'2016-01-25','hours':3.3772},{'date':'2016-01-26','hours':0.9175},{'date':'2016-01-27','hours':0.4208},{'date':'2016-01-28','hours':0.0},{'date':'2016-01-29','hours':1.1847},{'date':'2016-01-30','hours':0.0175},{'date':'2016-01-31','hours':0.49},{'date':'2016-02-01','hours':4.6317},{'date':'2016-02-02','hours':1.3414},{'date':'2016-02-03','hours':0.8869},{'date':'2016-02-04','hours':1.0531}]
const parseDate = d3.time.format('%Y-%m-%d').parse
const data = rawData.map(datum => ({ hours: +datum.hours, date: parseDate(datum.date) }))

const duration = 2000
const margin = { top: 20, right: 20, bottom: 20, left: 30 }
const height = 500 - margin.top - margin.bottom
const width = 1000 - margin.left - margin.right

const x = d3.time.scale()
  .range([0, width])

const y = d3.scale.linear()
  .range([height, 0])

const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')

const yAxis = d3.svg.axis()
  .scale(y)
  .orient('left')

const line = d3.svg.line()
  .x(d => x(d.date))
  .y(d => y(d.hours))

const area = d3.svg.area()
  .y0(d => y(d.hours))
  .x(d => x(d.date))
  .y1(height)

x.domain(d3.extent(data, d => d.date))
y.domain(d3.extent(data, d => d.hours))

const svg = d3.select('#app')
  .append('svg')
    .attr({
      width: 1000,
      height: 500
    })

const defs = svg.append('defs')

const mask = defs.append('mask')
  .attr('id', 'areamask')

const grad = defs.append('linearGradient')
  .attr({
    id: 'areagrad',
    x1: '0%',
    y1: '0%',
    x2: '0%',
    y2: '100%'
  })

grad.append('stop')
  .attr({
    offset: '0%',
    class: css.areagradTop
  })
grad.append('stop')
  .attr({
    offset: '100%',
    class: css.areagradBottom
  })

mask.append('path')
  .datum(data)
  .attr('class', css.areagrad)
  .attr('d', area)

svg.append('rect')
  .attr({
    x: 0,
    y: 0,
    width: 0,
    height,
    mask: 'url(#areamask)',
    fill: 'url(#areagrad)',
    class: css.areagrad
  })
  .transition()
    .delay(duration * 0.1)
    .duration(duration)
    .attr({
      width
    })

svg.append('g')
    .attr('class', css.axis)
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

svg.append('g')
    .attr('class', css.axis)
    .call(yAxis)

const linePath = svg.append('path')
  .datum(data)
  .attr('class', css.line)
  .attr('d', line)

const numNodes = linePath.node().getTotalLength()

linePath
  .attr('stroke-dasharray', numNodes + ' ' + numNodes)
  .attr('stroke-dashoffset', numNodes)
  .transition()
  .duration(duration)
  .ease('linear')
  .attr('stroke-dashoffset', 0)

// svg.append('path')
//   .datum(data)
//   .attr('class', css.area)
//   .attr('d', area)

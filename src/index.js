import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import useResizeObserver from 'use-resize-observer/polyfilled'
import _ from 'lodash'
import usePrevious from './usePrevious.js'
import {
  select,
  extent,
  scaleLinear,
  axisLeft,
  axisBottom,
  line,
  curveBasis,
  curveCardinal,
  curveLinear,
  curveCatmullRom,
  brushX,
  event,
  easeBounce
} from 'd3'

const curves = {
  CurveBasis: curveBasis,
  CurveCardinal: curveCardinal,
  CurveLinear: curveLinear,
  'CurveCatmullRom (alpha = 0.5)': curveCatmullRom.alpha(0.5),
  'CurveCatmullRom (alpha = 1)': curveCatmullRom.alpha(1)
}

export const FilterableLineChart = ({
  dataset,
  dataOptions,
  chartId,
  settings
}) => {
  const [width, setwidth] = useState(400)
  const [height, setheight] = useState(400)
  const [showRegLine, setshowRegLine] = useState(true)
  const [showLine, setshowLine] = useState(true)
  const [curveType, setcurveType] = useState('CurveBasis')
  const [sortedDataset, setsortedDataset] = useState([])
  const [translateYLabel, settranslateYLabel] = useState(0)
  const [xKey, setxKey] = useState('')
  const [yKey, setyKey] = useState('')
  const [selection, setselection] = useState([1.999, 2.2])
  const previousSelection = usePrevious(selection)
  const svgRef = useRef()

  const { ref } = useResizeObserver({
    onResize: ({ width }) => {
      setwidth(width)
    }
  })

  // Setting initial states
  useEffect(() => {
    if (
      !settings ||
      !dataOptions ||
      settings.length <= 0 ||
      dataOptions.length <= 0
    ) {
      return
    }
    // Settings
    const heightV = _.find(settings, ['id', 'height'])?.value
    heightV && setheight(heightV)

    const showRegLineV = _.find(settings, ['id', 'show_reg_line'])?.value
    showRegLineV && setshowRegLine(showRegLineV)

    const showLineV = _.find(settings, ['id', 'show_line'])?.value
    showLineV && setshowLine(showLineV)

    const curveTypeV = _.find(settings, ['id', 'curve_type'])?.value
    curveTypeV && setcurveType(curveTypeV)

    const translateYLabelV = _.find(settings, ['id', 'translate_y_label'])
      ?.value
    translateYLabelV && settranslateYLabel(translateYLabelV)

    // Data options
    const xV = _.find(dataOptions, ['id', 'x'])?.value
    setxKey(xV)
    const yV = _.find(dataOptions, ['id', 'y'])?.value
    setyKey(yV)
  }, [settings, dataOptions])

  // Sorted the dataset by x axis
  useEffect(() => {
    if (!dataset || !xKey || !yKey) {
      return
    }
    const sorted = _.orderBy(dataset, [xKey], ['asc'])
    setsortedDataset([...sorted])
  }, [dataset, xKey, yKey])

  // Render chart
  useEffect(() => {
    if (!dataset || !sortedDataset || !width || !height || !yKey || !xKey) {
      return
    }
    const xs = _.map(sortedDataset, (item) => parseFloat(item[xKey]))
    const xExtent = extent(xs)
    const xScale = scaleLinear().domain(xExtent).range([0, width])
    const ys = _.map(sortedDataset, (item) => parseFloat(item[yKey]))
    const yExtent = extent(ys)
    const yScale = scaleLinear().domain(yExtent).range([height, 0])

    const svg = select(svgRef.current)
    svg
      .selectAll('.point')
      .data(sortedDataset)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(parseFloat(d[xKey])))
      .attr('cy', (d) => yScale(parseFloat(d[yKey])))
      .transition()
      .duration(200)
      .ease(easeBounce)
      .attr('fill', (d) => {
        if (
          selection[0] < parseFloat(d[xKey]) &&
          selection[1] > parseFloat(d[xKey])
        ) {
          return 'red'
        } else {
          return 'blue'
        }
      })
      .attr('r', (d) => {
        if (
          selection[0] < parseFloat(d[xKey]) &&
          selection[1] > parseFloat(d[xKey])
        ) {
          return 7
        } else {
          return 4
        }
      })
      .attr('opacity', 0.7)

    // axises
    const yAxis = axisLeft(yScale)
    const xAxis = axisBottom(xScale)

    svg.selectAll('.yaxis').call(yAxis)
    svg
      .selectAll('.xaxis')
      .call(xAxis)
      .attr('transform', `translate(0,${height})`)

    // lines
    if (showLine) {
      const lineGenerator = line()
        .x((d) => xScale(parseFloat(d[xKey])))
        .y((d) => yScale(parseFloat(d[yKey])))
        .curve(curves[curveType])
      svg
        .selectAll('.line')
        .data([sortedDataset])
        .join('path')
        .attr('class', 'line')
        .attr('d', lineGenerator)
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr('stroke', 'pink')
    } else {
      svg.selectAll('.line').remove()
    }

    // reg line
    if (showRegLine) {
      // TODO: regline
    }

    // brush
    const brush = brushX()
      .extent([
        [-1, -1],
        [width + 1, height + 1]
      ])
      .on('start brush end', () => {
        const indexSelection =
          event && event.selection && event.selection.map(xScale.invert)
        console.log(indexSelection)
        if (
          indexSelection &&
          !isNaN(indexSelection[0]) &&
          !isNaN(indexSelection[1])
        ) {
          setselection([...indexSelection])
          // console.log(indexSelection)
        }
      })
    if (previousSelection === selection) {
      svg.select('.brush').call(brush).call(brush.move, selection.map(xScale))
    }
  }, [
    sortedDataset,
    width,
    height,
    xKey,
    yKey,
    showLine,
    showRegLine,
    translateYLabel,
    selection
  ])

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: height,
        position: 'absolute'
      }}
      className={styles.wrapper}
    >
      <svg className={styles.svg} width='100%' height='100%' ref={svgRef}>
        <g className='xaxis' />
        <g className='yaxis' />
        <g className='brush' />
      </svg>
    </div>
  )
}

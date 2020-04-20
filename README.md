# filterable-line-chart

> A VisSpot chart template: a filterable line chart that allows users to filter a portion of the chart

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save filterable-line-chart
```

## Usage

```jsx
import React, { Component } from 'react'

import {FilterableLineChart} from 'filterable-line-chart'
import 'filterable-line-chart/dist/index.css'

class Example extends Component {
  render() {
    return <FilterableLineChart settings={...} dataOptions={...} dataset={...} chartId={...}  />
  }
}
```

## License

MIT © [1994benc](https://github.com/1994benc)

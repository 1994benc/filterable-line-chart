import React, { useEffect, useState } from 'react'

import { FilterableLineChart } from 'filterable-line-chart'
import 'filterable-line-chart/dist/index.css'
import { BASE_URL, MY_PUBLIC_DATASET_ID, APIKEY } from './never_commit/keys'

// Mock settings
// get these from VisSpot's developer console
const settings = [
  {
      "id": "height",
      "isRequired": true,
      "name": "Canvas height",
      "options": [],
      "rangeEnd": 1000,
      "rangeStart": 0,
      "type": "number",
      "value": 600
  },
  {
      "id": "show_reg_line",
      "isRequired": true,
      "name": "Show linear regression line",
      "options": [],
      "rangeEnd": 100,
      "rangeStart": 0,
      "type": "boolean",
      "value": true
  },
  {
      "id": "show_line",
      "isRequired": true,
      "name": "Show line",
      "options": [],
      "rangeEnd": 100,
      "rangeStart": 0,
      "type": "boolean",
      "value": true
  },
  {
      "id": "curve_type",
      "isRequired": true,
      "name": "Curve type",
      "options": [
          "CurveBasis",
          "CurveCardinal",
          "CurveLinear",
          "CurveCatmullRom (alpha = 0.5)",
          "CurveCatmullRom (alpha = 1)"
      ],
      "rangeEnd": 100,
      "rangeStart": 0,
      "type": "options",
      "value": "CurveLinear"
  },
  {
      "id": "translate_y_label",
      "isRequired": true,
      "name": "Translate Y label by",
      "options": [],
      "rangeEnd": "500",
      "rangeStart": "-500",
      "type": "number",
      "value": 2
  }
]

// Mock data_options
// get these from VisSpot's developer console
const data_options = [
  {
      "id": "x",
      "isRequired": true,
      "name": "X axis",
      "type": "number",
      "value": "3.5"
  },
  {
      "id": "y",
      "isRequired": true,
      "name": "Y axis",
      "type": "number",
      "value": "1.4"
  }
]

const App = () => {
  const [dataset, setdataset] = useState([])
  useEffect(() => {
    // Get these API configs from VisSpot's developer console
    // Currently only open for admins 
    fetch(
      `${BASE_URL}/datasets/parse?dataset_id=${MY_PUBLIC_DATASET_ID}&apiKey=${APIKEY}&pagination=0`
    )
      .then(function (value) {
        return value.json()
      })
      .then(function (value) {
        setdataset([...(JSON.parse(value).dataset)])
      })
  }, [])
  return <FilterableLineChart dataset={dataset} settings={settings} dataOptions={data_options} />
}

export default App

'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import Chartist from './Chartist.jsx';

export const TestChart = ({}) => {
  var data = {
    // A labels array that can contain any sort of values
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
      [5, 2, 4, 2, 0]
    ]
  };


  const options = {};

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.

  return <div styles={'width: 50%;'}>
    <Chartist type='Line' data={data} options={options} />
  </div>;
};

export default TestChart;

import React from 'react';
import Chartist from './Chartist';
import Select from 'react-select';

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

  return <div>
    <Select
        name='form-field-name'
        matchPos='start'
        options={[{value: 1, label: 'ONE', value: 2, label: 'TWO'}]}
        onChange={(selected) => console.log(selected)}
    />
    <Chartist type='Line' data={data} options={options} />
    <div className='pure-g'>
      <div className='pure-u-1-3' />
      <div className='pure-u-1-3 black-bg'>YO</div>
      <div className='pure-u-1-3' />
    </div>
  </div>;
};

export default TestChart;

'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Sample} from '../containers';
import Header from '../components/Header';

export const SamplePage = (props) => {
  const {appName} = props;
  // React.createElement(Sample, props)

  return (
    <div>
      <Header appName={appName} />
      <Sample {...props} />
    </div>);
};

export default SamplePage;

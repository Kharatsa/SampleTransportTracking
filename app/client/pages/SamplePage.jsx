import React from 'react';
import {Sample} from '../containers';
import Header from '../components/Header';

export const SamplePage = (props) => {
  return (
    <div>
      <Header appName={props.appName} />
      <Sample {...props} />
    </div>);
};

export default SamplePage;

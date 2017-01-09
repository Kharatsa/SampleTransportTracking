import React from 'react';
import {APP_NAME} from '../../common/sttworkflow';
import {Sample} from '../containers';
import Header from '../components/Header';

export const SamplePage = (props) => {
  return (
    <div>
      <Header appName={APP_NAME} />
      <Sample {...props} />
    </div>);
};

export default SamplePage;

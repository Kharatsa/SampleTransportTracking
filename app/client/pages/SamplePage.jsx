import React from 'react';
import {APP_NAME} from '../../common/sttworkflow';
import {SampleDetail, SampleDetailData} from '../containers';
import Header from '../components/Header';

export const SamplePage = () => {
  return (
    <div>
      <Header appName={APP_NAME} />
      <SampleDetailData />
      <SampleDetail />
    </div>);
};

export default SamplePage;

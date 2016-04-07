import React from 'react';
import TotalCountsAccordion from './TotalCountsAccordion';

export const LabTestsAccordion = ({labTests, metadata, goodCounts}) => {
  const {outerItemKey, outerMetadataKey} = {outerItemKey: 'status', outerMetadataKey: 'statuses'}

  // const {outerItemKey, outerMetadataKey} = ( () => {
  //   if (goodCounts) {
  //     return {outerItemKey: 'status', outerMetadataKey: 'statuses'}
  //   }
  //   else {
  //     return {outerItemKey: 'testRejection', outerMetadataKey: 'rejections'}
  //   }
  // }) ()

  return (
    <TotalCountsAccordion
        items={labTests}
        metadata={metadata}
        outerItemKey={outerItemKey}
        outerMetadataKey={outerMetadataKey}
        innerItemKey={'testType'}
        innerMetadataKey={'labTests'}
        itemCountsKey={'labTestsCount'}
    />
  );
};

export default LabTestsAccordion;

import React from 'react';
import TotalCountsAccordion from './TotalCountsAccordion';

export const LabTestsAccordion = ({labTests, metadata}) => {
  return (
    <TotalCountsAccordion
        items={labTests}
        metadata={metadata}
        outerItemKey={'status'}
        outerMetadataKey={'statuses'}
        innerItemKey={'testType'}
        innerMetadataKey={'labTests'}
        itemCountsKey={'labTestsCount'}
    />
  );
};

export default LabTestsAccordion;

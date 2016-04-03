'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import TotalCountsAccordion from './TotalCountsAccordion';

export const ArtifactsAccordion = ({artifacts, metadata}) => {
  return (
    <TotalCountsAccordion
        items={artifacts}
        metadata={metadata}
        outerItemKey={'stage'}
        outerMetadataKey={'stages'}
        innerItemKey={'artifactType'}
        innerMetadataKey={'artifacts'}
        itemCountsKey={'artifactsCount'}
    />
  );
};

export default ArtifactsAccordion;

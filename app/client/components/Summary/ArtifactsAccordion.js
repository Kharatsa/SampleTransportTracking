import React from 'react';
import TotalCountsAccordion from './TotalCountsAccordion';

const ArtifactsAccordion = ({artifacts, metadata}) => {

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
  )

}

export default ArtifactsAccordion;

import React from 'react';
import {Accordion, AccordionItem} from 'react-sanfona';

const TotalCountsAccordion = ({items, metadata, outerItemKey, outerMetadataKey, innerItemKey, innerMetadataKey, itemCountsKey}) => {

  const accordionItems = items.groupBy( item => item.get(outerItemKey))
  .map( (itemArray, groupKey) => {
    const outerMeta = metadata.hasIn([outerMetadataKey, groupKey, 'value']) ? metadata.getIn([outerMetadataKey, groupKey, 'value']) : '';
    const sampleIdsCount = itemArray.reduce((acc, item) => (acc + item.get('sampleIdsCount')), 0);
    return (
      <AccordionItem key={groupKey} title={`${outerMeta}:   ${sampleIdsCount}`}>
        <ul>
          {itemArray.map((item, index) => {
            const innerMetaKey = item.get(innerItemKey);
            const innerMeta = metadata.hasIn([innerMetadataKey, innerMetaKey, 'value']) ? metadata.getIn([innerMetadataKey, innerMetaKey, 'value']) : '';
            const itemCounts = item.get(itemCountsKey);
            return (
              <li key={index}>
                <span>{`${innerMeta}: `}</span><span style={{textAlign: 'right'}}>{itemCounts}</span>
              </li>
            );
          })}
        </ul>
      </AccordionItem>
    )
  }).toList()

  return (
    <Accordion allowMultiple={true} activeItems={[]}>
      {accordionItems}
    </Accordion>
  )

}

export default TotalCountsAccordion;

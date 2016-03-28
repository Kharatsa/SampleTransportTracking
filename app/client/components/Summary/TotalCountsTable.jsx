import React from 'react';
import MetaText from '../MetaText';
import {Accordion, AccordionItem} from 'react-sanfona';

const TotalCountsTable = ({summary, metadata}) => {
  console.log("TOTAL COUNTS SUMMARY", summary);
  console.log("TOTAL COUNTS SUMMARY", summary.artifacts);
  summary.artifacts.forEach((v) => {
    console.log(v)
  })

  const goodRequests = summary.artifacts
    .filter( artifact => artifact.get('status') === 'OK')
    .filter( artifact => (artifact.get('stage') === 'SDEPART' || artifact.get('stage') === 'SARRIVE'))
    .map( (artifact, index) => {
      const stageKey = artifact.get('stage');
      const stageValue = metadata.get('stages').get(stageKey).get('value');
      const sampleIdsCount = artifact.get('artifactsCountDetails').reduce((sum, detail) => (sum + detail.sampleIdsCount), 0)
      return (
        <AccordionItem title={`${ stageValue }: ${ sampleIdsCount }`} key={stageKey}>
          <ul>
            {artifact.get('artifactsCountDetails')
              .filter(detail => detail.get('type') !== "RESULT")
              .map( detail => {
                const artifactType = detail.get('type')
                return <li>{`${metadata.get('artifacts').get(artifactType).get('value')}: ${detail.get('artifactsCount')}`}</li>
            })}
          </ul>
        </AccordionItem>
      )
    })

  const goodResults = summary.artifacts
    .filter( artifact => artifact.get('status') === 'OK')
    .filter( artifact => (artifact.get('stage') === 'RDEPART' || artifact.get('stage') === 'RARRIVE'))
    .map( artifact => {
      const stageKey = artifact.get('stage');
      const sampleIdsCount = artifact.get('artifactsCountDetails').reduce((sum, detail) => (sum + detail.sampleIdsCount), 0)
      return (
        <div>
          <MetaText metadata={metadata.get('stages')} metaKey={stageKey} />
          <span>:   {sampleIdsCount}</span>
          <br/>
        </div>
      )
    })



  return (
    <div>
      <div>
        <h1> Total Counts Table </h1>
        <span> Artifacts: {summary.totals.get('artifactsCount')} </span><br/>
        <span> Lab Tests: {summary.totals.get('labTestsCount')} </span><br/>
        <span> Sample IDs: {summary.totals.get('sampleIdsCount')} </span><br/>
      </div>
      <div>
        <h2> Artifacts Section </h2>
        <h3> Requests </h3>
        <Accordion activeItems={[]} allowMultiple={true}>
          {goodRequests}
        </Accordion>
        <h3> Results </h3>
        {goodResults}
      </div>
    </div>
  )
}

export default TotalCountsTable;

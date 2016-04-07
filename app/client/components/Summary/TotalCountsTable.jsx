import React from 'react';
import {Seq, List} from 'immutable';
import {ArtifactsCount, LabTestsCount} from '../../api/records';
import ArtifactsAccordion from './ArtifactsAccordion';
import LabTestsAccordion from './LabTestsAccordion';


const TotalCountsTable = ({summary, metadata, goodCounts}) => {

  const cartesianGenerator = (seq) => {
    return seq.butLast().reduceRight( (acc, l) => {
      return Seq(l).flatMap( e => {
        return acc.map( el => Seq([e]).concat(el) );
      })
    }, seq.last())
  }

  //merges in items in the actual data list to elements in default data
  //that match based on matchKeys
  const merge = (defaultData, actualData, matchKeys) => {
    return actualData.reduce((acc, artifact) => {
      return acc.map( e => {
          const matchFound = matchKeys.reduce((match, key) => {
            return (match && (e.get(key) === artifact.get(key)));
          }, true)
          return matchFound ? artifact : e;
      })
    }, defaultData);
  }

  // **************************************************************************************
  // Requests
  const statuses = (() => {
    return goodCounts ? Seq(['OK']) : Seq(['BAD'])
  })()
  const requestStages = Seq(['SDEPART', 'SARRIVE'])
  const requestArtifactTypes = Seq(['REQUEST', 'BLOOD', 'SPUTUM', 'URINE', 'DBS'])

  //generate default requests artifact counts
  const defaultRequests = cartesianGenerator(Seq([statuses, requestStages, requestArtifactTypes]))
    .map( s => {
      return new ArtifactsCount({status: s.get(0), stage: s.get(1), artifactType: s.get(2)})
    })

  const mergedRequests = merge(defaultRequests, summary.artifacts, Seq(['status', 'stage', 'artifactType']))

  // **************************************************************************************
  // Results
  const resultStages = Seq(['RDEPART', 'RARRIVE'])
  const resultArtifactTypes = Seq(['RESULT'])

  const defaultResults = cartesianGenerator(Seq([statuses, resultStages, resultArtifactTypes]))
    .map( s => {
      return new ArtifactsCount({status: s.get(0), stage: s.get(1), artifactType: s.get(2)})
    })

  const mergedResults = merge(defaultResults, summary.artifacts, Seq(['status', 'stage', 'artifactType']))

  // **************************************************************************************
  // Lab Tests
  // const testStatuses = Seq(['REQ', 'RVW', 'PRT'])
  const testStatuses = (() => {
    return goodCounts ? Seq(['REQ', 'RVW', 'PRT']) : Seq(['REJ'])
  }) ()
  const testTypes = (metadata.has('labTests') ? Seq(metadata.get('labTests').map(test => test.get('key'))) : List()).toList()
  const rejectionCodes = (() => {
    if (goodCounts) {
      return Seq([null])
    }
    else {
      const validRejectionCodes = (metadata.has('rejections') ? Seq(metadata.get('rejections').map(rejection => {
        return rejection.get('key');
      })) : Seq([null]) )
      return validRejectionCodes;
    }
  })().toList()

  const defaultLabTestsCounts = cartesianGenerator(Seq([testStatuses, testTypes, rejectionCodes]))
    .map( s => {
      return new LabTestsCount({status: s.get(0), testType: s.get(1), testRejection: s.get(2)})
    })

  const mergedLabTestsCounts =  merge(defaultLabTestsCounts, summary.labTests, Seq(['status', 'testType', 'testRejection']))

  return (
    <div>
      <ArtifactsAccordion
        artifacts={mergedRequests}
        metadata={metadata}
        />
      <LabTestsAccordion
        labTests={mergedLabTestsCounts}
        metadata={metadata}
        goodCounts={goodCounts}
        />
      <ArtifactsAccordion
        artifacts={mergedResults}
        metadata={metadata}
        />
    </div>
  )
}

export default TotalCountsTable;

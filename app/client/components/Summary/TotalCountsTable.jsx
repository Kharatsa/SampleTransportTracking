import React from 'react';

const TotalCountsTable = ({summary}) => {
  console.log("TOTAL COUNTS SUMMARY", summary);
  return (
    <div>
      <span> Total Counts Table </span><br/>
      <span> Artifacts: {summary.totals.get('artifactsCount')} </span><br/>
      <span> Lab Tests: {summary.totals.get('labTestsCount')} </span><br/>
      <span> Sample IDs: {summary.totals.get('sampleIdsCount')} </span><br/>
    </div>
  )
}

export default TotalCountsTable;

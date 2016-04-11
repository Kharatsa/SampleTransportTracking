import React from 'react';
import Moment from 'moment';

const TurnAroundsTable = ({turnArounds, metadata}) => {

  const stageStatusToString = (stageStatus) => {
    if (!stageStatus) return '';

    if (stageStatus.stage === 'LABSTATUS') {
      return metadata.hasIn(['statuses', stageStatus.status, 'value']) ? metadata.getIn(['statuses', stageStatus.status, 'value']) : '';
    }
    else {
      return metadata.hasIn(['stages', stageStatus.stage, 'value']) ? metadata.getIn(['stages', stageStatus.stage, 'value']) : '';
    }
  }
  
  return (
    <div>
      {turnArounds.map( (turnAround, index)  => {
        const from = stageStatusToString(turnAround.from)
        const to = stageStatusToString(turnAround.from)
        const time = Moment.duration(turnAround.averageTATms).humanize()
        return (
          <span key={index}>
            {from} - {to} - about {time}<br/>
          </span>
        )
      })}
    </div>
  )

  return <span>TurnArounds!!</span>
}

export default TurnAroundsTable;

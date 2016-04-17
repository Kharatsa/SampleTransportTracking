import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List} from 'immutable';
import Moment from 'moment';
import MetaText from '../MetaText';

const descTATElem = (metaStatuses, metaStages, step) => {
  const stageKey = step.stage;
  const statusKey = step.status;

  const stageDesc = (
    typeof stageKey !== 'undefined' ?
    <MetaText metadata={metaStages} metaKey={stageKey} /> :
    null
  );

  const statusDesc = (
    typeof statusKey !== 'undefined' ?
    <MetaText metadata={metaStatuses} metaKey={statusKey} /> :
    null
  );

  return <span>{statusDesc || stageDesc}</span>;
};

export const TurnAroundsTable = ({metaStages, metaStatuses, turnArounds}) => {
  const turnaroundTimes = turnArounds.map((turnAround, index) => {
    const fromDescElem = descTATElem(metaStatuses, metaStages, turnAround.from);
    const toDescElem = descTATElem(metaStatuses, metaStages, turnAround.to);
    const timeDesc = Moment.duration(turnAround.averageTATms).humanize();

    return <li key={index}>{fromDescElem} - {toDescElem}: {timeDesc}</li>;
  });

  return <ul>{turnaroundTimes}</ul>;
};

TurnAroundsTable.propTypes = {
  metaStages: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaStatuses: PropTypes.instanceOf(ImmutableMap).isRequired,
  turnArounds: PropTypes.instanceOf(List).isRequired
};

export default TurnAroundsTable;

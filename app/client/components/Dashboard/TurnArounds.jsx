import React, {PropTypes} from 'react';
import {Map as ImmutableMap, List, Record} from 'immutable';
import TurnAroundsTable from './TurnAroundsTable';
import TurnAroundsChart from './TurnAroundsChart';

export class TurnArounds extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      metaStages, metaStatuses, stagesTATs, endToEndTAT
    } = this.props;

    return (
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsChart
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
          />
        </div>
        <div className='pure-u-1 pure-u-lg-1-2'>
          <TurnAroundsTable
            metaStages={metaStages}
            metaStatuses={metaStatuses}
            stagesTATs={stagesTATs}
            endToEndTAT={endToEndTAT}
          />
        </div>
      </div>);
  }
}

TurnArounds.propTypes = {
  endToEndTAT: PropTypes.instanceOf(Record).isRequired,
  fetchTurnArounds: PropTypes.func.isRequired,
  metaStages: PropTypes.instanceOf(ImmutableMap),
  metaStatuses: PropTypes.instanceOf(ImmutableMap),
  summaryFilter: PropTypes.object,
  stagesTATs: PropTypes.instanceOf(List).isRequired,
};

export default TurnArounds;

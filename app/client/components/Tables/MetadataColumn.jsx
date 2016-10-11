import React, {PropTypes} from 'react';
import {Column} from 'react-virtualized';
import {Map as ImmutableMap} from 'immutable';
import {cellRendererPropTypes} from '../../util/proptypes';
import MetaText from '../MetaText.jsx';

/**
 * Retrieves the display value for a given metadata key passed as cellData
 * from the metadata mapping passed as columnData.
 **/
const MetadataCell = ({cellData, columnData, key, style}) => {
  return <MetaText metadata={columnData} metaKey={cellData}
          key={key} style={style}/>;
};

MetadataCell.propTypes = {
  ...cellRendererPropTypes,
  cellData: PropTypes.string.isRequired,
  columnData: PropTypes.instanceOf(ImmutableMap).isRequired,
};

export const MetadataColumn = (props) => {
  return <Column {...props} cellRenderer={MetadataCell}/>;
};

export default MetadataColumn;

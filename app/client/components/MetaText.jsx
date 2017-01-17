import React, {PropTypes} from 'react';
import {Map as ImmutableMap} from 'immutable';

export const MetaText = ({metadata, metaKey, ...rest}) => {
  if (metadata) {
    const entry = metadata.get(metaKey);
    return <span {...rest}>{entry ? entry.get('value') : ''}</span>;
  } else {
    return null;
  }
};

MetaText.propTypes = {
  metadata: PropTypes.instanceOf(ImmutableMap).isRequired,
  metaKey: PropTypes.string.isRequired,
};

export default MetaText;

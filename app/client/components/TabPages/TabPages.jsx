import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import WaitOnFetch from '../WaitOnFetch.jsx';


export const TabPages = React.createClass({
  propTypes: {
    fetchChanges: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      page: PropTypes.number,
    }),
    summaryFilter: PropTypes.object
  },

  

  render() {
  }
});

export default TabPages;
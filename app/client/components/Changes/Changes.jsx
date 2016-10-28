import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import WaitOnFetch from '../WaitOnFetch.jsx';
import ChangesTable from './ChangesTable';

const ChangesListing = (props) => {
  return (
    <div className='content'>
      <ChangesTable {...props} />
    </div>
  );
};

export const ChangesListingWrapped = WaitOnFetch(ChangesListing);

export const Changes = React.createClass({
  propTypes: {
    fetchChanges: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      page: PropTypes.number,
    }),
    summaryFilter: PropTypes.object
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  componentWillReceiveProps(nextProps) {
    const {page} = this.props.params;
    const nextPage = nextProps.params.page;
    if (nextPage !== page) {
      this._update(this.props.summaryFilter, nextPage);
    }
  },

  componentWillMount() {
    const {page} = this.props.params;
    this._update(this.props.summaryFilter, page);
  },

  _update(filter, page) {
    const {fetchChanges} = this.props;
    fetchChanges(filter, page);
  },

  render() {
    return <ChangesListingWrapped {...this.props} />;
  }
});

export default Changes;

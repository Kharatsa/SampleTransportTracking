import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import WaitOnFetch from './WaitOnFetch.jsx';
import WindowSizeListener from '../containers/WindowSizeListener.jsx';
import ChangesTable from './ChangesTable';

const FlexAllWaysTable = WindowSizeListener(ChangesTable, {avoidSideMenu: true});

const ChangesListing = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  render() {
    return (
      <div className='content'>
        <FlexAllWaysTable {...this.props} />
      </div>
    );
  }
});

export const ChangesListingWrapped = WaitOnFetch(ChangesListing);

export const Changes = React.createClass({
  propTypes: {
    isLoading: PropTypes.bool.isRequired,
    page: PropTypes.any,
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
    const {fetchChanges} = this.props.actions;
    fetchChanges(filter, page);
  },

  render() {
    return <ChangesListingWrapped {...this.props} />;
  }
});

export default Changes;

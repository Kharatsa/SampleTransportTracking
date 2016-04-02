'use strict';

import React from 'react';
import WaitOnFetch from '../containers/wrappers/WaitOnFetch.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WindowSizeListener from '../containers/wrappers/WindowSizeListener.jsx';
import ChangesTable from './ChangesTable';
import Paging from './Pagination/Paging.jsx';

const FlexAllWaysTable = WindowSizeListener(ChangesTable);

const _ChangesListing = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    const {changesTotal, changeIds, page} = this.props;

    return (
      <div className='content'>
        <FlexAllWaysTable {...this.props} />
        <Paging
            total={changesTotal}
            perPage={changeIds.size}
            currentPage={page.get('current')} />
      </div>
    );
  }
});

export const ChangesListingWrapped = WaitOnFetch(_ChangesListing);

export const Changes = React.createClass({
  componentWillReceiveProps(nextProps) {
    const {page} = this.props.params;
    const nextPage = nextProps.params.page;
    if (nextPage !== page) {
      this._update(this.props.summaryFilter, nextPage);
    }
  },

  shouldComponentUpdate(nextProps) {
    if (nextProps.isFetchingData) {
      return false;
    }

    // Strict equality for speed
    return !(
      this.props.changesById === nextProps.changesById &&
      this.props.samplesById === nextProps.samplesById &&
      this.props.artifactsById === nextProps.artifactsById &&
      this.props.labTestsById === nextProps.labTestsById &&
      this.props.metadata === nextProps.metadata
    );
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

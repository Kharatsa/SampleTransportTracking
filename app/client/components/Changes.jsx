import React, {PropTypes} from 'react';
import WaitOnFetch from '../containers/wrappers/WaitOnFetch.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import WindowSizeListener from '../containers/wrappers/WindowSizeListener.jsx';
import ChangesTable from './ChangesTable';

const FlexAllWaysTable = WindowSizeListener(ChangesTable, {avoidSideMenu: true});

const _ChangesListing = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className='content'>
        <FlexAllWaysTable {...this.props} />
      </div>
    );
  }
});

export const ChangesListingWrapped = WaitOnFetch(_ChangesListing);

export const Changes = React.createClass({
  propTypes: {
    page: PropTypes.any,
    summaryFilter: PropTypes.object
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

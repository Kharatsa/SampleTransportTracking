import React, {PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {withRouter} from 'react-router';

const stripTrim = str => {
  return str ? str.trim().split(' ').join('') : '';
};

export const SampleSearch = withRouter(React.createClass({
  propTypes: {
    pushHistory: PropTypes.func.isRequired,
    router: PropTypes.object
  },

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },

  getInitialState() {
    return {value: ''};
  },

  handleSubmit(event) {
    event.preventDefault();

    const {router} = this.props;
    const sampleId = stripTrim(this.state.value);
    if (sampleId.length) {
      router.push(`/samples/${sampleId}`);
    }
  },

  handleChange(event) {
    const sampleId = stripTrim(event.target.value);
    this.setState({value: sampleId});
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='pure-form'>
        <label htmlFor='search'>Lookup Sample ID</label>
        <input
            id='sample-search'
            type='text'
            value={this.state.value}
            placeholder='Sample ID...'
            className='pure-menu-input'
            onChange={this.handleChange} />
      </form>
    );
  }
}));

export default SampleSearch;

import React, {PropTypes} from 'react';
// import {withRouter} from 'react-router';

const stripTrim = str => {
  return str ? str.trim().split(' ').join('') : '';
};

export const SampleSearch = React.createClass({
// const SampleSearchBase = React.createClass({
  propTypes: {
    pushHistory: PropTypes.func.isRequired,
    // router: PropTypes.object
  },

  getInitialState() {
    return {value: ''};
  },

  handleSubmit(event) {
    event.preventDefault();

    // const {router} = this.props;
    const {pushHistory} = this.props;
    const sampleId = stripTrim(this.state.value);
    if (sampleId.length) {
      // router.push(`/samples/${sampleId}`);
      pushHistory(`/samples/${sampleId}`);
    }
  },

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='pure-form'>
        <label htmlFor='search'>Lookup Sample ID</label>
        <input
            id='search'
            type='text'
            value={this.state.value}
            placeholder='Sample ID...'
            className='pure-menu-input'
            onChange={this.handleChange} />
      </form>
    );
  }
});

// export const SampleSearch = withRouter(SampleSearchBase);

export default SampleSearch;

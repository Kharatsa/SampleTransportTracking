import React, {PropTypes} from 'react';

const stripTrim = str => {
  return str ? str.trim().split(' ').join('') : '';
};

export const SampleSearch = React.createClass({
  propTypes: {
    pushHistory: PropTypes.func.isRequired
  },

  getInitialState() {
    return {value: null};
  },

  handleSubmit(event) {
    event.preventDefault();
    const {pushHistory} = this.props;
    const sampleId = stripTrim(this.state.value);
    if (sampleId.length) {
      pushHistory(`/samples/${sampleId}`);
    }
  },

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='pure-form'>
        <label htmlFor='search'>Sample ID Search</label>
        <input
            id='search'
            type='text'
            value={this.state.value}
            placeholder='Sample ID'
            className='pure-menu-input'
            onChange={this.handleChange} />
      </form>
    );
  }
});

export default SampleSearch;

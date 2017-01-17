import React from 'react';
import {withRouter} from 'react-router';
import {routerPropTypes} from '../../util/proptypes';

const stripTrim = str => {
  return str ? str.trim().split(' ').join('') : '';
};

class SampleSearchBase extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  handleSubmit(event) {
    event.preventDefault();

    const {router} = this.props;
    const sampleId = stripTrim(this.state.value);
    if (sampleId.length) {
      router.push(`/samples/${sampleId}`);
    }
  }

  handleChange(event) {
    const sampleId = stripTrim(event.target.value);
    this.setState({value: sampleId});
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit.bind(this)}
        className='pure-form'
      >
        <label htmlFor='search'>Lookup Sample ID</label>
        <input
            id='sample-search'
            type='text'
            value={this.state.value}
            placeholder='Sample ID...'
            className='pure-menu-input'
            onChange={this.handleChange.bind(this)}
        />
      </form>
    );
  }
}

SampleSearchBase.propTypes = {
  ...routerPropTypes,
};

export const SampleSearch = withRouter(SampleSearchBase);

export default SampleSearch;

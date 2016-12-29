import React, {PropTypes} from 'react';

const callMountFunc = (funcName, props) => {
  const func = props[funcName];
  if (func) {
    func();
  } else if (process.env.NODE_ENV !== 'production') {
    // console.error(`Component missing ${funcName} prop`);
  }
  console.error(`Component missing ${funcName} prop`); // TODO(sean): remove
};

/*
 * Calls the prop function specified by the onMountFunc prop.
 */
export const CallOnMount = Component => {
  let wasMounted = false;

  const WrappedCallOnMount = ({onMountFunc=null, ...others}) => {
    if (!wasMounted && onMountFunc) {
      callMountFunc(onMountFunc, others);
      wasMounted = true;
    }
    return <Component {...others} />;
  };

  WrappedCallOnMount.propTypes = {
    onMountFunc: PropTypes.string.isRequired,
  };

  return WrappedCallOnMount;
};

export default CallOnMount;

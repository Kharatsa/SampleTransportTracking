const makeConverter = (convertValue) => {
  if (convertValue) {
    return value => convertValue(value);
  } else {
    return value => value;
  }
};

/**
* Returns the final value, given the String value from router
* @callback convertValueCallback
* @param {string} value - The raw value
* @returns {Any}
*/

/**
* @callback paramValueCallback
* @param {Object} router - react-router
* @returns {string}
*/

/**
* @param {string} key - the router parameter key
 * @param {convertValueCallback} [convert]
* @returns {paramValueCallback}
*/
export const paramValue = (key, convert=null) => {
  const converter = makeConverter(convert);
  return ({params}) => {
    return converter(params[key]);
  };
};

/**
 * @callback queryValueCallback
 * @param {Object} router - react-router
 * @returns {string|undefined}
 */

/**
 * @param {string} key - The location query key
 * @param {convertValueCallback} [convert]
 * @returns {queryValueCallback}
 */
export const queryValue = (key, convert=null) => {
  const converter = makeConverter(convert);
  return ({location: {query}}) => {
    return converter(query[key]);
  };
};

/**
 * Compose param and query callbacks into a single function.
 * @param {queryValueCallback|paramValueCallback[]} args
 * @returns {string[]}
 */
export const manyValues = (...args) => {
  return router => {
    return args.reduce((result, getValue) => {
      result.push(getValue(router));
      return result;
    }, []);
  };
};

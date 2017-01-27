/**
* Converts the string value from react-router to its final representation.
* @callback convertValueCallback
* @param {string} value - The raw value
* @returns {Any}
*/

/**
* Returns either the string or converted value from react-router.
* @callback paramValueCallback
* @param {Object} router - react-router
* @returns {Any}
*/

/**
* @param {string} key - the router parameter key
 * @param {convertValueCallback} [convert]
* @returns {paramValueCallback}
*/
export const paramValue = (key, convert=null) => {
  return ({params}) => {
    const value = params[key];
    if (convert) {
      return convert(value);
    } else {
      return value;
    }
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
  return ({location: {query}}) => {
    const value = query[key];
    if (convert) {
      return convert(value);
    } else {
      return value;
    }
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

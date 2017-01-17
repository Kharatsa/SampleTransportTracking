/**
* Return a number value for the given string. If the string may
* not be converted to a number, the original value will be
* returned unaltered.
*
* @param {string} value
* @returns {number|null|undefined}
*/
export const intFromString = value => {
  const result = Number.parseInt(value);
  if (Number.isNaN(result)) {
    return value;
  }
  return result;
};

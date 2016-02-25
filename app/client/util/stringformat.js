'use strict';

// via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#Example:_Checking_for_support_for_locales_and_options_arguments
export const toLocaleStringSupportsLocales = () => {
  let number = 0;
  try {
    number.toLocaleString('i');
  } catch (err) {
    return err.name === 'RangeError';
  }
  return false;
};

// const shortFormatOptions = {
//   localeMatcher: 'best-fit',
//   year: 'numeric',
//   month: '2-digit',
//   day: '2-digit',
//   hour: '2-digit',
//   minute: '2-digit',
//   second: '2-digit'
// };

// const longFormatOptions = {
//   localeMatcher: 'best-fit',
//   weekday: 'long',
//   year: 'numeric',
//   month: 'short',
//   day: '2-digit',
//   hour: '2-digit',
//   minute: '2-digit',
//   second: '2-digit'
// };

// let longFormat;
// let shortFormat;
// const language = window.navigator.language;

// try {
//   longFormat = new Intl.DateTimeFormat(language, longFormatOptions);
//   shortFormat = new Intl.DateTimeFormat(language, shortFormatOptions);
// } catch (err) {
//   console.debug(err);
//   // TODO
// }

// const local

// export const shortFormatDate = date => {
//   // if (toLocaleStringSupportsLocales()) {}
//   // console.debug(shortFormat)
//   // return shortFormat ? shortFormat.format(date) : date.toLocaleString();
// };

// export const longFormatDate = date => {
//   // console.debug(longFormat)
//   // return longFormat ? longFormat.format(date) : date.toLocaleString();
// };

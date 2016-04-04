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

const shortFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

const longFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

const shortDateFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
};

let longFormat;
let shortFormat;
let shortDateFormat;

const language = window.navigator.language;

try {
  longFormat = new Intl.DateTimeFormat(language, longFormatOptions);
  shortFormat = new Intl.DateTimeFormat(language, shortFormatOptions);
  shortDateFormat = new Intl.DateTimeFormat(language, shortDateFormatOptions);
} catch (err) {
  // noop
}

const supportsLocales = toLocaleStringSupportsLocales();

const formatDate = (dateStr, formatter) => {
  if (supportsLocales) {
    return formatter.format(new Date(dateStr));
  }
  return (new Date(dateStr)).toLocaleString();
};

export const shortFormatDateTime = dateStr => formatDate(dateStr, shortFormat);

export const longFormatDateTime = dateStr => formatDate(dateStr, longFormat);

export const shortFormatDate = dateStr => formatDate(dateStr, shortDateFormat);

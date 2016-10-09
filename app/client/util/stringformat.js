/* global require */

import moment from 'moment';

const config = require('../../config/commonconfig.js');

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

const formatDate = (dateStr, formatter) => {
  return moment(dateStr).format(formatter);
};

export const shortFormatDateTime = dateStr =>
    formatDate(dateStr, config.DATETIME_FORMAT);

export const longFormatDateTime = dateStr =>
  formatDate(dateStr, config.DATETIME_FORMAT);

export const shortFormatDate = dateStr =>
  formatDate(dateStr, config.DATE_FORMAT);

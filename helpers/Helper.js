import React from 'react';
import {
  Picker,
} from 'react-native';
import _ from 'lodash';

class Helper {
  static formatDate(date) {
    const d = new Date(date);
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = d.getFullYear();

    if (month.length < 2) { // eslint-disable-line no-magic-numbers
      month = `0${month}`;
    }
    if (day.length < 2) { // eslint-disable-line no-magic-numbers
      day = `0${day}`;
    }

    return [year, month, day].join('-');
  }

  static isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) {
      return true;
    }
    return input.replace(/\s/g, '').length < 1;
  }
}

export default Helper;
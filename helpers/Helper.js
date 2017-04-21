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

  static buildItemListForPicker(optionList, selectedOptionId) {
    debugger;
    const optId = parseInt(selectedOptionId, 10);
    let options = [];
    options.push(<Picker.Item key={-1} label="--Please Select--" value="-1" />);

    const optionsToAdd = _.map(optionList, (option) => {
      let o;
      o = (<Picker.item key={option.id} value={option.id} label={option.name} />);
      return o;
    });
    options.push(...optionsToAdd);

    return options;
  }
}

export default Helper;
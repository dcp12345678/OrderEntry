import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TouchableHighlight
} from 'react-native';


const Bold = ({ children, style, ...otherProps }) =>
  <Text style={[boldTextStyles.text, style]} {...otherProps}>{children}</Text>;

Bold.propTypes = {
  children: React.PropTypes.node.isRequired,
  style: Text.propTypes.style
};

const boldTextStyles = StyleSheet.create({
  text: {
    fontWeight: '600'
  }
});

export default Bold;
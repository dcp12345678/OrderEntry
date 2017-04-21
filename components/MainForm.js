import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  Alert
} from 'react-native';
import Login from './Login';
import data from '../data/sales.json';
import RecentOrders from './RecentOrders';

class MainForm extends Component {

  render() {
    return (
      <View style={{flex:1}}>
        <RecentOrders navigator={this.props.navigator} userId={this.props.userId} />
      </View>
    );
  }
};

export default MainForm;
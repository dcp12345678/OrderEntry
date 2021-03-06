import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import PickerButton from './components/PickerButton';
import PickerListView from './components/PickerListView';
import EditOrder from './components/EditOrder';
import EditOrderLineItem from './components/EditOrderLineItem';
import RecentOrders from './components/RecentOrders';
import SearchOrders from './components/SearchOrders';
import Login from './components/Login';

const OrderEntry = StackNavigator({
  Login: { screen: Login },
  PickerButton: { screen: PickerButton },
  PickerListView: { screen: PickerListView },
  RecentOrders: { screen: RecentOrders },
  EditOrderLineItem: { screen: EditOrderLineItem },
  EditOrder: { screen: EditOrder },
  SearchOrders: { screen: SearchOrders },
});

AppRegistry.registerComponent('OrderEntry', () => OrderEntry);

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import MainApp from './components/MainApp';
import MainForm from './components/MainForm';
import OrderDetails from './components/OrderDetails';
import PickerButton from './components/PickerButton';
import PickerListView from './components/PickerListView';
import EditOrderLineItem from './components/EditOrderLineItem';
import RecentOrders from './components/RecentOrders';
import Login from './components/Login';

const OrderEntry = StackNavigator({
  Login: { screen: Login },
  PickerButton: { screen: PickerButton },
  MainForm: { screen: MainForm },
  OrderDetails: { screen: OrderDetails },
  PickerListView: { screen: PickerListView },
  RecentOrders: { screen: RecentOrders },
  EditOrderLineItem: { screen: EditOrderLineItem },
});

AppRegistry.registerComponent('OrderEntry', () => OrderEntry);

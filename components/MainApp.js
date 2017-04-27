import React, { Component } from 'react';
import {
  Navigator,
} from 'react-native';
import Login from './Login';
import MainForm from './MainForm';
import OrderDetails from './OrderDetails';
import EditOrder from './EditOrder';
import EditOrderLineItem from './EditOrderLineItem';
import PickerListView from './PickerListView';

class MainApp extends Component {

  render() {
    return (
      <Navigator
        initialRoute={{ name: 'Login' }}
        renderScene={this.renderScene}
        configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJumpFromRight}
      />
    )
  }

  renderScene(route, navigator) {
    switch (route.name) {
      case 'Login':
        return (
          <Login navigator={navigator} {...route.passProps} />
        );
      case 'MainForm':
        return (
          <MainForm navigator={navigator} {...route.passProps} />
        );
      case 'OrderDetails':
        return (
          <OrderDetails navigator={navigator} {...route.passProps} />
        );
      case 'EditOrder':
        return (
          <EditOrder navigator={navigator} {...route.passProps} />
        );
      case 'EditOrderLineItem':
        return (
          <EditOrderLineItem navigator={navigator} {...route.passProps} />
        );
      case 'PickerListView':
        return (
          <PickerListView navigator={navigator} {...route.passProps} />
        );
    }
  }
};

export default MainApp;
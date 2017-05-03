import React, { Component } from 'react';
import {
  Navigator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Login from './Login';
import MainForm from './MainForm';
import OrderDetails from './OrderDetails';
import EditOrder from './EditOrder';
import EditOrderLineItem from './EditOrderLineItem';
import PickerListView from './PickerListView';

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  }
});
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
    let component;
    switch (route.name) {
      case 'Login':
        component = (<Login navigator={navigator} {...route.passProps} />);
        break;
      case 'MainForm':
        component = (<MainForm navigator={navigator} {...route.passProps} />);
        break;
      case 'OrderDetails':
        component = (<OrderDetails navigator={navigator} {...route.passProps} />);
        break;
      case 'EditOrder':
        component = (<EditOrder navigator={navigator} {...route.passProps} />);
        break;
      case 'EditOrderLineItem':
        component = (<EditOrderLineItem navigator={navigator} {...route.passProps} />);
        break;
      case 'PickerListView':
        component = (<PickerListView navigator={navigator} {...route.passProps} />);
        break;
    }

    // no longer using background image, just using solid color for background instead
    /*return (
      <Image source={require('../images/background.jpg')}
        style={styles.backgroundImage}>
        {component}
      </Image>
    );*/
    return (
      <View style={{ flex: 1, backgroundColor: 'lightsteelblue' }}>
        {component}
      </View>
    );
  }
};

export default MainApp;
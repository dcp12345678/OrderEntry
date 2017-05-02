import React, { Component } from 'react';
import {
  Navigator,
  Image,
  StyleSheet,
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
    let comp;
    switch (route.name) {
      case 'Login':
        comp = (<Login navigator={navigator} {...route.passProps} />);
        break;
      case 'MainForm':
        comp = (<MainForm navigator={navigator} {...route.passProps} />);
        break;
      case 'OrderDetails':
        comp = (<OrderDetails navigator={navigator} {...route.passProps} />);
        break;
      case 'EditOrder':
        comp = (<EditOrder navigator={navigator} {...route.passProps} />);
        break;
      case 'EditOrderLineItem':
        comp = (<EditOrderLineItem navigator={navigator} {...route.passProps} />);
        break;
      case 'PickerListView':
        comp = (<PickerListView navigator={navigator} {...route.passProps} />);
        break;
    }

    return (
      <Image source={require('../images/background.jpg')}
        style={styles.backgroundImage}>
        {comp}
      </Image>
    );
  }
};

export default MainApp;
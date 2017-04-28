import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  Button,
  Alert,
} from 'react-native';
import Bold from './Bold';
import AuthApi from '../api/AuthApi';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialIcons';

const authApi = new AuthApi();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10
  },
  headerItem: {
    backgroundColor: 'lightgoldenrodyellow',
    borderWidth: 1,
    borderColor: 'goldenrod',
    alignItems: 'center',
    alignSelf: 'stretch',
    margin: 30,
    fontSize: 17
  },
  item: {
    height: 40,
    fontSize: 20,
    alignSelf: 'stretch'
  },
  headline: {
    fontFamily: 'Georgia',
    fontSize: 18
  },
  subheader: {
    color: 'blue'
  },
  bold: {
    fontWeight: 'bold'
  },
  green: {
    color: 'green'
  },
  purple: {
    color: '#841584'
  },
  loginButton: {
    marginTop: 10,
    alignSelf: 'stretch',
  }
});


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { showSpinner: false };
  }

  loginOnPress = () => {
    this.setState({ showSpinner: true });
    authApi.login(this.state.loginId, this.state.password).then((loginResult) => {
      this.setState({ showSpinner: false });
      const obj = JSON.parse(loginResult.text);
      // this.props.auth.setToken(authResult.accessToken);
      if (obj.result === 'successful login') {
        //Alert.alert('login successful');
        this.props.navigator.push({
          name: 'MainForm',
          passProps: {
            prop1: 'the first property***',
            prop2: 42,
            userId: obj.userId,
          }
        });
        //Helper.setSessionStorageObject('userDetails', {userId: obj.userId, sessionId: obj.sessionId});
        //hashHistory.push('/main');
      } else {
        debugger;
        this.setState({ showSpinner: false });
        setTimeout(() => {
          Alert.alert('login failed!', `${obj.result || '--- could not login'}`);
        }, 100)
        //hashHistory.push('/login');
      }
    }).catch((err) => {
      debugger;
      this.setState({ showSpinner: false });
      setTimeout(() => {
        Alert.alert('login failed!', `${JSON.stringify(err) || '-- could not login'}`);
      }, 100)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.showSpinner} textContent={"Logging In..."} textStyle={{ color: '#FFF' }} />
        <Text style={[styles.headerItem, styles.bold, styles.purple, { alignSelf: 'center' }]}>
          Welcome to the Order Entry system
        </Text>
        <TextInput
          style={styles.item}
          autoCapitalize='none'
          onChangeText={(loginId) => this.setState({ loginId })}
          placeholder="Login Id" />
        <TextInput
          style={styles.item}
          autoCapitalize='none'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          placeholder="Password" />
        <View style={styles.loginButton}>
          <Icon.Button style={{ alignSelf: 'center' }} name="lock"
            backgroundColor="#841584" onPress={this.loginOnPress} >
            <Text style={{ fontSize: 18, color: 'white', }}>Login</Text>
          </Icon.Button >
        </View>

      </View >
    );

  }
};

export default Login;
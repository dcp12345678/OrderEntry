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
  Platform,
} from 'react-native';
import Bold from './Bold';
import AuthApi from '../api/AuthApi';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const authApi = new AuthApi();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10
  },
  textInput: {
    height: 40,
    fontSize: (Platform.OS === 'ios') ? 20 : 18,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 7,
    color: 'darkblue',
    paddingLeft: 7,
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
});


class Login extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Order Entry System',
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: 20 },
    headerLeft: (
      <TouchableHighlight
        style={{
          borderRadius: 20,
        }}
        underlayColor='#578dba' onPress={() => { navigation.goBack(); }}>
        <FontAwesomeIcon name='arrow-circle-left' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
      </TouchableHighlight>
    )
  });

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
      <View style={{ flex: 1, flexDirection: 'column', marginTop: 30 }}>
        <View style={styles.container}>
          <Spinner visible={this.state.showSpinner} textContent={"Logging In..."} textStyle={{ color: '#FFF' }} />
          <TextInput
            style={styles.textInput}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            onChangeText={(loginId) => this.setState({ loginId })}
            placeholder="Login Id" />
          <TextInput
            style={[styles.textInput, { marginTop: 10 }]}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}
            placeholder="Password" />
          <LinearGradient style={{ borderRadius: 5, alignSelf: 'stretch', marginTop: 20 }}
            colors={['#4c669f', '#3b5998', '#192f6a']} >
            <TouchableHighlight underlayColor='steelblue' onPress={this.loginOnPress}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <MaterialIcon name='lock' color='white' size={20} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5 }} />
                <Text style={{ fontSize: 20, color: 'white', marginLeft: 5, marginTop: 5, marginBottom: 5 }}>Login</Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        </View >
      </View >
    );

  }
};

export default Login;
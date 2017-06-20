import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  Alert,
  Button,
  Platform,
  Dimensions,
  DatePickerAndroid,
  DatePickerIOS,
} from 'react-native';
import data from '../data/sales.json';
import OrdersApi from '../api/OrdersApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import Promise from 'bluebird';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker'

class SearchOrders extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Search Orders',
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: Platform.OS === 'ios' ? 18 : 20, },
    headerLeft: (<View></View>
    ),
    headerRight: (<View></View>
    ),
  });

  constructor(props) {
    super(props)
    this.state = { date: "" }
  }

  searchOnPress = () => {

  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'lightsteelblue' }}>
        <View style={{ margin: 10 }}>
          <View>
            <Text style={{ fontSize: 20, color: 'darkblue', fontWeight: 'bold', marginRight: 10 }}>Created between</Text>
          </View>
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <DatePicker
              date={this.state.date}
              mode="date"
              placeholder=""
              format="YYYY-MM-DD"
              minDate="2012-05-01"
              maxDate="2018-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  borderRadius: 7,
                  backgroundColor: 'white',
                },
                dateText: {
                  fontSize: (Platform.OS === 'ios') ? 20 : 18,
                  backgroundColor: 'white',
                  color: 'darkblue',
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
            <Text style={{
              fontSize: 20,
              color: 'darkblue',
              fontWeight: 'bold',
              marginLeft: 10,
              marginRight: 10,
              alignSelf: 'center'
            }}>and</Text>
            <DatePicker
              date={this.state.date}
              mode="date"
              placeholder=""
              format="YYYY-MM-DD"
              minDate="2012-05-01"
              maxDate="2018-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                dateInput: {
                  borderRadius: 7,
                  backgroundColor: 'white',
                },
                dateText: {
                  fontSize: (Platform.OS === 'ios') ? 20 : 18,
                  backgroundColor: 'white',
                  color: 'darkblue',
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
          </View>

          <View style={{ flexDirection: 'column', marginTop: 20 }}>
            <Text style={{ fontSize: 20, color: 'darkblue', fontWeight: 'bold' }}>Order ID</Text>
            <TextInput
              style={{
                height: 40,
                fontSize: (Platform.OS === 'ios') ? 20 : 18,
                alignSelf: 'stretch',
                backgroundColor: 'white',
                borderRadius: 7,
                color: 'darkblue',
                paddingLeft: 7,
                marginTop: 10,
              }}
              underlineColorAndroid='transparent'
              placeholder="Type Order ID here" />
          </View >
          <LinearGradient style={{ borderRadius: 5, alignSelf: 'stretch', marginTop: 40 }}
            colors={['#4c669f', '#3b5998', '#192f6a']} >
            <TouchableHighlight underlayColor='steelblue' onPress={this.searchOnPress}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <MaterialIcon name='search' color='white' size={20} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5 }} />
                <Text style={{ fontSize: 20, color: 'white', marginLeft: 5, marginTop: 5, marginBottom: 5 }}>Search</Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        </View>
      </View>
    );
  }
};

export default SearchOrders;
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
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
    this.state = { date: "2016-05-15" }
  }
  render() {
    return (
      <View>
        <Text>Search Orders</Text>
        <DatePicker
          style={{ width: 200 }}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2012-05-01"
          maxDate="2018-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => { this.setState({ date: date }) }}
        />
      </View>
    );
  }
};

export default SearchOrders;
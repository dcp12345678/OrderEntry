import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  Button,
  Alert
} from 'react-native';
import OrdersApi from '../api/OrdersApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';

const basketIcon = require('../images/basket.png');
const carIcon = require('../images/car.png');
const truckIcon = require('../images/truck.png');
const motorcycleIcon = require('../images/motorcycle.png');

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: 'lightgoldenrodyellow',
    borderWidth: 1,
    borderColor: 'goldenrod',
    //height: 40,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  title: {
    backgroundColor: '#0f1b29',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    paddingTop: 40,
    textAlign: 'center',
  },
  row: {
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 20,
    paddingBottom: 20
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#feb401',
    borderColor: '#feaf12',
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  icon: {
    tintColor: '#fff',
    height: 25,
    width: 25
  },
  carIcon: {
    tintColor: 'green',
    height: 25,
    width: 25
  },
  truckIcon: {
    tintColor: 'blue',
    height: 25,
    width: 25
  },
  motorcycleIcon: {
    tintColor: 'red',
    height: 25,
    width: 25
  },
  info: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25
  },
  items: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  detail: {
    color: 'purple',
    fontSize: 18,
  },
  total: {
    width: 80,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
  },
  price: {
    color: '#1cad61',
    fontSize: 25,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: 'purple'
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  }
});

const ordersApi = new OrdersApi();

class OrderDetails extends Component {

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    ordersApi.getOrderLineItems(this.props.orderId).then((res) => {
      const orderLineItems = JSON.parse(res.text);

      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({
        dataSource: ds.cloneWithRows(orderLineItems),
      });

    }).catch((err) => {
      Alert.alert(`error getting order details, ${JSON.stringify(err)}`);
    });
  }

  constructor(props) {
    super(props);
    this.state = { dataSource: undefined };
  }

  renderRow = (record) => {
    debugger;
    let iconImage;
    switch (record.productTypeName) {
      case 'Car':
        iconImage = <Image source={carIcon} style={styles.carIcon} />
        break;
      case 'Truck':
        iconImage = <Image source={truckIcon} style={styles.truckIcon} />
        break;
      case 'Motorcycle':
        iconImage = <Image source={motorcycleIcon} style={styles.motorcycleIcon} />
        break;
    }
    return (
      <View>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            {iconImage}
          </View>
          <View style={styles.info}>
            <Text style={styles.detail}>Line Item Id: {record.id}</Text>
            <Text style={styles.detail}>Type: {record.productTypeName}</Text>
            <Text style={styles.detail}>Name: {record.productName}</Text>
            <Text style={styles.detail}>Color: {record.colorName}</Text>
          </View>
        </View>
      </View>
    );
  }

  goBackOnPress = () => {
    this.props.navigator.pop();
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.backButton}>
          <Button
            onPress={this.goBackOnPress}
            title="Back"
            color='#841584'
          />
        </View>
        <View style={styles.mainHeader}>
          <Text style={styles.headerText}>Order Details Page for order {this.props.orderId}</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

export default OrderDetails;



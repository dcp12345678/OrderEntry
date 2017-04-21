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
} from 'react-native';
import data from '../data/sales.json';
import OrdersApi from '../api/OrdersApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';

const basketIcon = require('../images/basket.png');
const ordersApi = new OrdersApi();

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    backgroundColor: '#0f1b29',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
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
    height: 22,
    width: 22
  },
  info: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25
  },
  items: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  orderDetail: {
    color: '#ccc',
    fontSize: 18,
  },
  total: {
    width: 80,
  },
  date: {
    fontSize: 15,
    marginBottom: 5,
  },
  price: {
    color: '#1cad61',
    fontSize: 25,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 150
  }
});

class RecentOrders extends Component {

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    // add delay to work around react-native bug when displaying modal:
    // https://github.com/facebook/react-native/issues/10845
    let self = this;
    setTimeout(() => {
      co(function* () {
        let res = yield ordersApi.getOrdersForUser(self.props.userId);
        let orders = JSON.parse(res.text);

        for (let i = 0; i < orders.length; ++i) {
          const o = orders[i];
          let res = yield ordersApi.getOrderLineItems(o.id);
          const orderLineItems = JSON.parse(res.text);
          o.products = {};
          _.map(orderLineItems, (i) => {
            if (_.isUndefined(o.products[i.productTypeName])) {
              o.products[i.productTypeName] = 1;
            } else {
              ++o.products[i.productTypeName];
            }
          });

        }

        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
        self.setState({
          dataSource: ds.cloneWithRows(orders),
        });
      }).catch((err) => {
        debugger;
        Alert.alert(`error getting orders, ${JSON.stringify(err)}`);
      });
    }, 1000);
  }

  onPressButton = (orderId) => {
    debugger;
    //Alert.alert(`click, orderId = ${orderId}`);
    this.props.navigator.push({
      name: 'OrderDetails',
      passProps: {
        orderId: orderId,
        userId: this.props.userId,
      }
    });
  }

  constructor(props) {
    super(props);
    this.state = { dataSource: undefined };
    //Alert.alert('inside RecentOrders constructor, props.userId = ' + props.userId);
    // let ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2
    // });
    // this.state = {
    //   dataSource: ds.cloneWithRows(data),
    //   orders: undefined,
    // };
  }

  renderRow = (record) => {
    let numProducts = 0;
    let products = '';
    let newLine = '';
    for (let key in record.products) {
      products += newLine + key + ': ' + record.products[key];
      ++numProducts;
      newLine = '\n';
    };

    return (
      <TouchableHighlight onPress={() => { this.onPressButton(record.id); }}>
        <View>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Image source={basketIcon} style={styles.icon} />
            </View>
            <View style={styles.info}>
              <Text style={styles.items}>{record.lineItems.length} Items</Text>
              <Text style={styles.orderDetail}>Order Id: {record.id}</Text>
              <Text style={styles.orderDetail}>No. items purchased: {numProducts}</Text>
              <Text style={styles.orderDetail}>{products}</Text>
            </View>
            <View style={styles.total}>
              <Text style={styles.date}>Last Update:{'\n'}{Helper.formatDate(record.updateDate)}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight >
    );
  }

  newOrderOnPress = () => {
    this.props.navigator.push({
      name: 'EditOrder',
      passProps: {
        userId: this.props.userId,
        orderId: -1
      }
    });
  }

  searchOrdersOnPress = () => {
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return <View></View>;
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              onPress={this.newOrderOnPress}
              title="New Order"
              color='#841584'
            />
          </View>
          <View style={styles.button}>
            <Button
              onPress={this.searchOrdersOnPress}
              title="Search Orders"
              color='#841584'
            />
          </View>
        </View>
        <Text style={styles.title}>Recent Orders</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
};

export default RecentOrders;
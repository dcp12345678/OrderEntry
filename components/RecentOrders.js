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
} from 'react-native';
import data from '../data/sales.json';
import OrdersApi from '../api/OrdersApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const basketIcon = require('../images/basket.png');
const ordersApi = new OrdersApi();
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  row: {
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5
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
    color: 'darkblue',
    fontSize: 18,
  },
  total: {
    width: 80,
  },
  date: {
    fontSize: 15,
    marginBottom: 5,
    color: 'darkblue'
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
    backgroundColor: 'steelblue'
  },
});

class RecentOrders extends Component {

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    let self = this;
    co(function* () {
      let res = yield ordersApi.getOrdersForUser(self.props.userId);
      let orders = JSON.parse(res.text);

      for (let i = 0; i < orders.length; ++i) {
        const o = orders[i];
        o.isExpanded = false;  // indicates whether order is expanded to include its details
        let res = yield ordersApi.getOrderLineItems(o.id);
        const orderLineItems = JSON.parse(res.text);
        o.lineItems = orderLineItems;
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
        orders
      });
    }).catch((err) => {
      debugger;
      Alert.alert(`error getting orders, ${JSON.stringify(err)}`);
    });
  }

  orderOnPress = (orderId) => {
    // update the data source, flipping the expanded state for the order matching passed in orderId

    let newOrders = _.cloneDeep(this.state.orders);

    _.forEach(newOrders, (order) => {
      if (order.id === orderId) {
        order.isExpanded = !order.isExpanded;
      }
    });

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      dataSource: ds.cloneWithRows(newOrders),
      orders: newOrders
    });
  }

  viewOrderDetailsOnPress = (orderId) => {
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
    Alert.alert('need to implement');
  }

  renderRow = (record) => {
    let expandedContent;

    // if isExpanded is true, we need to show additional information for this order
    if (record.isExpanded) {
      let products = [];
      let content = [];
      content.push(
        <View key="view_expandedHeader" style={{ flexDirection: 'row' }}>
          <Text key="expandedHeader" style={[styles.orderDetail, { fontWeight: '600' }]}>Order Items:</Text>

          <View style={{ marginLeft: 25 }}>
            <TouchableHighlight
              style={{
                borderRadius: 20,
              }}
              underlayColor='#578dba' onPress={() => { this.viewOrderDetailsOnPress(record.id); }}>
              <FontAwesomeIcon name='edit' color='white' size={25}
                style={
                  {
                    alignSelf: 'center',
                  }
                } />
            </TouchableHighlight>
          </View>

        </View >
      );
      for (let key in record.products) {
        products.push(
          <View key={key} style={{ flex: 1, flexDirection: 'row' }}>
            <View style={
              {
                flex: .5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: 'steelblue',
                margin: 1,
              }}
              key={key}>
              <Text key={key + '_text'} style={{ flex: .6, color: 'white', borderWidth: 1, borderColor: 'white', padding: 2 }}>{key}:</Text>
              <Text key={key + '_cnt'} style={{ flex: .4, color: 'white', borderWidth: 1, borderColor: 'white', padding: 2 }}>{record.products[key]}</Text>
            </View>
            <View style={{ flex: .5 }}>
            </View>
          </View>
        );
      };
      content.push(<View key="expandedDetail" style={{ marginBottom: 8, }}>{products}</View>);
      expandedContent = (<View>{content}</View>);
    }

    return (
      <TouchableHighlight underlayColor='#578dba' onPress={() => { this.orderOnPress(record.id); }}>
        <View>
          <View style={styles.row}>
            <View style={[styles.info, { backgroundColor: '#5282aa', borderRadius: 9, }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.orderDetail}>Order: {record.id}</Text>
                <Text style={{ marginLeft: 5, color: 'white', alignSelf: 'center'}}>({record.lineItems.length} items)</Text>
              </View>
              <Text style={styles.date}>Last Update: {Helper.formatDate(record.updateDate)}</Text>
              {expandedContent}
            </View>
          </View>
        </View>
      </TouchableHighlight >
    );
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return <View></View>;
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', backgroundColor: 'steelblue',
          marginBottom: 5,
        }}>
          <TouchableHighlight
            style={{
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
              borderRadius: 20,
            }}
            underlayColor='#578dba' onPress={this.newOrderOnPress}>
            <MaterialIcon name='add-circle-outline' color='white' size={25} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
          </TouchableHighlight>
          <Text style={[
            {
              color: 'darkblue',
              fontWeight: 'bold',
              marginBottom: 0,
              padding: 0,
              fontSize: 20,
              alignSelf: 'center',
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
            }]}>
            Recent Orders
            </Text>
          <TouchableHighlight
            style={{
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
              borderRadius: 20,
            }}
            underlayColor='#578dba' onPress={this.searchOrdersOnPress}>
            <View style={{ marginRight: 8, flexDirection: 'row', justifyContent: 'center' }}>
              <MaterialIcon name='search' color='white' size={25} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
            </View>
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
};

export default RecentOrders;
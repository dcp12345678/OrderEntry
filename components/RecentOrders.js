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

  static navigationOptions = ({ navigation }) => ({
    title: 'Recent Orders',
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: Platform.OS === 'ios' ? 18 : 20, },
    headerLeft: ( <View></View>
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          style={{
            borderRadius: 20,
          }}
          underlayColor='#578dba' onPress={() => { RecentOrders.newOrderOnPress(navigation); }}>
          <MaterialIcon name='add-circle-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            borderRadius: 20,
            marginLeft: 5,
          }}
          underlayColor='#578dba' onPress={() => { RecentOrders.searchOrdersOnPress(); }}>
          <View style={{ marginRight: 8, flexDirection: 'row', justifyContent: 'center' }}>
            <MaterialIcon name='search' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
          </View>
        </TouchableHighlight>
      </View>
    ),
  });

  static newOrderOnPress = (navigation) => {
    // take user to EditOrderLineItem screen, which will allow them to add the first line item to the new order
    navigation.navigate('EditOrderLineItem',
      {
        userId: navigation.state.params.userId,
        orderId: -1,
        orderLineItemId: -1,
      });
  }

  static searchOrdersOnPress = () => {
    Alert.alert('inside searchOrdersOnPress');
  }

  componentDidMount() {
    this.getOrders();
  }

  getOrders = () => {
    let self = this;
    co(function* () {
      let res = yield ordersApi.getOrdersForUser(self.props.navigation.state.params.userId);
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
      Alert.alert('error getting orders!', `${JSON.stringify(err) || '-- could not get orders'}`);
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

  editOrderOnPress = (orderId) => {
    debugger;
    this.props.navigation.navigate('EditOrder',
      {
        orderId: orderId,
        userId: this.props.navigation.state.params.userId,
      });
  }

  constructor(props) {
    super(props);
    this.state = { dataSource: undefined };
  }

  renderRow = (record) => {
    let expandedContent;

    // if isExpanded is true, we need to show additional information for this order
    if (record.isExpanded) {
      let products = [];
      for (let key in record.products) {
        products.push(
          <View key={key} style={{ flex: 1, flexDirection: 'row' }}>
            <View key={key} style={
              {
                flex: 1,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: 'steelblue',
                margin: 1,
              }
            }>
              <Text key={key + '_text'} style={{ flex: .8, fontSize: 15, color: 'white', borderWidth: 1, borderColor: 'white', padding: 2 }}>{key}:</Text>
              <Text key={key + '_cnt'} style={{ flex: .2, fontSize: 15, color: 'white', borderWidth: 1, borderColor: 'white', padding: 2 }}>{record.products[key]}</Text>
            </View>
          </View>
        );
      };

      let content = [];
      content.push(
        <View key="view_expandedHeader" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text key="expandedHeader" style={[styles.orderDetail, { fontWeight: '600' }]}>Items:</Text>

          <View key="expandedDetail" style={{ flex: 1, marginLeft: 10, marginRight: 10, marginBottom: 5 }}>{products}</View>

          <View>
            <TouchableHighlight
              style={{
                borderRadius: 20,
              }}
              underlayColor='#578dba' onPress={() => { this.editOrderOnPress(record.id); }}>
              <FontAwesomeIcon name='edit' color='white' size={30}
                style={
                  {
                    alignSelf: 'center',
                    marginLeft: 12,
                  }
                } />
            </TouchableHighlight>
          </View>

        </View >
      );
      expandedContent = (<View>{content}</View>);
    }

    return (
      <TouchableHighlight underlayColor='#578dba' onPress={() => { this.orderOnPress(record.id); }}>
        <View>
          <View style={styles.row}>
            <View style={[styles.info, { backgroundColor: '#5282aa', borderRadius: 9, }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.orderDetail, { fontWeight: 'bold', fontSize: 20 }]}>Order: {record.id}</Text>
                <Text style={{ marginLeft: 5, color: 'white', alignSelf: 'center' }}>({record.lineItems.length} items)</Text>
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
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'lightsteelblue' }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={{ marginTop: 10, }}
        />
      </View>
    );
  }
};

export default RecentOrders;
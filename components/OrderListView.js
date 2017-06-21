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
import Promise from 'bluebird';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';

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
  info: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25
  },
  orderDetail: {
    color: 'darkblue',
    fontSize: 18,
  },
  date: {
    fontSize: 15,
    marginBottom: 5,
    color: 'darkblue'
  },
});

class OrderListView extends Component {

  constructor(props) {
    super(props);

    let orders = _.cloneDeep(props.orders);

    for (let i = 0; i < orders.length; ++i) {
      const o = orders[i];

      // indicates whether order is expanded to include its details
      o.isExpanded = !_.isUndefined(props.expandedOrderId) && props.expandedOrderId === orders[i].id;

      // compute count of each type of product
      o.products = {};
      _.map(o.lineItems, (i) => {
        if (_.isUndefined(o.products[i.productTypeName])) {
          o.products[i.productTypeName] = 1;
        } else {
          ++o.products[i.productTypeName];
        }
      });

    }

    this.state = { dataSource: undefined, orders };
  }

  componentDidMount() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.setState({
      dataSource: ds.cloneWithRows(this.state.orders)
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
    this.props.navigation.navigate('EditOrder',
      {
        orderId: orderId,
        userId: this.props.userId,
        prevScreen: this.props.prevScreen,
      });
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
      return (<View><Text>Loading...</Text></View>);
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

export default OrderListView;
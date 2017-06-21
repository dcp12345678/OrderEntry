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
import OrderListView from './OrderListView';

const basketIcon = require('../images/basket.png');
const ordersApi = new OrdersApi();
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
});

class RecentOrders extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Recent Orders',
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: Platform.OS === 'ios' ? 18 : 20, },
    headerLeft: (<View></View>
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          style={{
            borderRadius: 20,
          }}
          underlayColor='#578dba' onPress={() => { navigation.state.params.newOrderOnPress(); }}>
          <MaterialIcon name='add-circle-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            borderRadius: 20,
            marginLeft: 5,
          }}
          underlayColor='#578dba' onPress={() => { navigation.state.params.searchOrdersOnPress(); }}>
          <View style={{ marginRight: 8, flexDirection: 'row', justifyContent: 'center' }}>
            <MaterialIcon name='search' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
          </View>
        </TouchableHighlight>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      dataSource: undefined,
      showSpinner: false,
    };
  }

  newOrderOnPress = () => {
    // take user to EditOrderLineItem screen, which will allow them to add the first line item to the new order
    this.props.navigation.navigate('EditOrderLineItem',
      {
        userId: this.props.navigation.state.params.userId,
        orderId: -1,
        orderLineItemId: -1,
      });
  }

  searchOrdersOnPress = () => {
    // take user to SearchOrders screen, which will allow them to search for orders
    this.props.navigation.navigate('SearchOrders',
      {
        userId: this.props.navigation.state.params.userId,
      });
  }

  componentDidMount() {
    // wire up the navigation parameters
    this.props.navigation.setParams(
      {
        newOrderOnPress: this.newOrderOnPress,
        searchOrdersOnPress: this.searchOrdersOnPress,
      }
    );
    this.getOrders();
  }

  getOrders = async () => {
    try {
      this.setState({ showSpinner: true });
      let res = await ordersApi.getOrdersForUser(this.props.navigation.state.params.userId);
      let orders = JSON.parse(res.text);

      for (let i = 0; i < orders.length; ++i) {
        const o = orders[i];
        o.isExpanded = false;  // indicates whether order is expanded to include its details
        let res = await ordersApi.getOrderLineItems(o.id);
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
      this.setState({
        dataSource: ds.cloneWithRows(orders),
        orders
      });
      this.setState({ showSpinner: false });
    } catch (err) {
      this.setState({ showSpinner: false });
      Alert.alert('error getting orders!', `${JSON.stringify(err) || '-- could not get orders'}`);
    }
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return <View><Spinner visible={this.state.showSpinner} textContent={"Loading Orders..."} textStyle={{ color: '#FFF' }} /></View>
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'lightsteelblue' }}>
        <OrderListView
          orders={this.state.orders}
          userId={this.props.navigation.state.params.userId}
          expandedOrderId={this.props.navigation.state.params.expandedOrderId}
          navigation={this.props.navigation}
          prevScreen="RecentOrders"
        >
        </OrderListView>
      </View>
    );
  }
};

export default RecentOrders;
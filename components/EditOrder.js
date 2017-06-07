import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  Button,
  Alert,
  Platform,
} from 'react-native';
import OrdersApi from '../api/OrdersApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Config from '../config';

const styles = StyleSheet.create({
  row: {
    borderColor: '#f1f1f1',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 8
  },
  icon: {
    height: 70,
    width: 100,
    borderColor: 'steelblue',
    borderWidth: 3,
  },
});

const ordersApi = new OrdersApi();

class EditOrder extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `Edit Order (${navigation.state.params.orderId})`,
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: Platform.OS === 'ios' ? 18 : 20 },
    headerLeft: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          style={{
            borderRadius: 20,
          }}
          underlayColor='#578dba' onPress={() => { navigation.goBack(); }}>
          <FontAwesomeIcon name='arrow-circle-left' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
        </TouchableHighlight>
      </View>
    ),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          style={{
            borderRadius: 20,
          }}
          underlayColor='#578dba' onPress={() => { navigation.state.params.addLineItemOnPress(); }}>
          <MaterialIcon name='add-circle-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            borderRadius: 20,
          }}
          underlayColor='#578dba' onPress={() => { navigation.state.params.goHome(); }}>
          <MaterialIcon name='home' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
        </TouchableHighlight>
        { /* only show the trashcan icon (used to delete line items) if at least one item has been selected */}
        {navigation.state.params.isItemSelected &&
          <TouchableHighlight
            style={{
              borderRadius: 20,
            }}
            underlayColor='#578dba' onPress={() => { navigation.state.params.deleteLineItemsOnPress(); }}>
            <IoniconsIcon name='ios-trash-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 10, marginTop: 5, marginBottom: 0, marginRight: 5 }} />
          </TouchableHighlight>
        }
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.state = { dataSource: undefined };
  }

  componentDidMount() {
    // wire up the navigation parameters
    this.props.navigation.setParams(
      {
        isItemSelected: false,
        deleteLineItemsOnPress: this.deleteLineItemsOnPress,
        addLineItemOnPress: this.addLineItemOnPress,
        goHome: this.goHome,
      }
    );
    this.getOrderDetails();
  }

  goHome = () => {
    this.props.navigation.navigate('RecentOrders',
      {
        userId: this.props.navigation.state.params.userId,
      });
  }

  addLineItemOnPress = () => {
    this.props.navigation.navigate('EditOrderLineItem',
      {
        userId: this.props.navigation.state.params.userId,
        orderId: this.props.navigation.state.params.orderId,
        orderLineItemId: -1,
      });
  }

  deleteLineItemsOnPress = () => {
    const self = this;
    co(function* () {
      // fetch the order from persistence to make sure we have latest version
      let res = yield ordersApi.getOrder(self.props.navigation.state.params.orderId);
      const order = JSON.parse(res.text);

      // create a newLineItems array which will contain all the line items which the user did *not* select
      // to delete (e.g. it will contain the line items we are keeping)
      let newLineItems = [];
      _.forEach(order.lineItems, (lineItem) => {
        let foundRec = _.find(self.state.orderLineItems, (i) => {
          // if isSelected is true, it means this is a line item which is to be deleted,
          // so we *don't* want to include it in newLineItems
          return i.id === lineItem.id && !i.isSelected;
        });
        if (!_.isUndefined(foundRec)) {
          newLineItems.push(lineItem);
        }
      });

      // apply line item deletions to persistence then update the state
      order.lineItems = newLineItems;
      yield ordersApi.saveOrder(order);
      self.updateLineItemState(self, order.lineItems);
    });
  }

  getOrderDetails = () => {
    ordersApi.getOrderLineItems(this.props.navigation.state.params.orderId).then((res) => {
      const orderLineItems = JSON.parse(res.text);
      _.forEach(orderLineItems, (i) => {
        i.isSelected = false;
      });

      this.updateLineItemState(this, orderLineItems);

    }).catch((err) => {
      Alert.alert('error getting order details!', `${JSON.stringify(err) || '-- could not get order details'}`);
    });
  }

  updateLineItemState = (self, newOrderLineItems) => {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    self.setState({
      dataSource: ds.cloneWithRows(newOrderLineItems),
      orderLineItems: newOrderLineItems
    });

    let numSelectedLineItems =
      _.filter(newOrderLineItems, (i) => { if (i.isSelected) return i; }).length;
    self.props.navigation.setParams({ isItemSelected: numSelectedLineItems > 0 });
  }

  toggleSelectedItem = (id) => {
    // update the data source, flipping the selected state for the line item matching passed in id
    let newOrderLineItems = _.cloneDeep(this.state.orderLineItems);

    _.forEach(newOrderLineItems, (lineItem) => {
      if (lineItem.id === id) {
        lineItem.isSelected = !lineItem.isSelected;
      }
    });

    this.updateLineItemState(this, newOrderLineItems);
  }

  editItem = (id) => {
    this.props.navigation.navigate('EditOrderLineItem',
      {
        userId: this.props.navigation.state.params.userId,
        orderId: this.props.navigation.state.params.orderId,
        orderLineItemId: id,
      });
  }

  renderRow = (record) => {
    // set up image URL for product (e.g. product image could be a picture of a Ford F150 truck, for example)
    let src = Config.restApi.baseUrl + record.productImageUri;
    let iconImage = <Image resizeMode='contain' source={{ uri: src }} style={styles.icon} />;
    return (
      <View style={styles.row}>
        <TouchableHighlight
          underlayColor='transparent'
          style={{ alignSelf: 'center' }}
          onPress={() => { this.toggleSelectedItem(record.id); }}
        >
          <FontAwesomeIcon name={record.isSelected ? 'circle' : 'circle-o'} color='steelblue' size={20}
            style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 7 }} />
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor='transparent'
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={() => { this.editItem(record.id); }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'white' }}>
              {iconImage}
            </View>
            <View style={{
              flex: 1,
              paddingLeft: 8,
              paddingRight: 8,
            }}>
              <Text style={{ fontSize: 23, color: 'darkblue', fontWeight: 'bold' }}>{record.productName}</Text>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ flex: .5, color: 'darkblue', fontSize: 13 }}>Color: {record.colorName}</Text>
                  <Text style={{ flex: .5, color: 'darkblue', fontSize: 13 }}>Type: {record.productTypeName}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ color: 'darkblue' }}>Line Item Id: {record.id}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  goBackOnPress = () => {
    this.props.navigator.pop();
  }

  deleteOnPress = () => {
    const self = this;
    co(function* () {
      // fetch the order from persistence to make sure we have latest version
      let res = yield ordersApi.getOrder(self.props.orderId);
      const order = JSON.parse(res.text);

      // create a newLineItems array which will contain all the line items which the user did *not* select
      // to delete (e.g. it will contain the line items we are keeping)
      let newLineItems = [];
      _.forEach(order.lineItems, (lineItem) => {
        let foundRec = _.find(self.state.orderLineItems, (i) => {
          // if isSelected is true, it means this is a line item which is to be deleted,
          // so we *don't* want to include it in newLineItems
          return i.id === lineItem.id && !i.isSelected;
        });
        if (!_.isUndefined(foundRec)) {
          newLineItems.push(lineItem);
        }
      });

      // apply line item deletions to persistence
      order.lineItems = newLineItems;
      yield ordersApi.saveOrder(order);
      self.updateLineItemState(self, order.lineItems);
    });
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return <View><Text style={{ fontSize: 18 }}>Loading...</Text></View>;
    }

    let numSelectedItems =
      _.filter(this.state.orderLineItems, (i) => { if (i.isSelected) return i; }).length;

    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'lightsteelblue' }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

export default EditOrder;



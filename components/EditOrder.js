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
    marginTop: 10,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    color: 'purple'
  },
});

const ordersApi = new OrdersApi();

class EditOrder extends Component {

  constructor(props) {
    super(props);
    let order = {};
    if (this.props.orderId === -1) {
      order.id = -1;
      order.lineItems = [];
    } else {
      // todo: fetch order from web service
    }
    this.state = { dataSource: undefined, order };
  }

  addItem = () => {
    this.props.navigator.push({
      name: 'EditOrderLineItem',
      passProps: {
        userId: this.props.userId,
        orderId: this.state.order.id,
        orderLineItemId: -1,
        addLineItemToOrder: (lineItem) => { this.state.order.lineItems.push(lineItem); },
      }
    });
  }

  deleteItems = () => {
  }

  save = () => {
  }

  renderRow = () => {
  }

  render() {
    let header = this.state.order.id === -1 ? "New Order" : ("Edit Order " + this.state.order.id);
    let listView = this.state.order.id === -1 ? (<View></View>) :
      (<ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
      );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.mainHeader}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: 90 }}>
            <Button
              onPress={this.addItem}
              title="Add Item"
              color='#841584'
            />
          </View>
          <View style={{ width: 120 }}>
            <Button
              onPress={this.deleteItems}
              title="Delete Items"
              color='#841584'
            />
          </View>
          <View style={{ width: 90 }}>
            <Button
              onPress={this.save}
              title="Save"
              color='#841584'
            />
          </View>
        </View>
        {listView}
      </View>
    );
  }
}

export default EditOrder;



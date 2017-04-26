import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  TouchableHighlight,
  Button,
  Picker,
  Alert,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PickerButton from './PickerButton';
import OrdersApi from '../api/OrdersApi';
import LookupApi from '../api/LookupApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';

const basketIcon = require('../images/basket.png');
const carIcon = require('../images/car.png');
const truckIcon = require('../images/truck.png');
const motorcycleIcon = require('../images/motorcycle.png');
const winWidth = Dimensions.get('window').width;

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
  headerText: {
    fontSize: 18,
    color: 'purple'
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});

const ordersApi = new OrdersApi();
const lookupApi = new LookupApi();

class EditOrderLineItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      disableSave: true,
      isNew: this.props.orderLineItemId === -1
    };

    const self = this;
    co(function* init() {
      let res = yield lookupApi.getColors();
      const colors = JSON.parse(res.text);
      res = yield lookupApi.getProductTypes();
      const productTypes = JSON.parse(res.text);
      self.setState({ colors, productTypes });

      let lineItem = {};
      debugger;
      if (!self.state.isNew) {
        // editing an existing line item
        // const x = yield ordersApi.getOrder(self.props.orderId);
        // order = JSON.parse(x.text);

        // // get available products for each line item on the order
        // const promiseResults =
        //   yield _.map(order.lineItems, (lineItem) => lookupApi.getProductsForProductType(lineItem.productTypeId));
        // _.forEach(order.lineItems, (lineItem, index) => {
        //   lineItem.availProducts = JSON.parse(promiseResults[index].text);
        // });
      } else {
        // create a new order line item
        lineItem = {
          id: -1,
          productTypeId: -1,
          productId: -1,
          colorId: -1,
        }
      }
      self.setState({
        lineItem,
        isLoaded: true,
      });
    }).catch((err) => {
      Alert.alert('error initializing form', `${JSON.stringify(err) || '-- error initializing form'}`);
    });

  }

  disableSave = () => {
    return true;
  }

  save = () => {
  }

  cancel = () => {
  }

  pickColor = (color) => {
    Alert.alert(`pickColor ${JSON.stringify(color)}`);
    let lineItem = this.state.lineItem;
    lineItem.colorId = color.id;
    this.setState({ lineItem });
  }

  pickProductType = (productType) => {
    Alert.alert(`pickProductType ${JSON.stringify(productType)}`);
    let lineItem = this.state.lineItem;
    lineItem.productTypeId = productType.id;
    this.setState({ lineItem });
  }

  render() {
    if (!this.state.isLoaded) {
      return (<View><Text>loading...</Text></View>);
    }

    //Alert.alert(`lineItem = ${JSON.stringify(this.state.lineItem)}`);

    let header = this.props.orderLineItemId === -1 ? "New Order Item" :
      ("Edit Order Item " + this.props.orderLineItemId);

    return (
      <View style={styles.mainContainer}>
        <View style={styles.mainHeader}>
          <Text style={styles.headerText}>{header}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.buttonContainer}>
            <View style={{ width: 90 }}>
              <Button
                disabled={this.state.disableSave}
                onPress={this.save}
                title="Save"
                color='#841584'
              />
            </View>
            <View style={{ width: 90, marginLeft: 10, }}>
              <Button
                onPress={this.cancel}
                title="Cancel"
                color='#841584'
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'purple', }}>Product Type</Text>
          <PickerButton
            data={this.state.productTypes}
            selectedItemId={this.state.lineItem.productTypeId}
            navigator={this.props.navigator}
            onPickedItem={this.pickProductType} />
        </View>
        <View>
          <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'purple', }}>Product Color</Text>
          <PickerButton
            data={this.state.colors}
            selectedItemId={this.state.lineItem.colorId}
            navigator={this.props.navigator}
            onPickedItem={this.pickColor} />
        </View>

      </View>
    );
  }
}

export default EditOrderLineItem;



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
  Platform,
} from 'react-native';
import PickerButton from './PickerButton';
import OrdersApi from '../api/OrdersApi';
import LookupApi from '../api/LookupApi';
import _ from 'lodash';
import Helper from '../helpers/Helper';
import co from 'co';
import Promise from 'bluebird';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: 'skyblue',
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
    backgroundColor: 'lightsteelblue',
    justifyContent: 'flex-start',
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
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerStyle: { backgroundColor: 'steelblue' },
    headerTitleStyle: { color: 'darkblue', fontSize: Platform.OS === 'ios' ? 18 : 20, },
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
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isNew: this.props.navigation.state.params.orderLineItemId === -1
    };

    const self = this;
    const navParams = this.props.navigation.state.params;
    co(function* init() {
      // get product types and colors and store them in state
      let res = yield lookupApi.getColors();
      const colors = JSON.parse(res.text);
      res = yield lookupApi.getProductTypes();
      const productTypes = JSON.parse(res.text);
      self.setState({ colors, productTypes, products: [] });

      let lineItem = {};
      if (!self.state.isNew) {
        // editing an existing line item, so fetch it from persistence
        const x = yield ordersApi.getOrderLineItem(navParams.orderId, navParams.orderLineItemId);
        lineItem = JSON.parse(x.text);

        // get the products for the line item's product type and store them in state
        res = yield lookupApi.getProductsForProductType(lineItem.productTypeId);
        const products = JSON.parse(res.text);
        self.setState({ products });
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

  componentDidMount() {
    debugger;
    const nav = this.props.navigation;

    // determine the title to use in the navigation header
    let title;
    if (nav.state.params.orderId === -1) {
      title = "New Order - Add Item";
    } else {
      title = nav.state.params.orderLineItemId === -1 ? `Add Order Item - Order ${nav.state.params.orderId}` :
        `Edit Order Item - Item ID: ${nav.state.params.orderLineItemId}`;
    }

    // wire up the navigation parameters
    nav.setParams(
      {
        title
      }
    );

  }

  save = () => {
    const self = this;
    const navigation = this.props.navigation;
    const lineItem = this.state.lineItem;
    co(function* () {
      let order = {};
      order.id = -1;
      order.userId = navigation.state.params.userId;
      order.lineItems = [];
      if (navigation.state.params.orderId !== -1) {
        // fetch existing order from persistence
        let res = yield ordersApi.getOrder(navigation.state.params.orderId);
        order = JSON.parse(res.text);
      }

      debugger;
      if (lineItem.id === -1) {
        // add new line item to order
        lineItem.id = order.lineItems.length == 0 ? 0 : _.maxBy(order.lineItems, 'id').id + 1;
        order.lineItems.push(lineItem);
      } else {
        // update existing line item in order
        let index = _.findIndex(order.lineItems, i => i.id === lineItem.id);
        order.lineItems[index] = lineItem;
      }

      let res = yield ordersApi.saveOrder(order);

      // if we are creating a new order, get the new order's ID
      if (navigation.state.params.orderId === -1) {
        let resObj = JSON.parse(res.text);
        order.id = resObj.orderId;
      }

      // go to edit order screen to show the details for the order
      navigation.navigate('EditOrder',
        {
          userId: navigation.state.params.userId,
          orderId: order.id,
        });

    }).catch((err) => {
      Alert.alert('error saving order', `${JSON.stringify(err) || '-- error saving order'}`);
    });

  }

  pickColor = (color) => {
    let lineItem = this.state.lineItem;
    lineItem.colorId = color.id;
    this.setState({ lineItem });
  }

  pickProductType = (productType) => {
    const self = this;
    co(function* handleChange() {
      const res = yield lookupApi.getProductsForProductType(productType.id);
      const products = JSON.parse(res.text);
      //Alert.alert(`products = ${JSON.stringify(products)}`);
      let lineItem = self.state.lineItem;
      lineItem.productTypeId = productType.id;
      lineItem.products = products;
      lineItem.productId = -1; // deselect any previously selected product
      lineItem.colorId = -1; // deselect any previously selected color
      self.setState({ lineItem, products });
    });
  }

  pickProduct = (product) => {
    let lineItem = this.state.lineItem;
    lineItem.productId = product.id;
    this.setState({ lineItem });
  }

  render() {
    if (!this.state.isLoaded) {
      return (<View><Text>loading...</Text></View>);
    }

    // determine if all line item values have been entered (we'll use this info to determine if save button should
    // be shown)
    const lineItem = this.state.lineItem;
    const canSave = !_.isUndefined(lineItem) &&
      !_.isUndefined(lineItem.productTypeId) && lineItem.productTypeId !== -1 &&
      !_.isUndefined(lineItem.productId) && lineItem.productId !== -1 &&
      !_.isUndefined(lineItem.colorId) && lineItem.colorId !== -1;

    return (
      <View style={styles.mainContainer}>
        <View>
          <View>
            <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 18, fontWeight: 'bold', color: 'darkblue', }}>Product Type</Text>
            <PickerButton
              data={this.state.productTypes}
              itemName="Product Type"
              selectedItemId={this.state.lineItem.productTypeId}
              navigation={this.props.navigation}
              onPickedItem={this.pickProductType} />
          </View>
          {/* only show product and color picker buttons if a product type has been selected */}
          {this.state.lineItem.productTypeId === -1 ? null :
            (
              <View>
                <View>
                  <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 18, fontWeight: 'bold', color: 'darkblue', }}>Product</Text>
                  <PickerButton
                    data={this.state.products}
                    itemName="Product"
                    selectedItemId={this.state.lineItem.productId}
                    navigation={this.props.navigation}
                    onPickedItem={this.pickProduct} />
                </View>
                <View>
                  <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 18, fontWeight: 'bold', color: 'darkblue', }}>Product Color</Text>
                  <PickerButton
                    data={this.state.colors}
                    itemName="Product Color"
                    selectedItemId={this.state.lineItem.colorId}
                    navigation={this.props.navigation}
                    onPickedItem={this.pickColor} />
                </View>
              </View>
            )
          }
        </View>
        {/* only show save button if all fields have been entered */}
        {canSave &&
          <LinearGradient style={{ borderRadius: 5, alignSelf: 'stretch', justifyContent: 'flex-end', marginLeft: 7, marginRight: 7, marginTop: 40 }}
            colors={['#4c669f', '#3b5998', '#192f6a']} >
            <TouchableHighlight underlayColor='steelblue' onPress={this.save}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <MaterialIcon name='add-shopping-cart' color='white' size={25} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5 }} />
                <Text style={{ fontSize: 20, color: 'white', marginLeft: 5, marginTop: 5, marginBottom: 5 }}>Save Item</Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        }
      </View>
    );
  }
}

export default EditOrderLineItem;



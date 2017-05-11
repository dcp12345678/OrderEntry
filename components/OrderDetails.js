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
    paddingTop: 8,
    paddingBottom: 8
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
    height: 70,
    width: 100,
    borderColor: 'steelblue',
    borderWidth: 3,
  },
  items: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  detail: {
    color: 'darkblue',
    fontSize: 15,
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
    color: 'darkblue',
    fontWeight: 'bold'
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
      _.forEach(orderLineItems, (i) => {
        i.isSelected = false;
      });

      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      this.setState({
        dataSource: ds.cloneWithRows(orderLineItems),
        orderLineItems
      });

    }).catch((err) => {
      Alert.alert(`error getting order details, ${JSON.stringify(err)}`);
    });
  }

  toggleSelectedItem = (id) => {
    // update the data source, flipping the selected state for the line item matching passed in id
    let newOrderLineItems = _.cloneDeep(this.state.orderLineItems);

    _.forEach(newOrderLineItems, (lineItem) => {
      if (lineItem.id === id) {
        lineItem.isSelected = !lineItem.isSelected;
      }
    });

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      dataSource: ds.cloneWithRows(newOrderLineItems),
      orderLineItems: newOrderLineItems
    });

  }

  constructor(props) {
    super(props);
    this.state = { dataSource: undefined };
  }

  renderRow = (record) => {
    let numSelectedItems =
      _.filter(this.state.orderLineItems, (i) => { if (i.isSelected) return i; }).length;

    // If no items are selected, then we don't show the "selected icon" in the first row, but
    // if at least one item is selected, we will show the icon for each row.  The icon will be an empty
    // circle if the item is not selected, or a solid circle if it is selected.
    let firstColumn;
    if (numSelectedItems === 0) {
      firstColumn = <View></View>;
    } else {
      firstColumn = (
        <FontAwesomeIcon name={record.isSelected ? 'circle' : 'circle-o'} color='steelblue' size={20}
          style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 7 }} />
      );
    }
    // set up image URL for product (e.g. product image could be a picture of a Ford F150 truck, for example)
    let src = Config.restApi.baseUrl + record.productImageUri;
    let iconImage = <Image resizeMode='contain' source={{ uri: src }} style={styles.icon} />;
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => { this.toggleSelectedItem(record.id); }}
      >
        <View style={styles.row}>
          {firstColumn}
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
    );
  }

  goBackOnPress = () => {
    this.props.navigator.pop();
  }

  addLineItem = () => {

  }

  deleteOnPress = () => {
    Alert.alert('delete clicked!');
  }

  render() {
    if (_.isUndefined(this.state.dataSource)) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    let numSelectedItems =
      _.filter(this.state.orderLineItems, (i) => { if (i.isSelected) return i; }).length;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', backgroundColor: 'steelblue',
          marginBottom: 5,
        }}>
          <View
            style={{
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
              flexDirection: 'row'
            }}
          >
            <TouchableHighlight
              style={{
                borderRadius: 20,
              }}
              underlayColor='#578dba' onPress={this.goBackOnPress}>
              <FontAwesomeIcon name='arrow-circle-left' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5 }} />
            </TouchableHighlight>
            { /* only show the trashcan icon (used to delete items) if at least one item has been selected */}
            {numSelectedItems > 0 &&
              <TouchableHighlight
                style={{
                  borderRadius: 20,
                }}
                underlayColor='#578dba' onPress={this.deleteOnPress}>
                <IoniconsIcon name='ios-trash-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 10, marginTop: 5, marginBottom: 0, marginRight: 5 }} />
              </TouchableHighlight>
            }
          </View>
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
            Order Details ({this.props.orderId})
          </Text>
          <View
            style={{
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
              flexDirection: 'row'
            }}
          >
            <TouchableHighlight
              style={{
                borderRadius: 20,
              }}
              underlayColor='#578dba' onPress={this.addLineItem}>
              <View style={{ marginRight: 8, flexDirection: 'row', justifyContent: 'center' }}>
                <MaterialIcon name='add-circle-outline' color='white' size={30} style={{ alignSelf: 'center', marginLeft: 5, marginTop: 5, marginBottom: 5 }} />
              </View>
            </TouchableHighlight>
          </View>
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



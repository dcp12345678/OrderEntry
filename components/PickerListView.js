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


class PickerListView extends Component {

  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.navigation.state.params.data)
    };
  }

  pickItem = (item) => {
    this.props.navigation.state.params.onPickedItem(item);
    this.props.navigation.goBack();
  }

  cancel = () => {
    this.props.navigation.goBack();
  }

  renderRow = (item) => {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableHighlight onPress={() => this.pickItem(item)} style={{ marginTop: 10 }}>
          <Text style={{ margin: 8, fontSize: 25, color: 'purple' }}>{item.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'lightsteelblue',}}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch', backgroundColor: 'skyblue', borderWidth: 1,
          borderColor: 'purple',
        }}>
          <Text>
          </Text>
          <Text
            style={{
              fontSize: (Platform.OS === 'ios') ? 25 : 25,
              color: 'black',
              fontWeight: 'bold',
              marginTop: (Platform.OS === 'ios') ? 25 : 5,
              marginBottom: 5
            }}
          >{this.props.itemName}
          </Text>
          <TouchableOpacity onPress={this.cancel}>
            <View style={
              {
                backgroundColor: 'purple',
                borderRadius: 12,
                marginTop: (Platform.OS === 'ios') ? 25 : 5,
                marginRight: 5,
                marginBottom: 5
              }
            }>
              <Text style={{ fontSize: 18, color: 'white', margin: 5, }}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

export default PickerListView;

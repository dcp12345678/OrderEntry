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


class PickerListView extends Component {

  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.data)
    };
  }

  pickItem = (item) => {
    this.props.onPickedItem(item);
    this.props.navigator.pop();
  }

  renderRow = (item) => {
    debugger;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <TouchableHighlight onPress={() => this.pickItem(item)} style={{ marginTop: 10 }}>
          <Text style={{ margin: 8, fontSize: 25, fontWeight: 'bold', color: 'purple' }}>{item.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', alignSelf: 'stretch', backgroundColor: 'lightgoldenrodyellow' }}>
          <Text style={{ fontSize: 25, color: 'purple' }}>Choose an item</Text>
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

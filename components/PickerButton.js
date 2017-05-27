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
import _ from 'lodash';


class PickerButton extends Component {

  constructor(props) {
    super(props);
  }

  showPickerListView = () => {
    this.props.navigation.navigate('PickerListView',
      {
        ...this.props
      });
  }

  render() {
    debugger;
    let defaultItemText = 'Choose';

    if (this.props.selectedItemId !== -1) {
      debugger;
      let match = _.filter(this.props.data, (row) => row.id === this.props.selectedItemId);
      if (!_.isUndefined(match)) {
        defaultItemText = match[0].name;
      }
    }

    //Alert.alert(`defaultItemText = ${defaultItemText}`);

    return (
      <View>
        <TouchableOpacity onPress={this.showPickerListView} style={{ marginTop: 10 }}>
          <View style={
            {
              marginLeft: 10,
              marginRight: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'purple',
              borderRadius: 12,
            }
          }>
            <Text style={{ fontSize: 18, color: 'white', margin: 5, }}>{defaultItemText}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white', margin: 5, }}>></Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PickerButton;

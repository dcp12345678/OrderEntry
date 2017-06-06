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
import LinearGradient from 'react-native-linear-gradient';


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
    let defaultItemText = 'Choose';

    if (this.props.selectedItemId !== -1) {
      let match = _.filter(this.props.data, (row) => row.id === this.props.selectedItemId);
      if (!_.isUndefined(match)) {
        defaultItemText = match[0].name;
      }
    }

    //Alert.alert(`defaultItemText = ${defaultItemText}`);

    return (
      <View>
        <LinearGradient style={{ borderRadius: 10, alignSelf: 'stretch', marginLeft: 7, marginRight: 7, marginTop: 10 }}
          colors={['#4c669f', '#3b5998', '#192f6a']} >
          <TouchableOpacity onPress={this.showPickerListView} >
            <View style={
              {
                marginLeft: 10,
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }
            }>
              <Text style={{ fontSize: 18, color: 'white', backgroundColor: 'transparent', margin: 5, }}>{defaultItemText}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white', backgroundColor: 'transparent', margin: 5, }}>></Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

export default PickerButton;

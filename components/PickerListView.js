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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';


class PickerListView extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `Choose ${navigation.state.params.itemName}`,
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
          <Text style={{ margin: 8, fontSize: 25, color: 'darkblue' }}>{item.name}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'lightsteelblue',}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

export default PickerListView;

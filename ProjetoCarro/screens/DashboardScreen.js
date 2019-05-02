import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import firebase from 'firebase';

class DashboardScreen extends Component {
  state = {
    hasCameraPermission: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    Alert.alert(
      'Placa do Carrinho!',
      JSON.stringify(data)
    );
    Vibration.vibrate(10000);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          this.state.hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{ height: '90%', width: '100%' }}
            />
        }
        <Button title = "Sign out" onPress = {() => firebase.auth().signOut()} />
      </View>
    );
  }
}
export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});

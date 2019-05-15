import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Alert, Vibration, TouchableOpacity } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import {placa} from '../App.js';
import firebase from 'firebase'

class DashboardScreen extends Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _handleBarCodeRead = data => {
    if (data['data'] == placa){
      console.log("Achou")
      this.setState({ scanned: true });
      Alert.alert("Placa ["+ placa + "] encontrada!")
      Vibration.vibrate(3000)
    }
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View 
      accessible={true}
      accessibilityLabel="tela do codigo QR, procure pelo seu motorista"
      style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this._handleBarCodeRead}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={{height:'10%', width:'100%', alignItems: 'center', justifyContent: 'center'}}></View>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Botão de Sair"
            onPress = {() => firebase.auth().signOut()} >
              <Text style={{fontSize: 20, backgroundColor: 'rgba(47,163,218,.4)', borderRadius:4, paddingLeft:20, paddingRight:20, padding: 10, color: 'white'}}>
                Sign Out
              </Text>
          </TouchableOpacity>
          {scanned && (
            <TouchableOpacity 
              accessible={true}
              accessibilityLabel="Aperte Para Scanear de Novo"
              onPress={() => this.setState({ scanned: false })}>  
            </TouchableOpacity>
          )}        
      </View>
    );
  }
}
export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: -70,
    marginRight: 7,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});

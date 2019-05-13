
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Alert, Vibration } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';
import firebase from 'firebase';

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
    if (data['data'] == "obv - 9057"){
      console.log("Achou")
      this.setState({ scanned: true });
      Alert.alert("Carro Encontrado, se dirija para ele")
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

        {scanned && (
          <Button
          accessible={true}
          accessibilityLabel="Aperte Para Scanear de Novo"
          title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
        )}
        <Button
          accessible={true}
          accessibilityLabel="Botão de Sair"
          style={{alignItems: 'center', justifyContent: 'flex-end'}}
          title = "Sign out" onPress = {() => firebase.auth().signOut()} />
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

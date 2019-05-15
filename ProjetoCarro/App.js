import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import LoadingScreen from './screens/LoadingScreen';

import * as firebase from 'firebase';
import '@firebase/firestore';
import { firebaseConfig } from './config';
firebase.initializeApp(firebaseConfig);

const dbh = firebase.firestore();
/*
dbh.collection("placas").doc("placas_filhas").set({
  placa1: "CAP-1234",
  placa2: "MEC-3846",
  placa3: "LMB-0456"
})
*/
var placa;
var randomico = Math.floor(Math.random() * 3) + 1 ;
dbh.collection("placas").get().then((snapshot) => {
  snapshot.docs.forEach(doc => {
    if (randomico == 1) {
      placa = doc.data().placa1;
      console.log(placa)
    } if (randomico == 2) {
      placa = doc.data().placa2;
      console.log(placa)
    }if (randomico == 3) {
      placa = doc.data().placa3;
      console.log(placa)
    }
  })
})
export {placa};

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

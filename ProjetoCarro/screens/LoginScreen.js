import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

class LoginScreen extends Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              if (result.additionalUserInfo.isNewUser) {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(snapshot) {
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              var email = error.email;
              var credential = error.credential;
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };
  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId: '886102954423-m63rtia9dd3sc4rd4f2dnt14tr93l0ns.apps.googleusercontent.com',
        iosClientId: '886102954423-a9ihca33r72s6bur1j83ljnf712u2b8i.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  render() {
    return (
    <View 
    accessible={true}
    accessibilityLabel="Tela Inicial Do Aplicativo"
    style={{flex: 1}}>
    <ImageBackground 
      source={require('/home/bruno/ProjetoCarro/imagens/eyebM.jpeg')} 
      style={{flex: 1, width: '100%', height: '100%'}}>
      <View style={{height:500, flexDirection: 'row', flexWrap: 'wrap'}}>
        <View style={{height:'60%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={require('/home/bruno/ProjetoCarro/imagens/iconeyeb.png')}
            style={{width:200,  resizeMode:'contain'}}/>
        </View>
        <View style={{height:'0%', width:'100%', alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{color: '#19D2E7', borderColor: '#19D2E7', borderWidth: 2, padding:10, paddingLeft:20, paddingRight: 20, fontSize: 30}}>
            E y e B
          </Text>
        </View>
        <View style={{height:'110%', width:'100%', alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity 
            accessible={true}
            accessibilityLabel="Botão de Começar"
            accessibilityHint="ir para tela de Cadastro"
            style={{marginTop: 10}}
            onPress={() => {this.signInWithGoogleAsync(); }}>
            <Text style={{fontSize: 30, backgroundColor: 'rgba(47,163,218,.4)', borderRadius:4, paddingLeft:30, paddingRight:30, padding: 10, color: 'white'}}>
            Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

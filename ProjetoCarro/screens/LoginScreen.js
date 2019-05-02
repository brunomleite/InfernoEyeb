import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image } from 'react-native';
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
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
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
                    // console.log('Snapshot', snapshot);
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
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
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
        androidClientId: 'AE:92:6F:14:BA:82:E2:1B:14:EA:5E:39:EA:81:AB:77:A7:E8:B1:2F',
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
      <View style={styles.container}>
      <ImageBackground source={require('/home/bruno/ProjetoCarro/imagens/background.jpeg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.welcome}>
          <Text style={{fontSize: 25}}>
            EyeB
          </Text>
          <Text style={{fontSize: 15}}>
            Fazendo o Cego ver Desde 2019
          </Text>
        </View>
        <View style ={styles.button}>
          <Button title="Sign In With Google" onPress={() => this.signInWithGoogleAsync()}/>
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
    //backgroundColor: 'orange'
  },
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'dodgerblue'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

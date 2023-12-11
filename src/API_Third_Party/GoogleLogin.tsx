import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '1020550980309-a0u49q8eug2lqg7ddv2f5du1dsu2jve8.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
  offlineAccess: true,
  iosClientId:
    '1020550980309-sohd6vke0a03rqj3oh19linvslmqc0lb.apps.googleusercontent.com',
});
function GoogleLogin(): JSX.Element {
  const [user, setUser] = useState({});
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userinfo', userInfo);
      setUser({userInfo});
    } catch (error: any) {
      console.log('Error message:', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        console.log('some error not  identified');
      }
    }
  };
  const isSignedIN = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      getCurrenrUserInfo();
    } else {
      console.log('Please login');
    }
  };
  const getCurrenrUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('signed sliently', user);
      setUser(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log(' user has not sign in yet');
      } else {
        console.log(' Sth went wrong');
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser({});
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <View>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: 250,
    height: 60,
  },
});

export default GoogleLogin;

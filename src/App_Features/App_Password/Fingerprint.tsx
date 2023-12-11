import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React, {useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';

export default function Fingerprint() {
    const [supportFingerprint, setSupportFingerprint] = useState(false);
  // Check if the device supports the fingerprint authentication or not.
  const rnBiometrics = new ReactNativeBiometrics();
  rnBiometrics.isSensorAvailable().then(resultObject => {
    const {available, biometryType} = resultObject;

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported');
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported');
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported');
      setSupportFingerprint(true);
    } else {
      console.log('Biometrics not supported');
    }
  });
    //Check biometricKeysExist

    rnBiometrics.biometricKeysExist()
    .then((resultObject) => {
      const { keysExist } = resultObject
  
      if (keysExist) {
        console.log('Keys exist')
      } else {
        console.log('Keys do not exist or were deleted')
      }
    })

    const authenticateWithBiometrics = async () => {
        try {
          const result = await rnBiometrics.simplePrompt({
            promptMessage: 'Authenticate with your fingerprint',
          });
      
          if (result.success) {
            // Biometric authentication was successful, perform your action here
            console.log('Authentication successful');
          } else {
            // Biometric authentication failed
            console.error('Authentication failed');
          }
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      };
      
  return (
    <View style={styles.container}>
    {/* {supportFingerprint && (
      <View style={styles.fingerprintIcon}>
        <MaterialIcons name="fingerprint" size={80} color="black" />
      </View>
    )} */}

    {supportFingerprint && (
      <TouchableWithoutFeedback onPress={authenticateWithBiometrics}>
        <MaterialIcons name="fingerprint" size={70} color="black" />
      </TouchableWithoutFeedback>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
    container:{

    },
    fingerprintIcon:{

    }
});

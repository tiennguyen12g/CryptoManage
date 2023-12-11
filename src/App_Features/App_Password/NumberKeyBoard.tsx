import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
interface PinLockProps {
  navigation?: any;
  setAuthenticated: Dispatch<SetStateAction<boolean>>
}

const NUMBERS_GROUP = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['', 0, 'icon'],
];
const pincode = '123456';
export default function NumberKeyBoard({navigation, setAuthenticated}: PinLockProps) {
  const [supportFingerprint, setSupportFingerprint] = useState(false);

  // Check if the device supports the fingerprint authentication or not.
  const rnBiometrics = new ReactNativeBiometrics();
  useEffect(() =>{
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
  },[])

  const authenticateWithBiometrics = async () => {
    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with your fingerprint',
      });

      if (result.success) {
        // Biometric authentication was successful, perform your action here
        console.log('Authentication successful');
        setAuthenticated(true)
      } else {
        // Biometric authentication failed
        // console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean | null>(
    null,
  );
  const [dotArray, setDotArray] = useState<number[]>([]);
  const handlePinSubmit = () => {
    if (dotArray.length === 6) {
      const userEnterPassword = dotArray.join('');
      if (userEnterPassword === pincode) {
        setAuthenticated(true)
      } else {
        setIsPasswordCorrect(true);
      }
    } else {
      setIsPasswordCorrect(false);
    }
  };
  const handleSetDotArray = (number: number) => {
    if (dotArray.length < 6) {
      const newDotArray = [...dotArray, number];
      setDotArray(newDotArray);
    }
  };
  const handleDeleteDotArray = () => {
    if (dotArray.length > 0) {
      const newDotArray: number[] = dotArray.slice(0, -1);
      setDotArray(newDotArray);
    }
  };
  useEffect(() => {
    if(supportFingerprint){
      authenticateWithBiometrics();
    }else{
     console.log('Your device does not support biometric'); 
    }
  },[supportFingerprint])
  return (
    <View style={{justifyContent: 'center', height: '100%'}}>
      {isPasswordCorrect === null ? (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={{fontSize: 16}}>
            Use your fingerprint or enter PIN to unlock
          </Text>
        </View>
      ) : (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text style={{color:"red"}}>Incorrect Password. Try Again!</Text>
        </View>
      )}
      <View style={{marginTop: 30}}>
        <View style={styles.viewTextInput}>
          {dotArray.map((dot, i) => {
            return <View style={styles.dotInput} key={i}></View>;
          })}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              width: '100%',
              position: 'absolute',
            }}>
            <Text
              style={{fontSize: 22, fontWeight: '600', color: 'black'}}
              onPress={handlePinSubmit}>
              OK
            </Text>
          </View>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <View style={{marginTop: 30}}>
        {NUMBERS_GROUP.map((groupNumbers, j) => (
          <View key={j} style={styles.groupNumber}>
            {groupNumbers.map((number, i) => {
              return typeof number === 'number' ? (
                <Text
                  key={`number${i}`}
                  style={styles.buttonNumber}
                  onPress={() => handleSetDotArray(number)}>
                  {number}
                </Text>
              ) : number === 'icon' ? (
                <View style={styles.buttonNumberIcon} key={`icon${i}`}>
                  <Feather
                    name="delete"
                    size={30}
                    color="black"
                    onPress={handleDeleteDotArray}
                  />
                </View>
              ) : (
                <View style={styles.buttonNumberHidden} key={`hidden${i}`} />
              );
            })}
          </View>
        ))}
      </View>

      <View style={{alignItems: 'center', marginBottom: 30, marginTop: 10}}>
        <Text style={{color: 'red', fontSize: 16, fontWeight: '500'}}>
          Forgot your PIN?
        </Text>
      </View>
      {supportFingerprint === true ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            marginTop: 10,
            bottom: 0,
            position: 'absolute',
            width: '100%',
          }}>
          {supportFingerprint && (
            <TouchableOpacity onPress={authenticateWithBiometrics}>
              <MaterialIcons name="fingerprint" size={70} color="black" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        ''
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonNumber: {
    width: 60,
    height: 60,
    // borderWidth:1,
    backgroundColor: 'rgb(28, 112, 240)',
    fontSize: 35,
    textAlign: 'center',
    borderRadius: 30,
    color: 'white',
    margin: 15,
  },
  groupNumber: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  buttonNumberHidden: {
    width: 50,
    height: 50,
    // borderWidth:1,
    fontSize: 35,
    textAlign: 'center',
    borderRadius: 25,
    color: 'white',
    margin: 15,
  },
  buttonNumberIcon: {
    width: 60,
    height: 60,
    // borderWidth:1,
    fontSize: 35,
    borderRadius: 30,
    color: 'white',
    margin: 15,
    // backgroundColor: "rgb(128, 174, 245)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    width: '70%',
    marginHorizontal: '15%',
  },
  viewTextInput: {
    width: '70%',
    height: 40,
    flexDirection: 'row',
    marginHorizontal: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotInput: {
    // backgroundColor:"red",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgb(52, 115, 175)',
    marginHorizontal: 3,
  },
});

import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
interface PinLockProps {
  navigation?: any;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const NUMBERS_GROUP = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ['fingerprint', 0, 'delete'],
];
const pincode = '123456';
const sizeIcon = 60;

interface DotArray  {
  pin: string | number, 
  color : string,
}
const initialDotArray: DotArray[] = [
  {pin: "", color : 'rgb(202, 202, 202)'},
  {pin: "", color : 'rgb(202, 202, 202)'},
  {pin: "", color : 'rgb(202, 202, 202)'},
  {pin: "", color : 'rgb(202, 202, 202)'},
  {pin: "", color : 'rgb(202, 202, 202)'},
  {pin: "", color : 'rgb(202, 202, 202)'},
]
export default function PinAndFingerprint({
  navigation,
  setAuthenticated,
}: PinLockProps) {
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
        setAuthenticated(true);
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
  const [dotArray, setDotArray] = useState<DotArray[]>(initialDotArray);
  const [currentPin, setCurrentPin] = useState(0)
  
  const handleSetDotArray = (number: number) => {
    console.log(currentPin);
    if(currentPin< 6) {
      const newPin = { pin: number, color: 'blue' };
      const newDotArray = [...dotArray];
      newDotArray[currentPin] = newPin;
      setDotArray(newDotArray);
      setCurrentPin((prev) => prev + 1);
      console.log('init', initialDotArray);
    }
  };
  const handleDeleteDotArray = (clearAll = false) => {
    if(currentPin === 0){
      //do nothing
    } else {

      if(clearAll){
        console.log('long press');
        setCurrentPin(0)
        setDotArray(initialDotArray)
      } else {
        const newPin =   {pin: "", color : "rgb(202, 202, 202)"}
        dotArray[currentPin - 1] = newPin;
        setCurrentPin(currentPin - 1)
        setDotArray(dotArray)
      }
    }
  };
  const handleDeleteAll = () =>{
    console.log('long press', dotArray);
    setCurrentPin(0);
    console.log("init",initialDotArray);
    setDotArray(initialDotArray)
  }

  useEffect(() => {
    if (supportFingerprint) {
      authenticateWithBiometrics();
    } else {
      console.log('Your device does not support biometric');
    }
  }, [supportFingerprint]);
  useEffect(() =>{
  
    if(currentPin === 6){
      const userEnterPassword = [];
      for (let i = 0 ; i < dotArray.length; i++){
        const pinNumber = dotArray[i].pin;
        userEnterPassword.push(pinNumber)
      }
      console.log(userEnterPassword.join("").toString());
      if (userEnterPassword.join("").toString() === pincode) {
        setAuthenticated(true);
      } else {
        setIsPasswordCorrect(true);
      }
    }
  },[currentPin])
  console.log("re-render")
  return (
    <View style={{justifyContent: "space-evenly", height: '100%'}}>
      <View style={{marginTop: 100, bottom:0}}>
        {isPasswordCorrect === null ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Enter Your PIN</Text>
          </View>
        ) : (
          <View style={{width: '100%', alignItems: 'center'}}>
            <Text style={{color: 'red'}}>Incorrect Password. Try Again!</Text>
          </View>
        )}
        <View style={{marginTop: 30}}>
          <View style={styles.viewTextInput}>
            {dotArray.map((dot, i) => {
              return <View style={[styles.dotInput, {backgroundColor: dot.color}]} key={i}></View>;
            })}
          </View>
        </View>
      </View>
      <View style={{marginTop: 0, bottom:0}}>
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
              ) : number === 'delete' ? (
                <View style={styles.buttonNumberIcon} key={`delete${i}`}>
                  <TouchableOpacity                       
                    onPress={() => handleDeleteDotArray(false)}
                    onLongPress={handleDeleteAll}
                  >
                    <Feather
                      name="delete"
                      size={30}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonNumberIcon} key={`fingerprint${i}`}>
                  <TouchableOpacity onPress={authenticateWithBiometrics}>
                    <MaterialIcons name="fingerprint" size={50} color="black" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View
        style={{
          alignItems: 'center',
          bottom: 30,
          position: 'absolute',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Text style={{color: 'red', fontSize: 18, fontWeight: '500'}}>
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
          }}></View>
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
    fontSize: 40,
    textAlign: 'center',
    borderRadius: 30,
    color: 'black', 
    marginHorizontal:20,
    marginVertical:15,
  },
  groupNumber: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  buttonNumberIcon: {
    width: 60,
    height: 60,
    fontSize: 35,
    borderRadius: 30,
    color: 'white',
    marginHorizontal:20,
    marginVertical:15,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth:1,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  blueDot:{
    backgroundColor: 'blue',
    position: 'absolute',
  }
});

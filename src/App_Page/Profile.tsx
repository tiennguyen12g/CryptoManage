import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

import { useFirstTimeUseApp } from '../Zustand/FirstTimeUseApp';
import {useNavigation} from '@react-navigation/native';
export default function Profile() {

  // Get initial app mode
  const firstTimeUseApp = useFirstTimeUseApp((state) => state.firstTimeUseApp);
  const setFirstTimeUseApp = useFirstTimeUseApp((state) => state.setFirstTimeUseApp);
  const isLogined = useFirstTimeUseApp((state) => state.isLogined);
  const setIsLogined = useFirstTimeUseApp((state) => state.setIsLogined);
  const navigation = useNavigation();

  const handleLogout = () => {
    console.log('firstTimeUseApp',firstTimeUseApp);
    if(firstTimeUseApp === false){
      setFirstTimeUseApp(!firstTimeUseApp)
      // navigation.navigate("SignIn" as never);
    }
  }
  const handleOnOffIntroduceMode = async () => {
    console.log('isLogined', isLogined);
    setIsLogined(false)
  }
  return (
    <View>
      <Text>Profile</Text>
      <View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{   color: 'blue',   fontSize: 16,   marginTop: 10,   backgroundColor: 'gray', }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={handleOnOffIntroduceMode}>
          <Text style={{color: "blue", fontSize:16, marginTop: 10, backgroundColor: 'gray'}}>Introduce mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

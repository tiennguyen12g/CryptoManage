import React, {useState, useEffect} from 'react';
import AppNavigator from './src/AppNavigator';
import {View, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Introduction2 from './src/App_Page/InitialPage/Introduction2';
import ThemeProvider from './src/Theme/ThemeContext';
import IntroNavigator  from "./src/App_Page/InitialPage/IntroNavigator"
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

interface UserInfoProps {
  isFirstTime: boolean;
}

export default function App() {
  const [data, setData] = useState<any>();
  const [isFirstTime, setIsFirstTime] = useState(true);
  useEffect(() => {
    async function GetData() {
      const getIsFirstTime = await GetInitialPageStatus()
        .then((value: any) => {
          return value;
        })
        .catch(err => {
          console.log('Error in Get', err);
        });
      setIsFirstTime(getIsFirstTime);
    }
    GetData();
  }, []);
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          {isFirstTime === false ? <IntroNavigator /> : <AppNavigator />}
        </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Function get Item key in local device
const GetInitialPageStatus = async () => {
  try {
    // Retrieve the JSON string from AsyncStorage
    const jsonData = await AsyncStorage.getItem('userInfos');

    if (jsonData !== null) {
      // Parse the JSON string back to an array or object
      const parsedData: UserInfoProps = JSON.parse(jsonData);
      const isFirstTime = parsedData.isFirstTime;
      return true;
    } else {
      // Handle the case where the key is not yet stored
      console.log(
        'No data found in AsyncStorage. Initializing with default data.',
      );

      // Example: Set some default data if the key is not found
      const storeData: UserInfoProps = {isFirstTime: true};
      await AsyncStorage.setItem('userInfos', JSON.stringify(storeData));
      console.log('Default data set in AsyncStorage');
      return true;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

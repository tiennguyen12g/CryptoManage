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


import { useFirstTimeUseApp } from './src/Zustand/FirstTimeUseApp';
interface UserInfoProps {
  firstTimeUseApp: boolean;
}

export default function App() {
  const [data, setData] = useState<any>();
  // const [isFirstTimeUseApp, setIsFirstTimeUseApp] = useState<boolean>(true);

  const firstTimeUseApp = useFirstTimeUseApp((state) => state.firstTimeUseApp);
  const setFirstTimeUseApp = useFirstTimeUseApp((state) => state.setFirstTimeUseApp);

  useEffect(() => {
    async function GetData() {
      const getIsFirstTimeUseApp = await GetInitialPageStatus()
        .then((value: any) => {
          console.log('value', value);
          return value;
        })
        .catch(err => {
          console.log('Error in Get', err);
        });
      setFirstTimeUseApp(getIsFirstTimeUseApp);
    }
    GetData();
  }, []);
  const defaultStatus = null;
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          {defaultStatus === true ? <IntroNavigator /> : <AppNavigator />}
        </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Function get Item key in local device
const GetInitialPageStatus = async () => {
  try {
    // Retrieve the JSON string from AsyncStorage
    const jsonData = await AsyncStorage.getItem('firstTimeUseApp');

    if (jsonData !== null) {
      // Parse the JSON string back to an array or object
      const parsedData: UserInfoProps = JSON.parse(jsonData);
      const firstTimeUseApp = parsedData.firstTimeUseApp;
      console.log('firstTimeUseApp', firstTimeUseApp);
      return firstTimeUseApp;
    } else {
      // Handle the case where the key is not yet stored
      console.log('No data found in AsyncStorage. Initializing with default data.',);

      // Example: Set some default data if the key is not found
      // const storeData: UserInfoProps = {firstTimeUseApp: true};
      // await AsyncStorage.setItem('firstTimeUseApp', JSON.stringify(storeData));
      // console.log('Default data set in AsyncStorage');
      // return true;
      return true;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

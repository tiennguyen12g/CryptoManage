
// hook and library.
import {View, Platform, Text, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

// Vector icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

//List introduce component pages
import Introduction2 from '../App_Page/InitialPage/Introduction2';
import Sign_In from '../App_Features/Account/Sign_In';
import Sign_Up from '../App_Features/Account/Sign_Up';
import TestNavigate from '../App_Page/InitialPage/TestNavigate';
import InitialSign from '../App_Features/Account/InitialSign';
import ForgotPassword from '../App_Features/Account/ForgotPassword';
import { Dispatch, SetStateAction } from 'react';

// List component page after login

const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{left:20,justifyContent:"center", alignItems:"center", flexDirection:"row"}}>
      <MaterialIcons name='arrow-back-ios' size={24} />
      <Text style={{fontSize:18, left: -5 }}>Back</Text>
    </TouchableOpacity>
  );
};

interface NavigatorComponentProps {
  setIsFirstTime: (value: boolean) => void;
}
const Stack = createStackNavigator();
export default function NavigatorComponent({setIsFirstTime}: NavigatorComponentProps) {
  const insets = useSafeAreaInsets();
  const insetTop = insets.top;
  const insetBottom = insets.bottom;
  return (
    <View
      style={{ 
      flex:1,
      paddingTop: Platform.OS === 'ios' ? insetTop : 0,
      paddingBottom: Platform.OS === 'ios' ? insetBottom : 0,
  }}
    >
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SignUp"
          screenOptions={{
            headerShown: true,
            headerMode: "float", //turn on this for Android
            // use to control duration.
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 400} }, // Adjust duration as needed
              close: { animation: 'timing', config: { duration: 400 } }, // Adjust duration as needed
            },
          }}
        >
          <Stack.Screen
            name="InitialSign"
            component={InitialSign}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Intro"
            component={Introduction2}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignIn"
            component={Sign_In}
            options={{headerShown: false
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={Sign_Up}
            options={{
              headerShown: false,
              headerTitleAlign:"center",
              headerBackTitleVisible:false,
              headerLeft: () => <CustomBackButton />
            }}
          />
          <Stack.Screen
            name="TestNavigate"
            component={TestNavigate}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown:true,
              headerTitle:"Forgot Password",
              headerStyle:{
                backgroundColor:"orange"
              },
              headerStatusBarHeight: 0,
              headerTitleAlign:"center",
              // headerBackTitleVisible:false,
              // headerLeft: () => <CustomBackButton />
              headerBackTitle:"Back",
              headerBackTitleStyle:{
                top: 0
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}


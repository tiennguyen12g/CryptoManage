import React, {useRef, useState} from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ViewStyle,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import NumberKeyBoard from './App_Features/App_Password/NumberKeyBoard';
import PinAndFingerprint from './App_Features/App_Password/PinAndFingerprint';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Home from './App_Page/Home';
import Earning from './App_Page/Earning';
import Profile from './App_Page/Profile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Wallet from './App_Page/Wallet';
import MyTheme from './Theme/Themes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('screen');
const iconSize = 24;
const labelSize = 14;
const padingItemBox = 5;
const bottomBarValue = 10;
const spaceBetweenIconAndLable = 10;
const activeTopStroke = 4;

const bottomBarHeight =
  iconSize +
  labelSize +
  padingItemBox * 2 +
  spaceBetweenIconAndLable +
  activeTopStroke;
const borderRadiusBar = bottomBarHeight / 2;
const statusBarHeight = StatusBar.currentHeight || 0;
const bottomForActiveTopLine = Platform.OS === 'ios' ? statusBarHeight : 0;
const activeTopWidth = (width - 10 * 2 - borderRadiusBar * 2) / 4;
// const Tab = createMaterialBottomTabNavigator();


const Tab = createBottomTabNavigator();
//Create animatedComponent for icon
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);
const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(MaterialCommunityIcons);
const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome)
function AppNavigator() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("Home")
  const insets = useSafeAreaInsets();
  const insetTop = insets.top;
  const insetBottom = insets.bottom;

  // Handle animate for the line in tabBarBottom
  const lineTabMove = useRef(new Animated.Value(0)).current;
  const handleLineTabMove = (tabName: string) => {
    let currentIndex = 0;

    if (tabName === "Home") currentIndex = 0
    else if (tabName === "Earning") currentIndex = 1
    else if (tabName === "Wallet") currentIndex = 2
    else if (tabName === "Profile") currentIndex = 3;

    Animated.spring(lineTabMove, {
      toValue: activeTopWidth * currentIndex,
      useNativeDriver: true,
    }).start();
  }

  // Handle Icon animation in tabBarBottom
  // const [iconScale] = useState(new Animated.Value(1))
  const [iconScaleHome] = useState(new Animated.Value(1));
  const [iconScaleProfile] = useState(new Animated.Value(1));
  const [iconScaleEarning] = useState(new Animated.Value(1));
  const [iconScaleWallet] = useState(new Animated.Value(1));
  const handleIconAnimation = (iconScale: Animated.Value) => {

    if(iconScale){
      Animated.sequence([
        Animated.timing(iconScale,{
          toValue: 1.4,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale,{
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
  }
  return (
    <GestureHandlerRootView
      style={{ 
          flex:1,
          paddingTop: Platform.OS === 'ios' ? insetTop : 0,
          paddingBottom: Platform.OS === 'ios' ? insetBottom : 0,
      }}
    >
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="Home"
          // sceneContainerStyle={{backgroundColor: "blue"}}
          screenOptions={{
            // it is all bottomBar
            tabBarStyle: {
              justifyContent: 'center',
              alignItems: 'center',
              position:"absolute",
              backgroundColor: 'rgb(230,230,230)',
              opacity: 1,
              borderTopWidth: 0,
              height: bottomBarHeight,
              marginHorizontal: 10,
              borderRadius: borderRadiusBar,

              // Shadow...
              shadowColor: 'gray',
              shadowOpacity: 0.1,
              shadowOffset: {
                width: 0,
                height: 0,
              },
              paddingHorizontal: borderRadiusBar,
              bottom: bottomBarValue,
            },
            tabBarActiveBackgroundColor: '',
            tabBarActiveTintColor: 'orange',

            // this is part of bottomBar. if you have 4 icons, this will control each 25% space-width of the bottomBar.
            tabBarItemStyle: {
              padding: padingItemBox,
              // backgroundColor:"red",
              height: bottomBarHeight,
            },

            // this use to control Label.
            tabBarLabelStyle: {
              fontSize: labelSize,
              fontWeight: '500',
            },

            // this use to control BarBadge
            tabBarBadgeStyle: {
              borderWidth: 0,
            },

            //amimation
            
          }}>
          <Tab.Screen
            name="Home"
            component={Home}
            listeners={({navigation, route}) => ({
              
              // onpress update
              tabPress: (e: any) => {
                console.log("route", route)
                handleLineTabMove("Home")
                handleIconAnimation(iconScaleHome)
              },
            })}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({focused, color, size}) => (
                // <Entypo name="home" size={iconSize} color={color} />
                <AnimatedEntypo 
                  name="home" 
                  size={iconSize} 
                  color={color} 
                  style={{transform: [{scale: iconScaleHome }]}} 
                />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Earning"
            component={Earning}
            listeners={({navigation, route}) => ({
              // onpress update
              tabPress: (e: any) => {
                handleLineTabMove("Earning");
                handleIconAnimation(iconScaleEarning)
              },
            })}
            options={{
              tabBarLabel: 'Earning',
              tabBarIcon: ({focused, color, size}) => (
                // <MaterialCommunityIcons
                //   name="finance"
                //   size={iconSize}
                //   color={color}
                // />
                <AnimatedMaterialCommunityIcons 
                  name="finance" 
                  size={iconSize} 
                  color={color} 
                  style={{transform: [{scale: iconScaleEarning}]}}
                />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Wallet"
            component={Wallet}
            options={{
              tabBarLabel: 'Wallet',
              tabBarIcon: ({focused, color, size}) => (
                <AnimatedEntypo 
                  name="wallet" 
                  size={iconSize} 
                  color={color} 
                  style={{transform: [{scale: iconScaleWallet}]}}
                />
              ),
              headerShown: false,
            }}
            listeners={({navigation, route}) => ({
              // onpress update
              tabPress: (e: any) => {
                handleLineTabMove("Wallet");
                handleIconAnimation(iconScaleWallet)
              },
            })}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({focused, color, size}) => (
                // <FontAwesome name="user-circle-o" size={iconSize} color={color}  />
                <AnimatedFontAwesome 
                  name="user-circle-o" 
                  size={iconSize} 
                  color={color} 
                  style={{transform: [{scale: iconScaleProfile}]}}
                />
              ),
              headerShown: false,
            }}
            listeners={({navigation, route}) => ({
              // onpress update
              tabPress: (e: any) => {
                handleLineTabMove("Profile");
                handleIconAnimation(iconScaleProfile)
              },
            })}
          />
        </Tab.Navigator>
        <Animated.View
          style={{
            width: activeTopWidth,
            height: activeTopStroke,
            backgroundColor: 'orange',
            position: 'absolute',
            bottom:
              Platform.OS === 'ios'
                ? bottomBarHeight +
                  insetBottom -
                  activeTopStroke +
                  bottomBarValue
                : bottomBarHeight - activeTopStroke + bottomBarValue,
            left:
              10 + borderRadiusBar,
            borderRadius: activeTopStroke,
            transform: [{translateX: lineTabMove}],
          }}></Animated.View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default AppNavigator;

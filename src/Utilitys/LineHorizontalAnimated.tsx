import {ScrollView, StyleSheet, Text, TextInput, View, 
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, 
    Animated, ViewStyle
  } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useTheme} from '@react-navigation/native';
interface LineHorizontalAnimatedProps{
    lineLength: number,
    lineAmount: number,
    indexPlace: number, // from 0.
    animateMode: "spring" | "timing",
    animateDuration?: number,
    animateSpeed?: number,
}

const {width, height} = Dimensions.get("screen");
export default function LineHorizontalAnimated({
    lineLength,
    lineAmount, 
    indexPlace , 
    animateMode,
    animateDuration = 500,
    animateSpeed = 3,

} : LineHorizontalAnimatedProps) {


    const {colors} = useTheme();
    const lineMove = useRef(new Animated.Value(0)).current;
    const lineWidth = lineLength / lineAmount;
    const handleLineMove = () => {
      if( animateMode === 'spring') {
        // Use "spring" mode
        Animated.spring(lineMove, {
          toValue: lineWidth * indexPlace,
          useNativeDriver: true,
          speed: animateSpeed,
        }).start();
      } else if ( animateMode === 'timing') {
        // Use "timing" mode
        Animated.timing(lineMove, {
          toValue: lineWidth * indexPlace,
          duration: animateDuration,
          useNativeDriver: true, // This is required for certain properties like 'marginLeft'
        }).start();
      }
    }
   
    const lineStyle: Animated.WithAnimatedObject<ViewStyle> = {
      height: 2.5,
      width: lineWidth, 
      backgroundColor: colors.secondary,
      transform:[{translateX: lineMove}]
    };
    useEffect(() => {
        handleLineMove();
    },[indexPlace])
  return (
    <View style={[styles.container]}>
        {/* Gray line for background */}
        <View style={{borderBottomWidth:1, borderColor:'gray', marginTop:5}}/>
        <View style={styles.lineContainer}>
            <Animated.View style={lineStyle} />
        </View>
    </View>
  )
};
const styles = StyleSheet.create({
    lineContainer:{
      width: '100%',
      top:-1.5,
    },
    container: {
        // borderColor: 'gray',
        // borderBottomWidth: 1,
    }
  })
  
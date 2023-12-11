import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../Theme/ThemeContext';
import GradienText from "./GradientText"

interface ButtonProps {
  widthBtn?: number;
  heightBtn?: number;
  titleBtn?: string;
  fontSizeBtn?: number;
  titleColor?: string;
  borderWidth?: number; // only use for buttonBorder
  borderRadiusBtn?: number;
  isTextGradient?: boolean;
  colorTextGradient?: string[],
}

const colorGradient1 = "#FCCC32"
const colorGradient2 = "#F55F52"
export function ButtonBackground({
  widthBtn = 280,
  heightBtn = 40,
  titleBtn = 'Button',
  fontSizeBtn = 20,
  titleColor,
  borderRadiusBtn,
  isTextGradient = false,
  colorTextGradient = ["#F55F52","#FCCC32"]
}: ButtonProps) {
  const {theme} = useTheme();
  titleColor = theme.textButtonGradient;
  return (
    <>
      <LinearGradient
        colors={[colorGradient1, colorGradient2]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        style={[
          styles.buttonBackground,
          {
            width: widthBtn,
            height: heightBtn,
            borderRadius: borderRadiusBtn ? borderRadiusBtn : heightBtn / 2,
          },
        ]}>
          {
            isTextGradient ? 
            (
              <GradienText
              colors={colorTextGradient}
              style={{
                fontSize: fontSizeBtn,
                color: titleColor,
                fontWeight: '600',
              }}>
              {titleBtn}
            </GradienText>
            ) : (
              <Text
              style={{
                fontSize: fontSizeBtn,
                color: titleColor,
                fontWeight: '600',
              }}>
              {titleBtn}
              </Text>
            )
          }

      </LinearGradient>
    </>
  );
}
export function ButtonBorder({
  widthBtn = 280,
  heightBtn = 40,
  titleBtn = 'Button',
  fontSizeBtn = 16,
  titleColor,
  borderWidth = 20,
  borderRadiusBtn,
  isTextGradient = false,
  colorTextGradient
}: ButtonProps) {
  const {theme} = useTheme();
  titleColor = theme.textButtonBorder;
  return (
    <>
      <LinearGradient
        colors={[colorGradient2, colorGradient1]}
        start={{x: 0.3, y: 0}}
        end={{x: 0.7, y: 1}}
        style={[
          {
            width: widthBtn,
            height: heightBtn,
            borderRadius: borderRadiusBtn ? borderRadiusBtn : heightBtn / 2,
            padding: borderWidth / 2,
          },
        ]}>
        {/* this View will create a white background to hide the background of gradient to make it same stroke of border */}
        <View
          style={[
            {
              backgroundColor: 'white',
              height: heightBtn - borderWidth,
              borderRadius: borderRadiusBtn
                ? borderRadiusBtn
                : (heightBtn - borderWidth) / 2,
              justifyContent:"center",
              alignItems:"center",
            },
          ]}>
          {
            isTextGradient ? 
            (
              <GradienText
              colors={colorTextGradient}
              style={{
                fontSize: fontSizeBtn,
                color: titleColor,
                fontWeight: '600',
              }}>
              {titleBtn}
            </GradienText>
            ) : (
              <Text
              style={{
                fontSize: fontSizeBtn,
                color: titleColor,
                fontWeight: '600',
              }}>
              {titleBtn}
              </Text>
            )
          }
        </View>
      </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({
  // Css for buttonBackground
  buttonBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

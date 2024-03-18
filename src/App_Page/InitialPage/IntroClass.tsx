import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useTheme } from '../../Theme/ThemeContext'
interface DataProps {
    name:string,
    logoTitle: any,
    image: any,
    contentTitle: string,
    content: string,
    pageNo: number,
}
const {width, height} = Dimensions.get("screen");
export default function IntroClass({    
    name,
    logoTitle,
    image,
    contentTitle,
    content,
    pageNo,
  }: DataProps) {
      const {theme} = useTheme();
  return (
    <View style={styles.container}>
      {/* Title logo */}
      <View style={[styles.titleLogo, ]}>{logoTitle}</View>

      {/* Image */}
      <View style={[styles.imageIntro,]}>{image}</View>

      {/* Content for the app's feature */}
      <View style={[styles.contentFeature, ]}>
        <Text style={{fontSize: theme.sizeTitle, color:theme.textTitle, fontWeight:"600", marginBottom:10}}>{contentTitle}</Text>
        <Text style={{fontSize: theme.sizeNormalText, color: theme.textNormal, flexWrap:"wrap", textAlign: "center", }}>{content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent:"center",
    alignItems:'center',
  },
  titleLogo:{
    width:width,
    justifyContent:"flex-end",
    alignItems:'center',
    marginBottom:20,
  },
  imageIntro:{
    width:width,
    justifyContent:"center",
    alignItems:'center',
  },
  contentFeature:{
    width:width,
    height:'auto',
    justifyContent:"center",
    alignItems:'center',
    paddingHorizontal:20,
    marginTop: 20,
    // borderColor: 'gray',
    // borderWidth: 1, 
  }
})
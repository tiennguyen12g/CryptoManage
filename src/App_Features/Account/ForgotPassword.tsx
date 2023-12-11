import {View, Text, Animated,Dimensions, 
    TouchableWithoutFeedback, Keyboard, 
    TouchableOpacity, TextInput, StyleSheet, 
    KeyboardAvoidingView, Platform } from "react-native"

// Assets image, svg, mp4 ...
import  Logo  from "../../assests/Icons/InitialIcons/Logo";
import LogoTitle from "../../assests/Icons/InitialIcons/LogoTitle";

//hooks
import {useTheme} from '../../Theme/ThemeContext';
import { useEffect, useState } from "react";

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from "react-native-vector-icons/Fontisto"
import Entypo from "react-native-vector-icons/Entypo"

import { ButtonBackground } from "../../Utilitys/CustomButton";

// Initial variable
const {width, height} = Dimensions.get("screen");
const widthSizeBox = width - 40 * 2 > 300 ? (width - 40 * 2) : 300;
const iconSize = 20;
export default function ForgotPassword(){

    const {theme} = useTheme();
    const [email, setEmail] = useState('');

    // State to track the TextInput is writing
    const [inputActive, setInputActive] = useState<string | null>(null)

    const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)

    function CheckEmailValid(email: string){
        // You have to check email format and duplicate with data in database.
        
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(email) === false) {
            console.log("Email is Not Correct");
            setIsValidEmail(false)
            return false;
          }
          else {
            console.log("Email is Correct");
            setIsValidEmail(true)
          }
      }
    const handleForgotPassword = () => {

    }
    return(
        <KeyboardAvoidingView
            style={{ height:"100%", width:"100%",justifyContent:"space-around",alignItems:"center", flex:1, marginTop:-50}}
            behavior={Platform.OS === 'ios' ? 'padding' : "height" }
            keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 50}
        >
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
              <View style={{justifyContent:"center",alignItems:"center"}} >
                  <View style={{marginBottom:100, justifyContent:"center", alignItems:"center",}}>
                      <Logo />
                      <View style={{marginTop: 10}}><LogoTitle /></View>
                  </View>
                  <Text style={{fontSize: theme.sizeTitle, marginBottom:20, textAlign:"center", fontFamily: "Sora-Bold"}}>
                    Reset Password
                  </Text>
                 
                  <View style={[styles.inputBorder,{borderColor:theme.textSubtitle}]}>
                      <MaterialCommunityIcons name="email" size={iconSize} color={theme.textSubtitle}/>
                      <TextInput
                          style={{
                              fontSize: 16,
                              color: 'black',
                              marginLeft: 12,
                              flex: 1,  // to allow the TextInput to take up the remaining space
                              padding:0,
                          }}
                          placeholder="Email"
                          placeholderTextColor="gray"
                          value={email}
                          onChangeText={(text) => {setEmail(text), CheckEmailValid(text)}}
                          keyboardType="email-address"
                          onFocus={() => setInputActive("email")}
                          onBlur={() => setInputActive(null)}
                      />
                  </View>
                  {inputActive === "email" ? (
                        <View style={[styles.checkValidBox]}>
                            <Text style={{color:"green"}}>Your email must be:</Text>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isValidEmail ? "green" : "gray"}/>
                                <Text style={{left:10, color:isValidEmail ? "green" : "gray"}}>Correct email format.</Text>
                            </View>
                        </View>
                    ) : ("")}

  
                  <View style={{marginTop:20}} >
                      <TouchableOpacity onPress={handleForgotPassword}>
                          <ButtonBackground widthBtn={widthSizeBox} heightBtn={40} titleBtn="Get code"/>
                      </TouchableOpacity>
                  </View>
              </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    )
}
const styles = StyleSheet.create({
    inputBorder:{
        width: widthSizeBox, // far away 40 with both edges
        height: 40,
        borderWidth:1,
        borderRadius: 10,
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal:20,
        marginBottom:10,
    },
    checkValidBox:{
        width: widthSizeBox,
        paddingVertical:10,
        borderWidth:1,
        paddingHorizontal:30,
        marginBottom:10,
        borderRadius: 10,
        borderColor:"green"
    },
    alignRequirement:{
        paddingTop:5, 
        // justifyContent:"center", 
        alignItems:"center", 
        flexDirection:"row",
    }
  })
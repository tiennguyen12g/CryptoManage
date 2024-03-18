import {
  View, Text, StyleSheet, Dimensions, LogBox,
  TextInput, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard,
} from "react-native";

//hooks
import {useTheme} from '../../Theme/ThemeContext';
import { useEffect, useState, Dispatch, SetStateAction } from "react";

// Assets image, svg, mp4 ...
import  Logo  from "../../assests/Icons/InitialIcons/Logo";
import LogoTitle from "../../assests/Icons/InitialIcons/LogoTitle";
import Apple from '../../assests/Icons/SocialMedia/apple';
import Facebook from '../../assests/Icons/SocialMedia/facebook';
import Google from '../../assests/Icons/SocialMedia/google';

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Fontisto from "react-native-vector-icons/Fontisto"
import Entypo from "react-native-vector-icons/Entypo"

// Outside library
import {useNavigation} from '@react-navigation/native';
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFirstTimeUseApp } from "../../Zustand/FirstTimeUseApp";
// Utilitys component.
import Checkbox from "../../Utilitys/CheckBox";
import LinkReference from "../../Utilitys/LinkReference";
import { ButtonBackground } from "../../Utilitys/CustomButton";
import GoogleLogin from "../../API_Third_Party/GoogleLogin";

// Initial variable
const {width, height} = Dimensions.get("screen");
const widthSizeBox = width - 40 * 2 > 300 ? (width - 40 * 2) : 300;
const userDataTest ={
  "email": "abcd@gmail.com",
  "password": "123456"
}
interface UserInfoProps {
  isFirstTime: boolean;
}
interface SignInProps {
  setIsFirstTime: (value: boolean) => void;
}

export default function Sign_In(){
  const {theme} = useTheme();
  const navigation = useNavigation();
  const iconSize = 20;

  // Get initial app mode
  const firstTimeUseApp = useFirstTimeUseApp((state) => state.firstTimeUseApp);
  const setFirstTimeUseApp = useFirstTimeUseApp((state) => state.setFirstTimeUseApp);
  const isLogined = useFirstTimeUseApp((state) => state.isLogined)
  const setIsLogined = useFirstTimeUseApp((state) => state.setIsLogined)

  // State for TextInput
  const [email, setEmail] = useState('abcd@gmail.com');
  const [password, setPassword] = useState('123456');
  

  // State to check the value input is valid or invalid.
  const [isValidUserSecurity, setIsValidUserSecurity] = useState<boolean | null>(null)
  const [isSecurityPass, setIsSecurityPass] = useState<boolean>(true)

    const handleSignIn = () =>{
      const isCorrectUser = (password === userDataTest.password) && (email === userDataTest.email)
      if(isCorrectUser){
        setIsValidUserSecurity(true);
        setFirstTimeUseApp(false)
        setIsLogined(true)
      }else{
        setIsValidUserSecurity(false)
      }
    }
    const handleOnOffIntroduceMode = async () => {
      console.log('isLogined', isLogined);
      setIsLogined(false)
    }
  return(
      <KeyboardAvoidingView 
          style={{ height:"100%", width:"100%",justifyContent:"space-evenly",alignItems:"center", flex:1}}
          behavior={Platform.OS === 'ios' ? 'padding' : "height" }
          keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
      >
          <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
              <View style={{justifyContent:"center",alignItems:"center"}} >
                  <View style={{marginBottom:60, justifyContent:"center", alignItems:"center",}}>
                      <Logo />
                      <View style={{marginTop: 10}}><LogoTitle /></View>
                  </View>
                  <Text style={{fontSize: theme.sizeTitle, marginBottom:20, textAlign:"center", fontFamily: "Sora-Bold"}}>Sign In Now</Text>
                  {/* { !isValidEmail && isValidEmail !== null && email.length > 0 && inputActive !== "email" ? (<Text style={{color:"red", }}>Your email is not valid. Try again!</Text>) : ("")} */}
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
                          onChangeText={(text) => {setEmail(text)}}
                          keyboardType="email-address"
                      />
                  </View>
                  {/* { !isValidPasswordLength && isValidPasswordLength !== null && password.length > 0 && inputActive !== "password" ? (<Text style={{color:"red",}}>Min 8 and max 20 characters</Text>) : ("")} */}
                  <View style={[styles.inputBorder,{borderColor:theme.textSubtitle, justifyContent:"space-between" }]}>
                      <View style={{alignItems:"center", flexDirection:"row",left:3 }}>
                          <Fontisto name="locked" size={iconSize} color={theme.textSubtitle}/>
                          <TextInput
                              style={{
                                  padding:0,
                                  fontSize: 16,
                                  color: 'black',
                                  marginLeft: 12,
                                  marginRight: 25,
                                  flex: 1,  // to allow the TextInput to take up the remaining space
                              }}
                              placeholder="Password"
                              placeholderTextColor="gray"
                              value={password}
                              onChangeText={(text) => {setPassword(text)}}
                              secureTextEntry={isSecurityPass}
                      />
                      </View>
                      <View style={{right:10}}>
                          {
                              isSecurityPass ? 
                              <TouchableOpacity onPress={() => setIsSecurityPass(false)} >
                                  <Ionicons name="eye" size={iconSize - 5} color={theme.textSubtitle}/> 
                              </TouchableOpacity>
                              :
                              <TouchableOpacity onPress={() => setIsSecurityPass(true)}>
                                  <Ionicons name="eye-off" size={iconSize -5} color={theme.textSubtitle}/>
                              </TouchableOpacity>
                          }
                      </View>
                  </View>
                  <View style={{ width: widthSizeBox,}}>
                    <View style={{ alignSelf: "flex-end" }}>
                      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
                        <Text style={{}}>Forgot password?</Text>
                    </TouchableOpacity>
                      {/* <LinkReference linkRef="" nameLink="Forgot password?" colorLink={theme.textSubtitle} fontSize={16}/> */}
                    </View>
                  </View>
                  <View style={{marginTop:60}}>
                    {
                      isValidUserSecurity ? (
                      <Text style={{color:"green",}}>Login successfuly!</Text>) 
                      : 
                      (isValidUserSecurity === null ? ("") : 
                      (<Text style={{color:"red",}}>Email or password is incorrect. Try again!</Text>))
                    }
                  </View>
  
                  <View style={{marginTop:20}} >
                      <TouchableOpacity onPress={handleSignIn}>
                          <ButtonBackground widthBtn={widthSizeBox} heightBtn={40} titleBtn="SIGN IN"/>
                      </TouchableOpacity>
                  </View>
                  <View style={{flexDirection:"row", marginTop:10,justifyContent:"center",alignItems:"center"}}>
                      <Text>Create an account </Text>
                      <TouchableOpacity onPress={() => navigation.navigate("SignUp" as never)}>
                          <Text style={{color: "blue", fontSize:16}}>Sign up</Text>
                      </TouchableOpacity>
  
                  </View>
                  <View style={{flexDirection:"row", paddingVertical:20, alignItems:"center", width:widthSizeBox, justifyContent:"space-between"}}>
                      <View style={{width:(widthSizeBox / 2 - 20), height:1.5, backgroundColor:theme.textSubtitle}}></View>
                      <Text style={{color:"blue", paddingHorizontal: 0}}>OR</Text>
                      <View style={{width:(widthSizeBox / 2 - 20), height:1.5, backgroundColor:theme.textSubtitle}}></View>
                  </View>
                  <View style={{ flexDirection: "row", paddingHorizontal:20, alignItems:"center"}}>
                      <View style={{paddingRight: 15}}><Google width={30} height={30}/></View>
                      <View style={{paddingRight: 15}}><Facebook width={30} height={30}/></View>
                      <View style={{paddingRight: 0}}><Apple width={30} height={30}/></View>
                  </View> 
                  {/* <View>
                    <GoogleLogin />
                  </View>        */}
              </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
import {
    View, Text, StyleSheet, Dimensions, LogBox,
    TextInput, KeyboardAvoidingView, Platform, 
    TouchableWithoutFeedback, Keyboard,
} from "react-native";

//hooks
import {useTheme} from '../../Theme/ThemeContext';
import { useEffect, useRef, useState } from "react";

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

// Utilitys component.
import Checkbox from "../../Utilitys/CheckBox";
import LinkReference from "../../Utilitys/LinkReference";
import { ButtonBackground } from "../../Utilitys/CustomButton";

// Initial variable
const {width, height} = Dimensions.get("screen");
const widthSizeBox = width - 40 * 2 > 300 ? (width - 40 * 2) : 300;

// Animation


export default function Sign_Up(){
    const {theme} = useTheme();
    const navigation = useNavigation();
    const iconSize = 20;

    // State to track the TextInput is writing
    const [inputActive, setInputActive] = useState<string | null>(null)

    // State for TextInput
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    // State to check the value input is valid or invalid.
    const [isValidUsername, setIsValidUsername] = useState<boolean | null>(null)
    const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null)
    const [isValidPassword, setIsValidPassword] = useState<boolean | null>(null)
    const [isContainUppercase, setIsContainUppercase] = useState<boolean | null>(null)
    const [isContainLowercase, setIsContainLowercase] = useState<boolean | null>(null)
    const [isValidPasswordLength, setIsValidPassLength] = useState<boolean | null>(null)
    const [isRepeatPasswordCorrect, setIsRepeatPasswordCorrect] = useState<boolean | null>(null)

    const [isSecurityPass, setIsSecurityPass] = useState<boolean>(true)
    const [isCheckTerm, setIsCheckTerm] = useState<boolean>(false)
    const [termChecked, setTermCheck] = useState<boolean | null>(null)
    const [isSuccessRegister, setIsSuccessRegister] = useState<boolean>(false)

    // Function to check input data
      const handleTermCheck = () => {
        setIsCheckTerm(!isCheckTerm);
        if(isCheckTerm){
            setTermCheck(false)
        }else{
            setTermCheck(true)
        };
        if(Keyboard){
            Keyboard.dismiss()
        }
      };
      function CheckUsername(username: string){
        const userNameLength = username.length;
        if(userNameLength >= 4){
            setIsValidUsername(true)
        } else (
            setIsValidUsername(false)
        )
      }
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
      function CheckPasswordValid(passwordInput: string){

        // Check for minimum length (e.g., 8 characters)
        const isLengthValid =  passwordInput.length >= 8 && passwordInput.length <= 20;
        if(isLengthValid){
            setIsValidPassLength(true)
        }else (
            setIsValidPassLength(false)
        )
        // Regular expression to check for uppercase letters
        var uppercaseRegex = /[A-Z]/;
         // Regular expression to check for lowercase letters
        var lowercaseRegex = /[a-z]/;

        const containUpperCase = uppercaseRegex.test(passwordInput)
        const containLowerCase = lowercaseRegex.test(passwordInput)
        if(containLowerCase){
            setIsContainLowercase(true)
        } else {
            setIsContainLowercase(false)
        }
        if(containUpperCase){
            setIsContainUppercase(true)
        } else {
            setIsContainUppercase(false)
        }

        // Regex to check for at least one uppercase, one lowercase, and one digit
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        const isValidFormat = passwordRegex.test(passwordInput);
        if(isValidFormat){
            setIsValidPassword(true)
        } else {
            setIsValidPassword(false)
        }
        // return passwordRegex.test(passwordInput) && isLengthValid;
      }
      function CheckRepeatPasswordValid(repeatPasswordInput: string){
        if(password === repeatPasswordInput){
            setIsRepeatPasswordCorrect(true)
        } else (
            setIsRepeatPasswordCorrect(false)
        )
      }

      const handleSignUp = () =>{
        CheckEmailValid(email)
        CheckPasswordValid(password)
        CheckRepeatPasswordValid(repeatPassword);
        CheckUsername(username)
        if(!isCheckTerm){
            setTermCheck(false)
        } else (
            setTermCheck(true)
        )
      }
      useEffect(() =>{
        if(
            isValidEmail 
            && isValidPassword 
            && isValidPasswordLength 
            && isRepeatPasswordCorrect 
            && termChecked
            && isValidUsername
            ){
            const userData = {
                "username": username,
                "email": email,
                "password": password,
                "repeatPassword": repeatPassword,
                "termPrivacy": termChecked,

            }
            console.log("All data are valid", userData)
            setIsSuccessRegister(true)
        }
      },[isValidEmail, isValidPassword, isValidPasswordLength, termChecked, isValidUsername])
    return(
        <KeyboardAvoidingView 
            style={{ height:"100%", width:"100%",justifyContent:"space-evenly",alignItems:"center", flex:1}}
            behavior={Platform.OS === 'ios' ? 'padding' : "height" }
            keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
        >
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
                {/* <View style={{justifyContent:"center",alignItems:"center",opacity: isKeyboardShow ? 0 : 1 }}>
                    <Logo />
                    <View style={{marginTop: 10}}><LogoTitle /></View>
                </View> */}
                <View style={{justifyContent:"center",alignItems:"center"}} >
                    <View style={{marginBottom:60, justifyContent:"center", alignItems:"center"}}>
                        <Logo />
                        <View style={{marginTop: 10}}><LogoTitle /></View>
                    </View>
                    <Text style={{fontSize: theme.sizeTitle, marginBottom:20, textAlign:"center"}}>Create Account</Text>
                    {!isValidUsername && isValidUsername !== null && username.length > 0 && inputActive !=="username" ? (<Text style={{color:"red"}}>Must be equal or more than 4 characters</Text>):("")}
                    <View style={[styles.inputBorder,{borderColor:theme.textSubtitle}]}>
                        <FontAwesome5  name="user-circle" size={iconSize} color={theme.textSubtitle}/>
                        <TextInput
                            style={{
                                padding:0,
                                fontSize: 16,
                                color: 'black',
                                marginLeft: 12,
                                flex: 1,  // to allow the TextInput to take up the remaining space
                            }}
                            placeholder="Username"
                            placeholderTextColor="gray"
                            value={username}
                            onChangeText={(text) => {setUsername(text); CheckUsername(text)}}
                            onFocus={() => setInputActive("username")}
                            onBlur={() => setInputActive(null)}
                        />
                    </View>
                    {/* {inputActive === "username" ? (
                        <View style={[styles.checkValidBox,]}>
                            <Text style={{color:"green"}}>Your username must be:</Text>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isValidUsername ? "green" : "gray"}/>
                                <Text style={{left:10, color:isValidUsername ? "green" : "gray"}}>Equal or more than 4 characters.</Text>
                            </View>
                        </View>
                    ) : ("")} */}

                    { !isValidEmail && isValidEmail !== null && email.length > 0 && inputActive !== "email" ? (<Text style={{color:"red"}}>Your email is not valid. Try again!</Text>) : ("")}
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
                    {/* {inputActive === "email" ? (
                        <View style={[styles.checkValidBox]}>
                            <Text style={{color:"green"}}>Your email must be:</Text>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isValidEmail ? "green" : "gray"}/>
                                <Text style={{left:10, color:isValidEmail ? "green" : "gray"}}>Correct email format.</Text>
                            </View>
                        </View>
                    ) : ("")} */}
                    { !isValidPassword && isValidPassword !== null && password.length > 0 && inputActive !== "password" ? (
                    <Text style={{color:"red", flexWrap:"wrap" , width: widthSizeBox,textAlign:"center"}}>
                        Must be contain upper-lower case, number!
                    </Text>
                    ) : ("")}
                    { !isValidPasswordLength && isValidPasswordLength !== null && password.length > 0 && inputActive !== "password" ? (<Text style={{color:"red",}}>Min 8 and max 20 characters</Text>) : ("")}
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
                                onChangeText={(text) => {setPassword(text); CheckPasswordValid(text) }}
                                secureTextEntry={isSecurityPass}
                                onFocus={() => setInputActive("password")}
                                onBlur={() => setInputActive(null)}
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
                    {/* {inputActive === "password" ? (
                        <View style={[styles.checkValidBox]}>
                            <Text style={{color:"green"}}>Your password must be:</Text>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isContainUppercase ? "green" : "gray"}/>
                                <Text style={{left:10, color: isContainUppercase ? "green" : "gray"}}>At least one uppercase.</Text>
                            </View>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isContainLowercase ? "green" : "gray"}/>
                                <Text style={{left:10, color:isContainLowercase ? "green" : "gray"}}>At least one lowercase.</Text>
                            </View>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isValidPasswordLength ? "green" : "gray"}/>
                                <Text style={{left:10, color:isValidPasswordLength ? "green" : "gray"}}>Min 8 and max 20 characters.</Text>
                            </View>
                        </View>
                    ) : ("")} */}
                    {!isRepeatPasswordCorrect && isRepeatPasswordCorrect !== null && repeatPassword.length > 0 && inputActive !== "repeat-password" ? (<Text style={{color:"red"}}> Repeat password is not match</Text>):("")}
                    <View style={[styles.inputBorder,{borderColor:theme.textSubtitle, justifyContent:"space-between"}]}>
                        <View style={{justifyContent:"center", alignItems:"center", flexDirection:"row", left:3}}>
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
                                placeholder="Repeat Passwod"
                                placeholderTextColor="gray"
                                value={repeatPassword}
                                onChangeText={(text) => {setRepeatPassword(text); CheckRepeatPasswordValid(text)}}
                                secureTextEntry={isSecurityPass}
                                onFocus={() => setInputActive("repeat-password")}
                                onBlur={() => setInputActive(null)}
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
                    {/* {inputActive === "repeat-password" && password.length > 0 ? (
                        <View style={[styles.checkValidBox]}>
                            <View style={styles.alignRequirement}>
                                <Entypo name="check" color={isRepeatPasswordCorrect ? "green" : "gray"}/>
                                <Text style={{left:10, color: isRepeatPasswordCorrect ? "green" : "gray"}}>Repeat-password is not match.</Text>
                            </View>
                        </View>
                    ) : ("")} */}

                    {!termChecked && termChecked !== null ? (<Text style={{color:"red"}}>You have to agree our Term and Privacy</Text>):("")}
                    <View style={{flexDirection:"row", width: widthSizeBox, left:20 + 3}}>
                        <Checkbox fontSize={14} size={18} label="I agree to the " isChecked={isCheckTerm} onToggle={handleTermCheck} />
                        <LinkReference fontSize={16} linkRef="google.com" nameLink="Terms and Privacy"/>
                    </View>
    
                    <View style={{marginTop:40}} >
                        <TouchableOpacity onPress={handleSignUp}>
                            <ButtonBackground widthBtn={widthSizeBox} heightBtn={40} titleBtn="SIGN UP"/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row", marginTop:10,justifyContent:"center",alignItems:"center"}}>
                        <Text>Already account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn" as never)}>
                            <Text style={{color: "blue", fontSize:16}}>Sign in</Text>
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
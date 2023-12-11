import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, Button } from 'react-native';
import NumberKeyBoard from './NumberKeyBoard';

const passwordType = "NumberKeyBoard";
function PasswordScreen ({ navigation, setAuthenticated} : {navigation?: any, setAuthenticated: any}) {
    const [password, setPassword] = useState('');
    
    const handleLogin = () => {
      // You can replace this simple check with your actual authentication logic
      if (password === '1234') {
        setAuthenticated(true);
      } else {
        setPassword("wrong")
        console.log('Incorrect password. Try again.');
      }
    };
  
    return (
      <SafeAreaView>
        <View>
            {password === "wrong" ?  (<Text>Password wrong</Text>) :(<Text>Enter Password</Text>) }
          
          <TextInput
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </SafeAreaView>
    );
  };

  export default  PasswordScreen;
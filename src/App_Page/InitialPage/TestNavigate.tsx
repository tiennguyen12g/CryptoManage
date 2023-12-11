
import React from "react";
import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from "react-native"


export default function Test(){
    const navigation = useNavigation()
    return(
        <View>
            <Text>Hello</Text>
            <Button title='Test' onPress={() => navigation.navigate("SignIn" as never)}/>
        </View>
    )
}

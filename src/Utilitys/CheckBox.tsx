import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can replace this with your preferred icon library
interface CheckBoxProps{
    label: string, 
    isChecked: boolean, 
    onToggle: () => void,
    size?: number,
    fontSize?: number,
}
const Checkbox = ({ label, isChecked, onToggle, size = 20, fontSize=14 }: CheckBoxProps) => {
  return (
    <TouchableOpacity onPress={onToggle} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isChecked ?  "blue" : '#000', // Change this to your desired border color
          backgroundColor: isChecked ? 'white' : 'transparent', // Change this to your desired fill color
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isChecked ? <Icon name="check" size={size - 4} color="blue" /> : (<Text></Text>)}
        {/* Change icon size and color as needed */}
      </View>
      <Text style={{ marginLeft: 8, fontSize: fontSize }}>{label}</Text>
    </TouchableOpacity>
  )
}

export default Checkbox
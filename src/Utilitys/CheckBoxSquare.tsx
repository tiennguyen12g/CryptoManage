import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can replace this with your preferred icon library
interface CheckBoxProps{
    label: string, 
    initialStatus: boolean,
    size?: number,
    fontSize?: number,
}
const CheckBoxSquare = ({ label,initialStatus,   size = 20, fontSize=14 }: CheckBoxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialStatus);
  const handleCheck = () => {
    setIsChecked(!isChecked);
  }
  return (
    <TouchableOpacity onPress={handleCheck} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: 4,
          borderWidth: 1,
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

export default CheckBoxSquare
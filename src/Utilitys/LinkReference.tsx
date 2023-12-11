import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';

interface LinkReferenceProps {
  linkRef: string;
  fontSize?: number;
  colorLink?: string;
  nameLink: string;
  isUnderline?: boolean;
}
const LinkReference = ({
  linkRef,
  fontSize = 20,
  colorLink = 'blue',
  nameLink,
  isUnderline = false,
}: LinkReferenceProps) => {
  const handlePress = () => {
    // Open the link when pressed
    Linking.openURL(linkRef);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Text
          style={{
            fontSize: fontSize,
            color: colorLink,
            textDecorationLine: isUnderline ? "underline" : "none",
          }}>
          {nameLink}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LinkReference;

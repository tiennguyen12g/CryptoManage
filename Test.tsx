import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

export default function Test() {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
    console.log('hello')
  };
  const handlePress2 = () => {
    width.value = withSpring(width.value + 50);
    console.log('hello')
  };

  return (
    <View style={styles.container}>
      <Text>Test</Text>
      <Button onPress={handlePress2} title="Click me" />
      <Animated.View style={{ ...styles.box, width }} />


      {/* <View>Username Input</View>
      {checkUsername ? (
      <View>
        <Text>Username must be more than 4 characters</Text>
      </View>):("")}
      <View>Password Input</View>
      {checkPassword ? ( */}
      {/* <View>
        <Text>Password must be more than 8 characters</Text>
        <Text>Password must be include uppercase and lowercase</Text>
        <Text>Password must be include a specific number</Text>
      </View>):("")} */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
  },
  box: {
    height: 100,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginVertical: 64,
  },
});

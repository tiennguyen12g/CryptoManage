import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const LongPressDurationExample = () => {
  const [pressDuration, setPressDuration] = useState(0);
  const [timeoutId, setTimeoutId] = useState<any>(null);

  const handlePressIn = () => {
    const startTime = new Date().getTime();

    // Set a timeout for 1 second
    const id = setTimeout(() => {
      setPressDuration(2);
    }, 1000);

    // Store the timeout ID in a state variable
    setTimeoutId(id);

    // Update the press duration
    setPressDuration(1);

    // Log the start time (for debugging)
    console.log('Press started at:', startTime);
  };

  const handlePressOut = () => {
    // Clear the timeout when the press is released
    clearTimeout(timeoutId);

    // Reset press duration
    setPressDuration(0);
  };

  return (
    <TouchableWithoutFeedback onPressOut={handlePressOut} onPressIn={handlePressIn}>
      <View style={{ padding: 20, backgroundColor: pressDuration === 1 ? 'lightgreen' : 'lightblue' }}>
        <Text>Press me!</Text>
      </View>
      <Text>Press Duration: {pressDuration}</Text>
    </TouchableWithoutFeedback>
  );
};

export default LongPressDurationExample;

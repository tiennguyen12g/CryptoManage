import React, { useState } from 'react';
import { View, Text, PanResponder } from 'react-native';

const LongPressMoveExample = () => {
  const [dragged, setDragged] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Long-press event
      setDragged(true);
    },
    onPanResponderMove: (event, gestureState) => {
      // Move event
      if (dragged) {
        setPosition({ x: gestureState.moveX, y: gestureState.moveY });
      }
    },
    onPanResponderRelease: () => {
      // Reset state on release
      setDragged(false);
      setPosition({ x: 0, y: 0 });
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} {...panResponder.panHandlers}>
      <Text>{dragged ? 'Dragging' : 'Press and hold to drag'}</Text>
      <Text>{`Position: x=${position.x.toFixed(2)}, y=${position.y.toFixed(2)}`}</Text>
    </View>
  );
};

export default LongPressMoveExample;

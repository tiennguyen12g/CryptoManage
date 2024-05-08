import {View, Text, Dimensions, ScrollView, Platform} from 'react-native';
import React, {useState, useRef} from 'react';

const {width, height} = Dimensions.get('screen');
export default function Swiper() {
  const [boxColorActive, setBoxColorActive] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const boxColors = ['red', 'blue', 'pink', 'orange', 'gray'];
  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollViewWidth = width - 30;
  const handleScroll = (event: any) => {
    if (Platform.OS === 'android') {
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.ceil(offsetX / width) + 1;
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.floor(offsetX / width) + 1;
  };
  return (
    <ScrollView
      contentContainerStyle={[
        {
          width: scrollViewWidth * boxColors.length,
        },
      ]}
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      onScroll={handleScroll}
      scrollEventThrottle={16}>
      <View style={{flexDirection: 'row'}}>
        {boxColors.map((boxColor, index) => (
          <View
            key={index}
            style={{
              width: scrollViewWidth,
              height: 300,
              backgroundColor: boxColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{boxColor}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

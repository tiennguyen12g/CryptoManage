import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {PieChart} from "react-native-chart-tnbt"
export default function Earning() {
  return (
    <View>
      <Text>Earning</Text>
      <PieChart
          typeNo={1}
          data={dataInput}
          duration={2000}
          mainPie={
            {
               size: 280, 
               strokeWidth: 15
            }
         }
          animations={{
            clockwiseDirection: 'clockwise', // counter_clockwise or clockwise
          }}
          decorPie={{
            sizeDecorCircular: 280,
            strokeWidthDecorCircular: 25,
            seperateSlice: true,
            opacityDecorCircular: 0.5,
            annotation: true,
          }}
        />
    </View>
  )
}

const styles = StyleSheet.create({})
const dataInput = [
  {
    title: 'Gold',
    value: 23900.52,
  },
  {
    title: 'USD',
    value: 11100,
  }]
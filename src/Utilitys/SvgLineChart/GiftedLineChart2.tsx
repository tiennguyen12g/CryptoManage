import { BarChart, LineChart,  PopulationPyramid } from "react-native-gifted-charts";
import { useRef } from "react";
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
const GiftedLineChart2 = () => {
    const pointerRef = useRef<ScrollView>(null)
      
      const lineData = [
        {value: 4, label: '1 Jan'},
        {value: 14, label: '10 Jan'},
        {value: 8, label: '20 Jan'},
        {value: 38, label: '30 Jan'},
        {value: 36, label: '1 Feb'},
        {value: 28, label: '10 Feb'},
        {value: 14, label: '20 Feb'},
        {value: 28, label: '28 Feb'},
        {value: 4, label: '1 Mar'},
        {value: 14, label: '10 Mar'},
        {value: 8, label: '20 Mar'},
        {value: 14, label: '30 Mar'},
        {value: 8, label: '1 Apr'},
        {value: 38, label: '10 Apr'},
        {value: 14, label: '20 Apr'},
        {value: 28, label: '30 Apr'},
        {value: 4, label: '1 May'},
        {value: 10, label: '10 May'},
        {value: 8, label: '20 May'},
        {value: 14, label: '30 May'},
        {value: 8, label: '1 Jun'},
        {value: 38, label: '10 Jun'},
        {value: 14, label: '20 Jun'},
        {value: 28, label: '30 Jun'},
        {value: 4, label: '1 Jul'},
        {value: 28, label: '10 Jul'},
        {value: 4, label: '20 Jul'},
        {value: 14, label: '30 Jul'},
      ];
    
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul']
    
      const showOrHidePointer = (ind: any) => {
        
        if(pointerRef.current !== null){
            pointerRef.current?.scrollTo({
                x: ind*200 - 25}); // adjust as per your UI
        }
      };
    
      return (
        <View>
          <View style={{flexDirection: 'row', marginLeft: 8}}>
            {months.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    padding: 6,
                    margin: 4,
                    backgroundColor: '#ebb',
                    borderRadius: 8,
                  }}
                  onPress={() => showOrHidePointer(index)}>
                  <Text>{months[index]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
            <LineChart
              scrollRef={pointerRef}
              data={lineData}
              curved
              initialSpacing={0}
              rotateLabel
              isAnimated={true}
              focusEnabled={true}
              showStripOnFocus={true}
              showTextOnFocus={true}
              showDataPointOnFocus={true}
              focusedDataPointShape={"dataPointsShape"}
              focusedDataPointWidth={20}
              focusedDataPointHeight={20}
              focusedDataPointColor={'red'}
              onFocus={()=> console.log('hello')}
              stripHeight={20}
              stripWidth={20}
              stripColor={'orange'}
              
            />
        </View>
      );
    }
export {GiftedLineChart2}
import { BarChart, LineChart,  PopulationPyramid,  } from "react-native-gifted-charts";
import { useRef } from "react";
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Svg, Defs, LinearGradient, Stop } from 'react-native-svg';
const GiftedLineChart = () => {
    const pointerRef = useRef<ScrollView>(null)
      
      const lineData = [
        {value: 4, label: '1 Jan', dataPointText: '0'},
        {value: 14, label: '10 Jan', dataPointText: '0'},
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
            //   showDataPointOnFocus={true}  // this will hide point
            //   focusedDataPointShape={"dataPointsShape"}
            //   focusedDataPointWidth={20}
            //   focusedDataPointHeight={20}
            //   focusedDataPointColor={'red'}
            //   onFocus={()=> console.log('hello')}
            //   stripHeight={20}
            //   stripWidth={20}
            //   stripColor={'orange'}
            // dataPointsColor={'red'}
              
            />
        </View>
      );
    }
    const GiftedLineChart2 = () => {

        const gradientColors = ['red', 'yellow']; // Define your gradient colors here

        const renderGradient = () => (
          <Svg>
            <Defs key={'gradient'}>
              <LinearGradient id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                {gradientColors.map((color, index) => (
                  <Stop key={index} offset={`${(index * 100) / (gradientColors.length - 1)}%`} stopColor={color} />
                ))}
              </LinearGradient>
            </Defs>
          </Svg>
        );
        const pointerRef = useRef<ScrollView>(null)
          
          
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul']
        
          const showOrHidePointer = (ind: any) => {
            
            if(pointerRef.current !== null){
                pointerRef.current?.scrollTo({
                    x: ind*200 - 25}); // adjust as per your UI
            }
          };
        
          const customDataPoint = () => {
            return (
                <View
                style={{
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderColor: '#07BAD1',
                }}
                />
            );
        };
        const customLabel = (val: any) => {
            return (
                <View style={{width: 70, marginLeft: 7}}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{val}</Text>
                </View>
            );
        };
        const lineData = [
            {value: 4, label: '1 Jan', date: '1 Apr 2022'},
            {value: 14, label: '10 Jan', date: '1 Apr 2022'},
            {value: 8, label: '20 Jan', date: '1 Apr 2022'},
            {value: 38, label: '30 Jan', date: '1 Apr 2022'},
            {value: 36, label: '1 Feb',date: '1 Apr 2022'},
            {value: 28, label: '10 Feb',date: '1 Apr 2022'},
            {value: 14, label: '20 Feb',date: '1 Apr 2022'},
            {value: 28, label: '28 Feb',date: '1 Apr 2022'},
        ]
        const dataForTest= [
            {
                date:"03-03-2024",
                value: 15.37
            },
            {
                date:"04-03-2024",
                value: 14.41
            },
            {
                date:"05-03-2024",
                value: 15.05
            },
            {
                date:"06-03-2024",
                value: 40544.39
            },
            {
                date:"07-03-2024",
                value: 38324.53
            },
            {
                date:"08-03-2024",
                value: 43478.69
            },
            {
                date:"09-03-2024",
                value: 48166.33
            },
        ]
        // const maxValue = lineData[lineData.length - 1].value
        const lineData2 = [
            {value: 4, labelComponent: () => customLabel('1 Jan'), dataPointText: '4',customDataPoint: customDataPoint},
            {value: 14, labelComponent: () => customLabel('10 Jan'), dataPointText: '4',customDataPoint: customDataPoint},
            {value: 8, labelComponent: () => customLabel('20 Jan'), dataPointText: '4',customDataPoint: customDataPoint},
            {value: 38, labelComponent: () => customLabel('30 Jan'), dataPointText: '4',customDataPoint: customDataPoint},
            {value: 36, label: '1 Feb', dataPointText: '4',customDataPoint: customDataPoint},
            {value: 28, label: '10 Feb', dataPointText: '4',customDataPoint: customDataPoint},
            {value: 14, label: '20 Feb', dataPointText: '4',customDataPoint: customDataPoint},
            {value: 28.2, label: '28 Feb',labelComponent: () => customLabel('28 Feb'), dataPointText: '4',customDataPoint: customDataPoint,
            showStrip: false,
            stripHeight: 190,
            stripColor: 'black',
            dataPointLabelComponent: () => {
            return (
                <View
                style={{
                    backgroundColor: 'black',
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                    borderRadius: 4,
                }}>
                <Text style={{color: 'white'}}>410</Text>
                </View>
            );
            },
            dataPointLabelShiftY: -70,
            dataPointLabelShiftX: -4,},
          ];
        
          return (
            <View style={{marginTop: 50}}>
              
              
                <LineChart
                  areaChart
                //   areaGradientComponent={renderGradient}
                  startFillColor={'#FFD166'}
                  endFillColor={'white'}

                  pointerConfig={pointerValue}
                  scrollRef={pointerRef}
                  data={dataForTest}
                  // curved
                  // setting for nagative value
                  maxValue={50000}
                  mostNegativeValue={50000}
                  noOfSections={5}
                  noOfSectionsBelowXAxis={5}
                  stepValue={10000}
                  stepHeight={50}
                  height={250}


                  thickness={4}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  initialSpacing={50}
                  rotateLabel
                  isAnimated={true}
                  focusEnabled={true}

                  yAxisColor={'gray'}
                  xAxisColor={'gray'}
                  color={'orange'}

                  showVerticalLines={false}
                  // control x horizontal line
                  // hideRules  this is horizontal line
                  rulesType="dashed" // solid, dotted, dashed
                  rulesColor="gray"

                  textFontSize={16}
                  textColor="red"
                  textShiftX={0}
                  textShiftY={0}

                  // control text in yAxis
                  yAxisLabelWidth={60}
                  yAxisExtraHeight={0}
                  yAxisTextStyle={{
                    fontSize: 12,
                    marginLeft: 0,
                  }}
                  showFractionalValues={false}


                  
                  showStripOnFocus={true}
                  showTextOnFocus={true}
                  dataPointsColor="red"
                //   showDataPointOnFocus={true}
                //   focusedDataPointShape={"dataPointsShape"}
                //   focusedDataPointWidth={20}
                //   focusedDataPointHeight={20}
                //   focusedDataPointColor={'red'}
                  onFocus={()=> console.log('hello')}
                //   stripHeight={20}
                //   stripWidth={20}
                //   stripColor={'orange'}
                />
            </View>
          );
        };

        const Chart3 = () => {
            const ptData = [
              {value: 160, date: '1 Apr 2022'},
              {value: 180, date: '2 Apr 2022'},
              {value: 190, date: '3 Apr 2022'},
              {value: 180, date: '4 Apr 2022'},
              {value: 140, date: '5 Apr 2022'},
              {value: 145, date: '6 Apr 2022'},
              {value: 160, date: '7 Apr 2022'},
              {value: 200, date: '8 Apr 2022'},
            
              {value: 220, date: '9 Apr 2022'},
              {
                value: 240,
                date: '10 Apr 2022',
                label: '10 Apr',
                labelTextStyle: {color: 'lightgray', width: 60},
              },
              {value: 280, date: '11 Apr 2022'},
              {value: 260, date: '12 Apr 2022'},
              {value: 340, date: '13 Apr 2022'},
              {value: 385, date: '14 Apr 2022'},
              {value: 280, date: '15 Apr 2022'},
              {value: 390, date: '16 Apr 2022'},
            
              {value: 370, date: '17 Apr 2022'},
              {value: 285, date: '18 Apr 2022'},
              {value: 295, date: '19 Apr 2022'},
              {value: 160, date: '1 Apr 2022'},
              {value: 180, date: '2 Apr 2022'},
              {value: 190, date: '3 Apr 2022'},
              {value: 180, date: '4 Apr 2022'},
              {value: 140, date: '5 Apr 2022'},
              {value: 145, date: '6 Apr 2022'},
              {value: 160, date: '7 Apr 2022'},
              {value: 200, date: '8 Apr 2022'},
            
              {value: 220, date: '9 Apr 2022'},
              {
                value: 240,
                date: '10 Apr 2022',
                label: '10 Apr',
                labelTextStyle: {color: 'lightgray', width: 60},
              },
              {value: 280, date: '11 Apr 2022'},
              {value: 260, date: '12 Apr 2022'},
              {value: 340, date: '13 Apr 2022'},
              {value: 385, date: '14 Apr 2022'},
              {value: 280, date: '15 Apr 2022'},
              {value: 390, date: '16 Apr 2022'},
            
              {value: 370, date: '17 Apr 2022'},
              {value: 285, date: '18 Apr 2022'},
              {value: 295, date: '19 Apr 2022'},
              {
                value: 300,
                date: '20 Apr 2022',
                label: '20 Apr',
                labelTextStyle: {color: 'lightgray', width: 60},
              },
              {value: 280, date: '21 Apr 2022'},
              {value: 295, date: '22 Apr 2022'},
              {value: 260, date: '23 Apr 2022'},
              {value: 255, date: '24 Apr 2022'},
            
              {value: 190, date: '25 Apr 2022'},
              {value: 220, date: '26 Apr 2022'},
              {value: 205, date: '27 Apr 2022'},
              {value: 230, date: '28 Apr 2022'},
              {value: 210, date: '29 Apr 2022'},
              {
                value: 200,
                date: '30 Apr 2022',
                label: '30 Apr',
                labelTextStyle: {color: 'lightgray', width: 60},
              },
              {value: 240, date: '1 May 2022'},
              {value: 250, date: '2 May 2022'},
              {value: 280, date: '3 May 2022'},
              {value: 250, date: '4 May 2022'},
              {value: 210, date: '5 May 2022'},
            ];
            
            return(
              <View
                style={{
                  paddingVertical: 100,
                  paddingLeft: 20,
                  backgroundColor: '#1C1C1C',
                }}>
                    <LineChart
                    areaChart
                    data={ptData}
                    rotateLabel
                    width={300}
                    hideDataPoints
                    spacing={10}
                    color="#00ff83"
                    thickness={2}
                    startFillColor="rgba(20,105,81,0.3)"
                    endFillColor="rgba(20,85,81,0.01)"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={0}
                    noOfSections={6}
                    maxValue={600}
                    yAxisColor="white"
                    yAxisThickness={0}
                    rulesType="solid"
                    rulesColor="gray"
                    yAxisTextStyle={{color: 'gray'}}
                    // yAxisSide="left"
                    xAxisColor="lightgray"
                    pointerConfig={{
                      pointerStripHeight: 160,
                      pointerStripColor: 'lightgray',
                      pointerStripWidth: 2,
                      pointerColor: 'lightgray',
                      radius: 6,
                      pointerLabelWidth: 100,
                      pointerLabelHeight: 90,
                      activatePointersOnLongPress: true,
                      autoAdjustPointerLabelPosition: false,
                      pointerLabelComponent: (items: any) => {
                        return (
                          <View
                            style={{
                              height: 90,
                              width: 100,
                              justifyContent: 'center',
                              marginTop: -30,
                              marginLeft: -40,
                            }}>
                            <Text style={{color: 'white', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                              {items[0].date}
                            </Text>
            
                            <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                              <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                                {'$' + items[0].value + '.0'}
                              </Text>
                            </View>
                          </View>
                        );
                      },
                    }}
                    />
                </View>
            );
          }


export {GiftedLineChart, GiftedLineChart2, Chart3}

// const pointerValue: Pointer = {
//     pointerStripHeight: 160,
//     pointerStripColor: 'lightgray',
//     pointerStripWidth: 2,
//     pointerColor: 'lightgray',
//     radius: 6,
//     pointerLabelWidth: 100,
//     pointerLabelHeight: 90,
//     activatePointersOnLongPress: true,
//     autoAdjustPointerLabelPosition: false,
//     pointerLabelComponent: (item: any) => {
//         return (
//             <View
//             style={{
//                 height: 90,
//                 width: 100,
//                 backgroundColor: 'black',
//                 paddingHorizontal: 8,
//                 paddingVertical: 5,
//                 borderRadius: 4,
//                 display:'flex',
//                 justifyContent:'center',
//                 alignItems:'center'
//             }}>
//             <Text style={{color: 'white'}}>{item[0].value}</Text>
//             </View>
//         )},

// }
const pointerValue: Pointer = {
    pointerStripHeight: 160,
            pointerStripColor: 'lightgray',
            pointerStripWidth: 2,
            pointerColor: 'lightgray',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items : any) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    display:'flex',
                    alignItems:'center',
                    justifyContent: 'center',
                    marginTop: 0,
                    marginLeft: -40,
                    // backgroundColor:'gray'
                  }}>
                  <Text style={{color: 'black', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                    {items[0].date}
                  </Text>
  
                  <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'pink'}}>
                    <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                      {'$' + items[0].value + '.0'}
                    </Text>
                  </View>
                </View>
              );
            },
}
type Pointer = {
    height?: number; // default: 0
    width?: number; // default: 0
    radius?: number; // default: 5
    pointerColor?: string; // default: 'red'
    pointer1Color?: string; // default: 'red'
    pointer2Color?: string; // default: 'red'
    pointer3Color?: string; // default: 'red'
    pointer4Color?: string; // default: 'red'
    pointer5Color?: string; // default: 'red'
    pointerComponent?: Function; // default: null
    showPointerStrip?: boolean; // default: true
    pointerStripWidth?: number; // default: containerHeight
    pointerStripHeight?: number; // default: 1
    pointerStripColor?: string; // default: 'black'
    pointerStripUptoDataPoint?: boolean; // default: false
    pointerLabelComponent?: Function; // default: null
    shiftPointerLabelX?: number; // default: 0
    shiftPointerLabelY?: number; // default: 0
    pointerLabelWidth?: number; // default: 20
    pointerLabelHeight?: number; // default: 20
    autoAdjustPointerLabelPosition?: boolean; // default: false
    pointerVanishDelay?: number; // default: 150
    activatePointersOnLongPress?: boolean; // default: false
    activatePointersDelay?: number; // default: 150
    hidePointer1?: boolean; // default: false
    hidePointer2?: boolean; // default: false
    hidePointer3?: boolean; // default: false
    hidePointer4?: boolean; // default: false
    hidePointer5?: boolean; // default: false
    strokeDashArray?: Array<number>;
  };

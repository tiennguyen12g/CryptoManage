import {StyleSheet, Text, View, Dimensions, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Fontisto from "react-native-vector-icons/Fontisto"
import Svg, {
  Rect,
  Text as SvgText,
  Line,
  Path,
  Defs,
  TextPath,
  G,
  Use,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedProps,
  SharedValue,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
  useAnimatedStyle,
  withSequence,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
const {abs} = Math;
interface ChartLineProps {
  lineChart: {
    invested: number;
    current: number;
    sold: number;
    mode: string,
    coinSymbol:string,
    quantityHold: number,
    averageBoughtPrice: number,
    averageSoldPrice: number,
    startTime: string,
    endTime: string,
  };
}
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedText = Animated.createAnimatedComponent(Text);
export default function ChartLine({lineChart}: ChartLineProps) {
  // (width - 20 -20 -4) is max size horizontal for the svg
  const maxSVG = (width - 20 - 20 - 20) * 1;
  const max_LineChart = (width - 20 - 20 * 3) * 1;
  const startLineChart = (width - 20 - 20) * 0.15;
  const endLineChart = (width - 20 - 20) * 0.7;
  const profit: number = +(
    +lineChart.current +
    +lineChart.sold -
    +lineChart.invested
  ).toFixed(1);
  let width_lineCurrent = 0;
  let width_lineSold = 0;
  let width_lineInvested = 0;
  let maxCurrentAndSold = 0;
  if (profit > 0) {
    width_lineSold =
      (lineChart.sold / (lineChart.current + lineChart.sold)) * max_LineChart;
    width_lineCurrent =
      (lineChart.current / (lineChart.current + lineChart.sold)) *
      max_LineChart;
    width_lineInvested =
      (lineChart.invested / (lineChart.current + lineChart.sold)) *
      max_LineChart;
    // console.log('profit is positive', width_lineSold, width_lineCurrent);
  } else {
    maxCurrentAndSold =
      ((lineChart.current + lineChart.sold) / lineChart.invested) *
      max_LineChart;
    width_lineSold =
      (lineChart.sold / (lineChart.current + lineChart.sold)) *
      maxCurrentAndSold;
    width_lineCurrent =
      (lineChart.current / (lineChart.current + lineChart.sold)) *
      maxCurrentAndSold;
    // console.log(width_lineSold, width_lineCurrent);
  }
  const startTextPath = maxCurrentAndSold - 0;
  const endTextPath = endLineChart;
  const durationDefault = 1000;
  const progress: SharedValue<number> = useSharedValue(0);
  const progressSold: SharedValue<number> = useSharedValue(0);
  const progressCurrent: SharedValue<number> = useSharedValue(0);
  const progressLine: SharedValue<number> = useSharedValue(0);
  const [triggerAnimated, setTriggerAnimated] = useState(true);
  const animationInvested = useAnimatedProps(() => {
    const sizePath = profit > 0 ? width_lineInvested : max_LineChart;
    const strokeDashoffset = interpolate(progress.value, [0, 1], [sizePath, 0]);
    return {
      strokeDashoffset,
    };
  });
  const animationForSold = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progressSold.value,
      [0, 1],
      [width_lineSold, 0],
    );
    return {
      strokeDashoffset,
    };
  });
  const animationForCurrent = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progressCurrent.value,
      [0, 1],
      [width_lineCurrent, 0],
    );
    return {
      strokeDashoffset,
    };
  });
  const animatedLine = useAnimatedProps(() => {
    const moveTo = profit < 0 ? maxCurrentAndSold : width_lineInvested;
    const x1 = interpolate(progressLine.value, [0, 1], [-10, moveTo]);
    const x2 = interpolate(progressLine.value, [0, 1], [-10, moveTo]);
    return {
      x1,
      x2,
    };
  });
  useEffect(() => {
    let investedDuration = 0;
    let soldDuration = 0;
    let currentDuration = 0;
    soldDuration = (width_lineSold / max_LineChart) * durationDefault;
    currentDuration = (width_lineCurrent / max_LineChart) * durationDefault;
    if (profit > 0) {
      investedDuration = (width_lineInvested / max_LineChart) * durationDefault;
    } else if (profit < 0) {
      investedDuration = durationDefault;
    }
    if (triggerAnimated) {
      progress.value = withDelay(
        0,
        withTiming(1, {duration: investedDuration, easing: Easing.linear}),
      );
      progressSold.value = withDelay(
        0,
        withTiming(1, {duration: soldDuration, easing: Easing.linear}),
      );
      progressCurrent.value = withDelay(
        soldDuration,
        withTiming(1, {duration: currentDuration, easing: Easing.linear}),
      );
      progressLine.value = withDelay(
        durationDefault,
        withTiming(1, {duration: 500, easing: Easing.linear}),
      );

      // console.log(investedDuration, soldDuration, currentDuration);
    } else {
      progress.value = withDelay(
        0,
        withTiming(0, {duration: investedDuration, easing: Easing.linear}),
      );
      progressSold.value = withDelay(
        currentDuration,
        withTiming(0, {duration: soldDuration, easing: Easing.linear}),
      );
      progressCurrent.value = withDelay(
        0,
        withTiming(0, {duration: currentDuration, easing: Easing.linear}),
      );
      progressLine.value = withDelay(
        500,
        withTiming(0, {duration: 500, easing: Easing.linear}),
      );
    }
  }, [progress, triggerAnimated, progressCurrent, progressLine, progressSold]);
  let lengthTest = 0;
  if (abs(profit) < 100) {
    lengthTest = 40;
  } else if (abs(profit) < 1000) {
    lengthTest = 50;
  } else if (abs(profit) < 10000) {
    lengthTest = 60;
  } else if (abs(profit) < 100000) {
    lengthTest = 70;
  } else if (abs(profit) < 1000000) {
    lengthTest = 80;
  } else if (abs(profit) < 10000000) {
    lengthTest = 90;
  }
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 24, color: 'black'}}>BTC</Text>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 0,
            marginTop: 0,
            padding: 0,
            // borderWidth:1,
          }}>
          <AnimatedText
            style={{
              opacity: progressLine,
              position: 'absolute',
              top: 0,
              fontSize: 20,
              color: profit < 0 ? 'red' : 'green',
              left:
                profit < 0
                  ? maxCurrentAndSold - lengthTest / 2
                  : width_lineInvested - lengthTest,
            }}>
            {profit > 0
              ? `+$${profit.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                })}`
              : `-$${abs(profit).toLocaleString('en-Us')}`}
          </AnimatedText>
          <Svg width={max_LineChart} height="140">
            <Defs>
              <LinearGradient
                x1={'0'}
                y1={'0'}
                x2={'1'}
                y2={'0'}
                id="red-gradient">
                {/* <Stop offset="8%" stopColor="rgb(231, 126, 119)"></Stop> */}
                <Stop offset="10%" stopColor="rgb(235, 95, 95)"></Stop>
                <Stop offset="90%" stopColor="rgb(233, 73, 68)"></Stop>
              </LinearGradient>
              <LinearGradient
                x1={'0'}
                y1={'0'}
                x2={'1'}
                y2={'0'}
                id="oceanblue-gradient">
                {/* <Stop offset="8%" stopColor="rgb(142, 197, 241)"></Stop> */}
                <Stop offset="10%" stopColor="rgb(108, 196, 247)"></Stop>
                <Stop offset="90%" stopColor="rgb(50, 184, 247)"></Stop>
              </LinearGradient>
              <LinearGradient
                x1={'0'}
                y1={'0'}
                x2={'1'}
                y2={'0'}
                id="green-gradient">
                {/* <Stop offset="8%" stopColor="rgb(117, 231, 114)"></Stop> */}
                <Stop offset="10%" stopColor="rgb(53, 243, 53)"></Stop>
                <Stop offset="90%" stopColor="rgb(44, 218, 87)"></Stop>
              </LinearGradient>
            </Defs>

            {/* profit is negative */}
            <AnimatedPath
              d={`M 0 60 L ${
                profit > 0 ? width_lineInvested : max_LineChart
              } 60`}
              strokeLinejoin="round"
              // stroke="rgb(11, 187, 35)"
              stroke={`url(#green-gradient)`}
              strokeWidth={30}
              strokeDasharray={profit > 0 ? width_lineInvested : max_LineChart}
              animatedProps={animationInvested}
            />
            {profit > 0 ? (
              <SvgText
                x={width_lineInvested}
                y={0}
                fontSize={20}
                fill="rgb(38, 102, 46)">
                + ${profit}
              </SvgText>
            ) : (
              ''
            )}
            {/* profit is positive */}
            <AnimatedPath
              d={`M 0 100 L ${width_lineSold} 100`}
              stroke={`url(#red-gradient)`}
              strokeWidth={30}
              strokeDasharray={width_lineSold}
              animatedProps={animationForSold}
            />
            <AnimatedPath
              d={`M ${width_lineSold} 100 L ${
                profit > 0 ? max_LineChart : maxCurrentAndSold
              } 100`}
              stroke={`url(#oceanblue-gradient)`}
              strokeWidth={30}
              strokeDasharray={width_lineCurrent}
              animatedProps={animationForCurrent}
            />
            {/* <Line
              x1={profit < 0 ? maxCurrentAndSold : width_lineInvested}
              y1="30"
              x2={profit < 0 ? maxCurrentAndSold : width_lineInvested}
              y2="94"
              stroke="red"
              strokeWidth="4"
              strokeLinecap="round"
            /> */}
            <AnimatedLine
              x1="-10"
              y1="30"
              x2={-4}
              y2="120"
              stroke={profit > 0 ? 'rgb(28, 209, 28)' : 'rgb(231, 46, 46)'}
              strokeWidth={4}
              strokeLinecap="round"
              animatedProps={animatedLine}
            />
          </Svg>
        </View>
      </View>
      <View style={{width: '100%', paddingHorizontal: 50, top: -10}}>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 6,
            backgroundColor: 'rgb(233, 73, 68)',
          }}>
          </View>
        <Text style={{fontSize:18}}> invested: $ {(lineChart.invested).toLocaleString('en-Us')}</Text>
      </View> */}
        <LineChartInfoRow
          color="rgb(233, 73, 68)"
          label="Invested"
          value={lineChart.invested}
        />
        <LineChartInfoRow
          color="rgb(44, 218, 87)"
          label="Sold"
          value={lineChart.sold}
        />
        <LineChartInfoRow
          color="rgb(50, 184, 247)"
          label="Current"
          value={lineChart.current}
        />
      </View >
      <View style={{borderWidth:1, width:"100%", height:150, alignItems:'center', display:"none"}}>
        <Text>Mode: Trading</Text>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, paddingLeft:40}}>Current Value</Text>
          <Text style={{flex:0.5, paddingLeft:40}}>Holding Amount</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, paddingLeft:40}}>${(lineChart.current).toLocaleString('en-Us')}</Text>
          <Text style={{flex:0.5, textAlign:'center'}}>{lineChart.quantityHold}</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, paddingLeft:40}}>Total Bought</Text>
          <Text style={{flex:0.5, paddingLeft:40}}>Average Buy Price</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, textAlign:'center'}}>${(lineChart.invested).toLocaleString('en-Us')}</Text>
          <Text style={{flex:0.5, textAlign:'center'}}>{lineChart.quantityHold}</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, paddingLeft:40}}>Total Sold</Text>
          <Text style={{flex:0.5, paddingLeft:40}}>Average Sell Price</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, textAlign:'center'}}>${(lineChart.sold).toLocaleString('en-Us')}</Text>
          <Text style={{flex:0.5, textAlign:'center'}}>{lineChart.quantityHold}</Text>
          {/* <Text style={{flex:0.5, paddingLeft:40}}>{lineChart.quantityHold}</Text> */}

        </View>

      </View>
      <View style={{ borderColor:'gray', width:max_LineChart, height:360, alignItems:'center', borderRadius:10, overflow:"hidden"}}>
        <View style={{flexDirection:"row", alignItems:"center",justifyContent:"center", backgroundColor:'rgb(215, 232, 253)', width:"100%"}}>
          <Text style={{fontSize: 25, color: profit > 0 ? "rgb(18, 177, 18)" : "rgb(231, 46, 46)"}}>{profit > 0 ? "Good " : "Bad "}</Text>
          {profit < 0 ? 
          <FontAwesome6 name='face-sad-cry' size={25} color='rgb(231, 46, 46)' /> :          
          <Fontisto name='smiley' size={25} color='rgb(18, 177, 18)' /> }
        </View>
        <View style={{flexDirection:"row", flex:1, borderTopWidth: 2, borderTopColor:"gray"}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Mode</Text>
          <Text style={{flex:0.5, textAlign:'right', paddingRight:30,fontSize:18}}>{lineChart.mode}</Text>

        </View>
        <View style={{flexDirection:"row", flex:1,}}>
          <Text style={{flex:0.5, paddingLeft:20,fontSize:18}}>Profit/ Loss</Text>
          <Text style={{flex:0.5, textAlign:'right',fontSize:18, paddingRight:30, color: profit > 0 ? "green" : "red"}}>{profit > 0 ? (`+$${profit}`) : (`-$${profit}`)}</Text>

        </View>
        <View style={{flexDirection:"row", flex:1, borderTopWidth: 2, borderTopColor:"gray"}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Current Value</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>${(lineChart.current).toLocaleString('en-Us')}</Text>


        </View>
        <View style={{flexDirection:"row", flex:1}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Holding Amount</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>{lineChart.quantityHold}</Text>


        </View>
        <View style={{flexDirection:"row", flex:1, borderTopWidth: 2, borderTopColor:"gray"}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Total Bought</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>${(lineChart.invested).toLocaleString('en-Us')}</Text>


        </View>
        <View style={{flexDirection:"row", flex:1,}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Total Sold</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>${(lineChart.sold).toLocaleString('en-Us')}</Text>


        </View>
        <View style={{flexDirection:"row", flex:1, borderTopWidth: 2, borderTopColor:"gray"}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Average Buy</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>${lineChart.averageBoughtPrice}</Text>
         
        </View>

        <View style={{flexDirection:"row", flex:1,}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Average Sell</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>${lineChart.averageSoldPrice}</Text>
        </View>
        <View style={{flexDirection:"row", flex:1, borderTopWidth: 2, borderTopColor:"gray"}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>Start Time</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>{lineChart.startTime}</Text>
         
        </View>

        <View style={{flexDirection:"row", flex:1, borderBottomWidth:2}}>
          <Text style={{flex:0.5, paddingLeft:20, fontSize:18}}>End Time</Text>
          <Text style={{flex:0.5, textAlign:'right', fontSize:18, paddingRight:30}}>{lineChart.endTime}</Text>
        </View>
        
      </View>
      <Button
        onPress={() => setTriggerAnimated(!triggerAnimated)}
        title="RUn"
      />
    </View>
  );
}
const testData={

}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    height: "auto",
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: 'transparent',
    padding: 10,
    // marginHorizontal: 10,
  },

  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0, // Add margin to the left for spacing
    marginBottom: 0, // Add margin to the bottom for spacing
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 6,
    marginRight: 8, // Add margin to the right for spacing
  },
  label: {
    fontSize: 18,
  },
  value: {
    fontSize: 18,
    marginLeft: 'auto', // Push the value to the right
  },
});

// const axis =
// <G transform="translate(4, 100)">
// <Path
//   d={`M 0 0 L ${max_LineChart} 0`}
//   stroke="orange"
//   strokeWidth={2}
// />
// <Path
//   d={`M ${max_LineChart} -2 L ${
//     max_LineChart + 4
//   } 0 L ${max_LineChart} 2`}
//   stroke="orange"
//   strokeWidth={2}
// />
// </G>

// {/* Y-axis */}
// <G transform="translate(4, 100) rotate(-90)">
// <Path d={`M 0 0 L 80 0`} stroke="black" strokeWidth={2} />
// <Path
//   d={`M 80 -2 L 84 0 L 80 2`}
//   stroke="black"
//   strokeWidth={2}
// />
// </G>
function LineChartInfoRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.container2}>
      <View style={[styles.circle, {backgroundColor: color}]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>$ {value.toLocaleString('en-US')}</Text>
    </View>
  );
}

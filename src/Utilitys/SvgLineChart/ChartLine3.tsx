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
  Marker, 
  Polygon,
  Circle,
  TSpan,
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
const a = (width - 40)/200;
const ratioScreen = (width - 40)/300  // default : w = h = 300. it means the initial value is 1. ratioScreen < (width - 60) / 300
const widthSvg = 300*ratioScreen;
const heightSvg = 200*ratioScreen;
// console.log('w', widthSvg,"h", heightSvg, a);

const marginLeftSvg = 6;
const buyColor = "rgb(7,168,33)";
const sellColor = "rgb(248,23,23)";
const currentColor = "rgb(12,131,241)";
const comlumnStrokewidth = 12;
const circleRadius = 10;

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
      endTime?: string | "--/--",
      priceNow?: number | 0
    };
    price: number
  }

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(Text);
export default function ChartLine3({lineChart, price}: ChartLineProps) {
    // extractor data from the props.
    const totalSold = lineChart.sold;
    const totalInvested = lineChart.invested;
    const totalCurrent = lineChart.current;
    let priceNow: number = price || 0;

    //Calculate the length of column.
    let buyLength = 0;
    let sellLength = 0;
    let currentLength = 0;
    let maxHeightColumn = heightSvg * 0.85;
    const svgGridColumn = 3.7;
    let profit = ((totalCurrent + totalSold) - totalInvested);
    let totalNow = totalCurrent + totalSold;

    // Determins the coordinate for buy column
    let buyStart_X = ((widthSvg - marginLeftSvg) / svgGridColumn) + marginLeftSvg;
    let buyStart_Y = heightSvg;
    let buyEnd_X = buyStart_X;
    let buyEnd_Y = 0;

    // Determins the coordinate for sell column
    let sellStart_X = ((widthSvg - marginLeftSvg) / svgGridColumn)*2 + marginLeftSvg;
    let sellStart_Y = heightSvg;
    let sellEnd_X = sellStart_X;
    let sellEnd_Y = 0;
    // Determins the coordinate for current column
    let currentStart_X = ((widthSvg - marginLeftSvg)/ svgGridColumn)*2 + marginLeftSvg;
    let currentStart_Y = 0;
    let currentEnd_X = currentStart_X;
    let currentEnd_Y = 0;
    if(profit < 0) {
        // profit < 0, it means the totalinvested grater than (current + sold). So invested column is max.
        buyLength = maxHeightColumn;
        buyEnd_Y = heightSvg - maxHeightColumn;

        const maxLength_Sold_Current = ((totalSold + totalCurrent) / totalInvested) * maxHeightColumn
        sellLength = (totalSold /(totalSold + totalCurrent)) * maxLength_Sold_Current ;
        currentLength = (totalCurrent /  (totalSold + totalCurrent)) * maxLength_Sold_Current;

        sellEnd_Y = heightSvg - sellLength;
        currentStart_Y = sellEnd_Y;
        currentEnd_Y = heightSvg  - maxLength_Sold_Current;

    } else if(profit > 0 || profit === 0) {
        let maxLength_Sold_Current = maxHeightColumn;
        // if(priceNow > lineChart.averageBoughtPrice){
        //     const valuePerUnit = (totalCurrent + totalSold) / maxLength_Sold_Current;
        //     const increaseValue = priceNow * lineChart.quantityHold - lineChart.invested;
        //     const inscreaseUnits = increaseValue / valuePerUnit;
        //     maxLength_Sold_Current += inscreaseUnits;
        //     if(maxLength_Sold_Current > heightSvg){
        //       maxLength_Sold_Current = maxLength_Sold_Current;
        //     }
        // }
        sellLength = (totalSold /(totalSold + totalCurrent)) * maxLength_Sold_Current ;
        currentLength = (totalCurrent /  (totalSold + totalCurrent)) * maxLength_Sold_Current;

        sellEnd_Y = heightSvg - sellLength;
        currentStart_Y = sellEnd_Y;
        currentEnd_Y = heightSvg  - maxLength_Sold_Current;

        buyLength = (totalInvested / (totalSold + totalCurrent)) * maxLength_Sold_Current;
        buyEnd_Y = heightSvg - buyLength;

    } else if (profit === 0){

    }

/**
 -- profit > 0
 */
    // Create the line to connect the origin Axis to these point column.
    // The origin Axis (${marginLeftSvg} ${heightSvg})
    const lineColor = "rgb(255,144,41)";
    const lineStrokeWidth = 4;

    const line1_Control_1_X = buyStart_X * 0.1; //  must to =< 0.5.
    const line1_Control_1_Y = buyStart_Y;
    const line1_Control_2_X = buyEnd_X * 0.5; //  must to >= 0.5.
    const line1_Control_2_Y = buyEnd_Y;
    let line_1 = `M ${marginLeftSvg} ${heightSvg} 
                C ${line1_Control_1_X} ${line1_Control_1_Y} ${line1_Control_2_X} ${line1_Control_2_Y}
                ${buyEnd_X} ${buyEnd_Y}`;

    const line2_Control_1_X = (currentEnd_X - buyEnd_X) * 0.5 + buyEnd_X; //  must to =< 0.5.
    const line2_Control_1_Y = buyEnd_Y;
    const line2_Control_2_X = (currentEnd_X - buyEnd_X) * 0.5 + buyEnd_X; //  must to >= 0.5.
    const line2_Control_2_Y = currentEnd_Y;
    let line_2 = `M ${buyEnd_X} ${buyEnd_Y} 
                C ${line2_Control_1_X} ${line2_Control_1_Y} 
                ${line2_Control_2_X} ${line2_Control_2_Y}
                ${currentEnd_X} ${currentEnd_Y} `;
    
    // In the first, we need to determine the box for currentCircle and the circle for arrow.            
    const widthRect = 30;
    const heightRect = 15;
    // line3 for profit < 0;
    const line3_Control_1_X = currentEnd_X + widthRect/2;
    const line3_Control_1_Y = currentEnd_Y;
    const line3_Control_2_X = currentEnd_X + widthRect/2;
    const line3_Control_2_Y = profit < 0 ? (currentEnd_Y + heightRect)  :(currentEnd_Y - heightRect);  
    const line3_endX = currentEnd_X + widthRect;        
    const line3_endY = profit < 0 ? (currentEnd_Y + heightRect)  :(currentEnd_Y - heightRect);  
    
    // If you want to make the end point has straight orient, you should set control_2's value has the same point of the end
    let line_3 = `M ${currentEnd_X} ${currentEnd_Y} 
                C ${line3_Control_1_X} ${line3_Control_1_Y} ${line3_endX} ${line3_endY}
                ${line3_endX} ${line3_endY}`;
    // Calculate length text.
    let lengthText = 0;
    if (abs(profit) < 100) {
      lengthText = 70;
    } else if (abs(profit) < 1000) {
      lengthText = 80;
    } else if (abs(profit) < 10000) {
      lengthText =90;
    } else if (abs(profit) < 100000) {
      lengthText = 100;
    } else if (abs(profit) < 1000000) {
      lengthText = 110;
    } else if (abs(profit) < 10000000) {
      lengthText = 120;
    } 
    const offsetText =100 - (lengthText / (widthSvg - marginLeftSvg))*100;

    let lengthText3 = 0;
    if (abs(totalNow) < 100) {
      lengthText3 = 65;
    } else if (abs(totalNow) < 1000) {
      lengthText3 = 75;
    } else if (abs(totalNow) < 10000) {
      lengthText3 =85;
    } else if (abs(totalNow) < 100000) {
      lengthText3 = 100;
    } else if (abs(totalNow) < 1000000) {
      lengthText3 = 110;
    } else if (abs(totalNow) < 10000000) {
      lengthText3 = 125;
    } 
    const offsetText3 = 100 - (lengthText3 / (widthSvg ))*100;

    let priceshow = "";
    let lengthText2 = 70;
    if (abs(priceNow) < 0.01) {
      lengthText2 = 70; // 0.005
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 3})
    } else if (abs(priceNow) < 0.1) {
      lengthText2 = 60; // 0.05
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 2})
    } else if (abs(priceNow) < 1) {
      lengthText2 =60; // 0.58
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 2})
    } else if (abs(priceNow) < 10) {
      lengthText2 = 60; // 5.58
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 2})
    } else if (abs(priceNow) < 100) {
      lengthText2 = 70; // 17.58
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 2});
    } else if (abs(priceNow) < 1000) {
      lengthText2 = 70; // 325.5
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 1})
    } else if (abs(priceNow) < 10000) {
      lengthText2 = 80; // 1325.5
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 1})
    } else if (abs(priceNow) < 100000) {
      lengthText2 = 90; // 23325.5
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 1})
    }else if (abs(priceNow) < 0.001) {
      lengthText2 = 90; // 0.0005
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 4});
    }
    else if (abs(priceNow) < 0.0001) {
      lengthText2 = 90; // 0.00005
      priceshow = priceNow.toLocaleString('en-Us',{maximumFractionDigits: 5})
    }
    const offsetText2 = 100 - (lengthText2 / (widthSvg))*100;
  return (
    <View style={styles.container}>
      <Text style={styles.coinName}>BTC</Text>
      <View style={styles.svgContainer}>
        <Svg width={widthSvg} height={heightSvg} viewBox={`0 0 ${widthSvg} ${heightSvg}`}>
            <Defs>
                <Marker
                    id="smallTriangle"
                    refX="0"
                    refY="3"
                    markerUnits="userSpaceOnUse"
                    markerWidth="4"
                    markerHeight="3"
                    orient="auto"           
                >
                    <Path d="M 0 0 L 6 3 L 0 6 z" />
                </Marker>
                <Marker
                    id="smallTriangle2"
                    refX="0"
                    refY="3"
                    markerUnits="userSpaceOnUse"
                    markerWidth="4"
                    markerHeight="3"
                    orient="auto"           
                >
                    <Path d="M 0 0 L 6 3 L 0 6 z" stroke={lineColor} fill={lineColor} strokeWidth={lineStrokeWidth}/>
                </Marker>
                <Marker 
                  id='origin-axis' 
                  markerUnits="userSpaceOnUse"
                  orient="auto"  
                  refX="3"
                  refY="3"   
                  markerWidth="3"
                  markerHeight="3"
                >
                  <Circle cx={3} cy={3} r={3} fill='gray'/>
                </Marker>
                <Path 
                  id='path-go-up-down'
                  d={`M ${marginLeftSvg} ${currentEnd_Y} L ${widthSvg - marginLeftSvg} ${currentEnd_Y}`}
                  stroke="gray"
                  strokeDasharray={(widthSvg - marginLeftSvg) / 50}
                />
                <Path 
                  id='path-go-up-down2'
                  d={`M ${marginLeftSvg} ${currentEnd_Y} L ${widthSvg - marginLeftSvg} ${currentEnd_Y}`}
                  stroke="gray"
                  strokeDasharray={(widthSvg - marginLeftSvg) / 50}
                />
                <Path 
                  id='path-go-up-down3'
                  d={`M ${marginLeftSvg} ${currentEnd_Y} L ${widthSvg - marginLeftSvg} ${currentEnd_Y}`}
                  stroke="gray"
                  strokeDasharray={(widthSvg - marginLeftSvg) / 50}
                />
                <Path 
                  id='path-invested-value'
                  d={`M ${marginLeftSvg} ${buyEnd_Y} L ${buyEnd_X} ${buyEnd_Y}`}
                  strokeDasharray={(buyEnd_X - marginLeftSvg)/ 12}
                />
            </Defs>

            {/* Draw Axis x-y */}
            <Path d={`M ${marginLeftSvg} ${heightSvg} L ${marginLeftSvg} 6`} stroke="gray" strokeWidth={2} markerEnd="url(#smallTriangle)" />
            <Path d={`M ${marginLeftSvg} ${heightSvg} L ${widthSvg} ${heightSvg}`} stroke="gray" strokeWidth={4} />

            {/* Draw column and circle */}
            {/* I have to put the line in the top to hide the line back the circle of column */}
            <Path d={line_1} stroke={lineColor} strokeWidth={lineStrokeWidth} fill="transparent" />
            <Path d={line_2} stroke={lineColor} strokeWidth={lineStrokeWidth} fill="transparent"/>
            <Path d={line_3} stroke={lineColor} strokeWidth={lineStrokeWidth} fill="transparent" markerEnd="url(#smallTriangle2)" />

            <Path d={`M ${buyStart_X} ${buyStart_Y} L ${buyEnd_X} ${buyEnd_Y}`} stroke={buyColor} strokeWidth={comlumnStrokewidth}/>
            <Circle x={buyEnd_X} y={buyEnd_Y} r={circleRadius} fill={buyColor}/>

            <Path d={`M ${currentStart_X} ${currentStart_Y} L ${currentEnd_X} ${currentEnd_Y}`} stroke={currentColor} strokeWidth={comlumnStrokewidth} />
            <Circle x={currentEnd_X} y={currentEnd_Y} r={circleRadius} fill={currentColor}/>

            <Path d={`M ${sellStart_X} ${sellStart_Y} L ${sellEnd_X} ${sellEnd_Y}`} stroke={sellColor} strokeWidth={comlumnStrokewidth} strokeLinecap='round'/>
            {/* <Circle x={sellEnd_X} y={sellEnd_Y} r={circleRadius} fill={sellColor}/> */}
            <SvgText id='text1'>
              <TextPath href="#path-go-up-down" startOffset={`${offsetText}%`}>
                <TSpan dy={25} fontSize={20} fill={profit > 0 ? "green" : "red"}>
                  {profit > 0 ? (`+$${(profit.toLocaleString('en-Us',{maximumFractionDigits: 1}))}`) 
                  : (`-$${(abs(profit)).toLocaleString('en-Us',{maximumFractionDigits:1})}`)}

                  {/* ${(totalCurrent + totalSold).toLocaleString("en-Us",{maximumFractionDigits:1, minimumFractionDigits:1})} */}
                </TSpan>
              </TextPath>
            </SvgText>
            <SvgText id='text2' >
              <TextPath href="#path-go-up-down2" startOffset={`${offsetText2}%`}>
                <TSpan dx={0} y={-10} fontSize={20} fill={profit > 0 ? "green" : "red"}>
                  ${priceshow}
                </TSpan>
              </TextPath>
            </SvgText>
            {/* <SvgText x={marginLeftSvg + 5} y={buyEnd_Y -10} fontSize={20} fill={"orange"}>
              ${(totalInvested/1000).toFixed(1)}k
            </SvgText> */}
            <SvgText x={marginLeftSvg + 5} y={buyEnd_Y - 10} fontSize={20} fill={lineColor}>
              ${(lineChart.averageSoldPrice).toLocaleString("en-Us",{maximumFractionDigits:2, minimumFractionDigits:1})}
            </SvgText>

            <Use href='url(#path-go-up-down3)'/>
            <Use href='url(#path-invested-value)' stroke={lineColor}/>
        </Svg>
      </View>
      <View style={{width:"60%", marginBottom:10}}>
        <LineChartInfoRow
          color="rgb(9, 134, 40)"
          label="Invested"
          value={lineChart.invested}
        />
        <LineChartInfoRow
          color="rgb(233, 73, 68)"
          label="Sold"
          value={lineChart.sold}
        />
        <LineChartInfoRow
          color="rgb(13, 139, 197)"
          label="Current"
          value={(totalCurrent).toLocaleString('en-US',{maximumFractionDigits:1})}
        />
      </View>
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
      <View style={{ 
        borderColor:'gray', 
        width:widthSvg, 
        height:360, 
        alignItems:'center',
        borderRadius:10, 
        overflow:"hidden",
        borderWidth:1}}
      >
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
          <Text style={{flex:0.5, textAlign:'right',fontSize:18, paddingRight:30, color: profit > 0 ? "green" : "red"}}>
            {profit > 0 ? (`+$${profit.toLocaleString("en-Us",{maximumFractionDigits:1, minimumFractionDigits:1})}`) : 
            (`-$${profit.toLocaleString("en-Us",{maximumFractionDigits:1, minimumFractionDigits:1})}`)}
          </Text>

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
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        height: "auto",
        backgroundColor:"white",
        borderRadius: 15,
        minHeight: 400,
        alignItems: "center",
        padding: 10,
        marginVertical: 10,
        borderWidth:1,

    },
    coinName:{
        fontSize: 24,
        fontWeight:"500",
        color:"black",
    },
    svgContainer:{
        // borderWidth: 1,
        // paddingHorizontal:10,
        // paddingVertical:10,
        marginVertical: 10,    
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
function LineChartInfoRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number | string;
}) {
  return (
    <View style={styles.container2}>
      <View style={[styles.circle, {backgroundColor: color}]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>$ {value.toLocaleString('en-US')}</Text>
    </View>
  );
}

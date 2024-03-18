import { View, Text, Dimensions, ScrollView  } from 'react-native'
import React, {useState, Fragment} from 'react'
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
    TSpan,
    Circle,
    Polyline,
    Polygon
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
  import {useTheme} from '@react-navigation/native';
import ChartLine from './ChartLine';
import ChartLine2 from './ChartLine2';
import ChartLine3 from './ChartLine3';

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  const {width, height} = Dimensions.get("screen");

  interface SvgLinChartProps {
    dataChart: DataAssets[];
  }
export default function SvgLineChart({dataChart} : SvgLinChartProps) {
    const {colors} = useTheme();
    const [chartFrame, setChartFrame] = useState<string>('')
    
    const getAreaPrice = CreateAreaPrice2(dataChart);
    const textWidth = getAreaPrice.textLength * 9;
    const arrayAreaDate = CreateAreaDate(dataChart,chartFrame);
    // const [textWidth, setTextWidth] = useState(0);

    
    const svgHeight = 203 - 28;
    const spaceLine = 40;
    const svgSpaceLine =  svgHeight / 4;
    const startPointY = (svgHeight * 2) / 3;
    const endPointY = (svgHeight * 1) / 3 ;
    const maxX = width - textWidth - 5 - 30; // 30 is padding screen
    const maxEndPointX = maxX - 10;
    const xRangeBetweenTwoPoint = maxEndPointX / 6;

    // control width for svg when we have big data.
    const totalPointDatas = dataChart.length;
    const svgMaxWidth = width + (totalPointDatas - 7) * xRangeBetweenTwoPoint ;
    // console.log('svgMaxWidth', svgMaxWidth, "width", width);

    function CreatePairCoordinateForValue ( ) {
        // The height for a space
        const arrayValue = CreateArrayValue(dataChart);
        const arrayYCoordinate = arrayValue.map((value, i) => {
            const priceRange =  getAreaPrice.priceRange;
            const valueRatio =  (getAreaPrice.arrayAreaPrice[1]- value) / priceRange;
            const yForThisValue =  valueRatio * svgSpaceLine  + svgSpaceLine;
            return yForThisValue
        });
        // console.log('arrauyValue', arrayValue);
        const arrayCoordinate = [] ;
        for(let i = 0; i < arrayYCoordinate.length; i++){
            const xCoordinate = i * xRangeBetweenTwoPoint + 5;
            arrayCoordinate.push({x:xCoordinate, y: arrayYCoordinate[i]})
        }
        const arrayPairCoordinate = [] ;
        for(let i = 0; i < arrayCoordinate.length; i++){
            if(i + 1 <= arrayCoordinate.length -1){
                const startX = arrayCoordinate[i].x;
                const startY = arrayCoordinate[i].y;
                const endX = arrayCoordinate[i+1].x;
                const endY = arrayCoordinate[i+1].y;
                arrayPairCoordinate.push({"startX": startX, "startY": startY, "endX": endX, "endY": endY})    
            }
            
        }
        return {
            "arrayPairCoordinate": arrayPairCoordinate,
            "arrayCoordinate": arrayCoordinate
        };
    }
    const dataCoordinate =  CreatePairCoordinateForValue();
    const arrayCoordinate = dataCoordinate.arrayCoordinate;
    const arrayPairCoordinate = dataCoordinate.arrayPairCoordinate;

    function DrawSmoothLine () {
        const listLines = arrayPairCoordinate.map((coordinate, i) => {
            const startX = coordinate.startX;
            const startY = coordinate.startY;
            const endX = coordinate.endX;
            const endY = coordinate.endY;
            const startEndDistance = endX - startX;
            const smoothRatio = 0.5
            const line_Control_1_X = startX + startEndDistance * smoothRatio; //  must to =< 0.5.
            const line_Control_1_Y = startY;
            const line_Control_2_X = endX - startEndDistance * smoothRatio; //  must to >= 0.5.
            const line_Control_2_Y = endY;
            
            let line = `M ${arrayCoordinate[i].x} ${arrayCoordinate[i].y} 
                    C ${line_Control_1_X} ${line_Control_1_Y} ${line_Control_2_X} ${line_Control_2_Y}
                    ${endX} ${endY}`;
            return line;
        })

        return listLines;
    }
    const getLineSmooth = DrawSmoothLine();
    function DrawArea (){
        const startAreaX = 0 + 5;
        const startAreaY = svgHeight;
        const nearLastPointX = width ;
        const nearLastPointY = svgHeight;
        const endAreaX = 0 + 5 ;
        const endAreaY = svgHeight;
        const lastPointInArray = arrayCoordinate[arrayCoordinate.length - 1];

        const pathData = `
            M ${startAreaX},${startAreaY} 
            ${arrayCoordinate
            .map(point => `L ${point.x},${point.y}`)
            .join(' ')} 
            L ${lastPointInArray.x} ${nearLastPointY}
            L ${endAreaX},${endAreaY} Z`;
        return pathData;
    }

    const pathArea = DrawArea()


  return (
    <ScrollView style={{marginTop: 100,}} showsVerticalScrollIndicator={false} nestedScrollEnabled>
      {/* Create background for the chart */}
      <View 
      style={{ borderWidth: 1, borderColor:'gray', height: 400}} 

      >
           <ScrollView
          style={{ position: "absolute", borderWidth: 1, borderColor:'gray', height: 400, marginLeft:textWidth + 5,zIndex:5 }}
          horizontal
          showsHorizontalScrollIndicator
          contentContainerStyle={{
            width: svgMaxWidth,
          }}
          >
            
              <Svg 
                width={svgMaxWidth} height={svgHeight} 
                // viewBox={`0 0 ${maxEndPointX} ${svgHeight}`}
                style={{ zIndex:5, marginTop:85, marginLeft: 10}}
              >              
                {
                    arrayPairCoordinate.map((coordinate, i) => {
                        const startX = coordinate.startX;
                        const startY = coordinate.startY;
                        const endX = coordinate.endX;
                        const endY = coordinate.endY;
                        return (
                            <AnimatedPath
                                key={i}
                                d={`M ${startX} ${startY} L ${endX} ${endY}`}
                                strokeLinejoin="round"
                                // stroke="rgb(11, 187, 35)"
                                stroke={colors.secondary}
                                strokeWidth={3}
                                
                            />
                        )
                    })
                }
                <Path d={pathArea} stroke={"none"} strokeWidth={0} 
                fill={'none'}
                // fill={"#f7f49c"} 
                />
                {/* {getLineSmooth.map((line, j) => {
                    return (
                        <Path key={j} d={line} stroke={colors.secondary} strokeWidth={2} fill="transparent" />
                    )
                })} */}
                {arrayCoordinate.map((coordinate, j) => {
                    return(
                        <Circle 
                            key={j}
                            cx={coordinate.x} 
                            cy={coordinate.y} 
                            r={3} 
                            fill={"white"} 
                            strokeWidth={1.5} 
                            stroke={colors.secondary}
                        />
                    )
                })}
              </Svg>
              <View style={{
                zIndex: 10, position: 'absolute', top: 0, left: 0, marginTop: svgHeight + 86, width: svgMaxWidth,
                display:'flex', flexDirection:'row',}}>
                {arrayAreaDate?.map((date, j) => {
                    return(
                            <Text style={{fontSize:12, width: xRangeBetweenTwoPoint*2}} key={j}>{date}</Text>
                    )
                })}
                </View>
          </ScrollView>
          <View style={{marginTop:20, flex:1}}>
            {getAreaPrice.arrayAreaPrice.map((areaPrice: number, i: number) => {
    
                return (
                    <View key={i} style={{ marginTop: i === 0 ? 0 : 40, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ marginRight: 5, fontSize: 12, width: textWidth , textAlign: 'right' }}>{areaPrice}</Text>
                        <View style={{ height: 1, backgroundColor: '#e0e0de', flex: 1 }} />
                    </View>
                )
            })}
            {/* <View style={{display:'flex', flexDirection:'row',marginLeft: textWidth + 5, justifyContent:'space-between'}}>
                {arrayAreaDate?.map((date, j) => {
                    return(
                        <View key={j}>
                            <Text style={{fontSize:12}}>{date}</Text>
                        </View>
                    )
                })}
            </View> */}
          </View>
      </View>


      {/* <ChartLine lineChart={investStatus}/>
      <ChartLine2 lineChart={investStatus}/> */}
      {/* <ChartLine3 lineChart={investStatus} price={28000}/> */}
    </ScrollView>
  )
}

interface DataAssets {
    date: string,
    value: number
}
function FindMinMaxInArray (data: DataAssets[]) {
    const result = data.reduce(
        (acc, curr) => {
          // Find minimum value
          acc.min = Math.min(acc.min, curr.value);
    
          // Find maximum value
          acc.max = Math.max(acc.max, curr.value);
    
          return acc;
        },
        { min: Infinity, max: -Infinity }
      );
    
      return [result.min, result.max];
}
function CreateAreaPrice (dataChart: DataAssets[]) {
    const [minValue, maxValue] = FindMinMaxInArray(dataChart);
    const lowestAreaPrice = +(minValue - (maxValue - minValue)).toFixed(2);
    const heighestAreaPrice = +(maxValue + (maxValue - minValue)).toFixed(2);
    const arrayAreaLowToHeight = [lowestAreaPrice, minValue, maxValue, heighestAreaPrice];
    const arrayAreaHeightToLow = [heighestAreaPrice, maxValue, minValue, lowestAreaPrice];
    const heighestAreaPriceString = heighestAreaPrice.toString();
    const heighestAreaPriceLength = heighestAreaPriceString.length;
    const priceRange = maxValue - minValue;
    return {
        "arrayAreaPrice": arrayAreaHeightToLow,
        "textLength": heighestAreaPriceLength,
        "priceRange": priceRange
    }
}
function CreateAreaPrice2 (dataChart: DataAssets[]) {
    const [minValue, maxValue] = FindMinMaxInArray(dataChart);
    let rangeBetweenMinMax = 0;
    let averageAreaPrice = 0;
    if(minValue < 0 && maxValue > 0){
        // if(Math.abs(minValue) < Math.abs(maxValue))
        rangeBetweenMinMax = (maxValue + (0 - minValue))/2 ; 
        averageAreaPrice = +(maxValue - rangeBetweenMinMax).toFixed(2);
    } else if ( minValue > 0 && maxValue > 0){
        rangeBetweenMinMax = maxValue - minValue;
        averageAreaPrice = +(rangeBetweenMinMax / 2).toFixed(2);
        
    } else if ( minValue < 0 && maxValue < 0){
        rangeBetweenMinMax = +(-(Math.abs(maxValue) - Math.abs(minValue))).toFixed(3);
        averageAreaPrice = rangeBetweenMinMax / 2;
    }
    const lowestAreaPrice = +(minValue - averageAreaPrice).toFixed(2);
        const heighestAreaPrice = +(maxValue + averageAreaPrice).toFixed(2);
        const arrayAreaLowToHeight = [lowestAreaPrice, minValue, maxValue, heighestAreaPrice];
        const arrayAreaHeightToLow = [heighestAreaPrice,  maxValue, averageAreaPrice ,minValue, lowestAreaPrice];
        const heighestAreaPriceString = heighestAreaPrice.toString();
        const heighestAreaPriceLength = heighestAreaPriceString.length;
        const priceRange = maxValue - minValue;
        console.log('averageAreaPrice',averageAreaPrice);
        console.log('arrayAreaHeightToLow', arrayAreaHeightToLow);
        return {
            "arrayAreaPrice": arrayAreaHeightToLow,
            "textLength": heighestAreaPriceLength,
            "priceRange": priceRange
        }
    
}
function CreateAreaDate (dataChart: DataAssets[], dateMode: string) {
    let arrayDate = null;
    if( dateMode === '7D'){
        // arrayDate = [dataChart[0].date, dataChart[2].date, dataChart[4].date, dataChart[6].date];
        const getArrayDate = [dataChart[0].date, dataChart[2].date, dataChart[4].date, dataChart[6].date];
        arrayDate = getArrayDate.map(dateString => dateString.slice(0, -5));
    } else {
        const getArrayDate = [];
        for( let i = 0 ; i < dataChart.length ; i++){
            if(i === 0) {
                getArrayDate.push(dataChart[0].date)
            } else if ( i % 2 === 0 ){
                getArrayDate.push(dataChart[i].date)
            } else {
                // do nothoing
            }
        }
        arrayDate = getArrayDate.map(dateString => dateString.slice(0, -5));
    }
    console.log('arrayDate', arrayDate);
    return arrayDate;
}

function CreateArrayValue(dataChart: DataAssets[]) {
    const arrayValue = []
    for(let i = 0; i < dataChart.length ; i++){
        arrayValue.push(dataChart[i].value)
    }
    return arrayValue;
  }

const dataForTest: DataAssets[] = [
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
const investStatus = {
    invested: 4200000,
    current: 1000000,
    sold: 1800000,
    mode: 'Trading',
    coinSymbol: 'BTC',
    quantityHold: 100,
    averageBoughtPrice: 23000.5,
    averageSoldPrice: 10,
    startTime: '12/10/2023',
    endTime: '13/10/2023',
    priceNow: 1.05,
  };


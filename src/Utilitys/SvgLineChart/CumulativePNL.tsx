import {
    View,
    Text,
    Dimensions,
    ScrollView,
    PanResponder,
    Platform,
  } from 'react-native';
  import React, {useState, Fragment, useEffect} from 'react';
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
    Polygon,
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
  import {
    TouchableOpacity,
    TouchableWithoutFeedback,
  } from 'react-native-gesture-handler';
  
  const AnimatedPath = Animated.createAnimatedComponent(Path);
  const AnimatedLine = Animated.createAnimatedComponent(Line);
  const AnimatedText = Animated.createAnimatedComponent(Text);
  const {width, height} = Dimensions.get('screen');
  
  interface SvgLinChartProps {
    dataChart: DataAssets[];
    dataBTCTrend: DataAssets[];
  }
  
  export default function CumulativePNL({dataChart, dataBTCTrend}: SvgLinChartProps) {
    const {colors} = useTheme();
    const [chartFrame, setChartFrame] = useState<string>('7');

    // Handle BTC trend data.
    const getAreaPriceBTC = CreateAreaPrice2(dataBTCTrend);
    const arrayAreaBTCPrice = getAreaPriceBTC.arrayAreaPrice;
    const textBTCWidth = getAreaPriceBTC.textLength * 5;
  
    // Handle cumulative PNL data.
    const getAreaPrice = CreateAreaPrice2(dataChart);
    const textWidth = getAreaPrice.textLength * 8;
    const arrayAreaDate = CreateAreaDate(dataChart, chartFrame);
  
    const svgHeight = 233;
    const spaceLine = 40;
    const svgSpaceLine = svgHeight / 4;
    const startPointY = (svgHeight * 2) / 3;
    const endPointY = (svgHeight * 1) / 3;
    const svgMarginLeftInsideScrollView = 10;
    const maxX = width - textWidth - 10 - 5 - 30 - textBTCWidth; // 30 is padding screen; 10 svgMarginLeftInsideScrollView; 5 is marginLeft of scrollView that contain Svg.
    const maxEndPointX = maxX; // 10 is marginLeft inside of svg;
    const distanceFromLeftScrenToFirstPoint = textWidth + 30 / 2 + 5 + 10; // Why do we need this variable? Because the position "x" that count from left of the screen.
  
    const totalPointDatas = dataChart.length;
    const totalPointCanSeeOnAScreen = totalPointDatas > 10 ? 10 : totalPointDatas + 1;
    const totalLineCanSeeOnAScreen = totalPointCanSeeOnAScreen - 1;
    const xRangeBetweenTwoPoint = maxEndPointX / totalLineCanSeeOnAScreen;
  
    // in svg you cannot use margin to make the point go inside the svg.
    // If you draw somthing near the border of svg, its shape will be lost hafl. You have to draw the x value to left a little distance.
    // I set its size equal hafl of the max textWidth / 2. OMG! If I change this value I have change the width of svg, any more.
    const handleLostSpaceInSvg = 0;

    
    // control width for svg when we have big data.
    const numberOfSvgWindowNeeds = Math.floor(totalPointDatas / totalPointCanSeeOnAScreen) + 1;
    const svgMaxWidth = maxEndPointX * numberOfSvgWindowNeeds + 20;

    
  
    function CreatePairCoordinateForValue(dataInput: DataAssets[], getAreaPrice: any) {
      // The height for a space
      const arrayValue = CreateArrayValue(dataInput);
      const arrayYCoordinate = arrayValue.map((value, i) => {
        const priceRange = getAreaPrice.priceRange;
        const valueRatio = (getAreaPrice.arrayAreaPrice[1] - value) / priceRange;
        // Wwhy valueRatio * svgSpaceLine*2 needs to times with 2. because the range price from max to min
        // that occupied 2 svgSpaceLine.
        // Why "+ svgSpaceLine*1" because it will make empty space in top and bottom
        const yForThisValue = valueRatio * svgSpaceLine * 2 + svgSpaceLine * 1;
        return yForThisValue;
      });
      // console.log('arrauyValue', arrayValue);
      const arrayCoordinate = [];
      for (let i = 0; i < arrayYCoordinate.length; i++) {
        const xCoordinate = i * xRangeBetweenTwoPoint + 5;
        arrayCoordinate.push({x: xCoordinate, y: arrayYCoordinate[i]});
      }
      const arrayPairCoordinate = [];
      for (let i = 0; i < arrayCoordinate.length; i++) {
        if (i + 1 <= arrayCoordinate.length - 1) {
          const startX = arrayCoordinate[i].x;
          const startY = arrayCoordinate[i].y;
          const endX = arrayCoordinate[i + 1].x;
          const endY = arrayCoordinate[i + 1].y;
          arrayPairCoordinate.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
          });
        }
      }
      return {
        arrayPairCoordinate: arrayPairCoordinate,
        arrayCoordinate: arrayCoordinate,
      };
    }
    const dataCoordinate = CreatePairCoordinateForValue(dataChart, getAreaPrice);
    const arrayCoordinate = dataCoordinate.arrayCoordinate;
    const arrayPairCoordinate = dataCoordinate.arrayPairCoordinate;

    const dataCoordinateBTC = CreatePairCoordinateForValue(dataBTCTrend, getAreaPriceBTC);
    const arrayCoordinateBTC = dataCoordinateBTC.arrayCoordinate;
    const arrayPairCoordinateBTC = dataCoordinateBTC.arrayPairCoordinate;
    console.log('arrayPairCoordinateBTC',arrayPairCoordinateBTC);
  
    function DrawSmoothLine() {
      const listLines = arrayPairCoordinate.map((coordinate, i) => {
        const startX = coordinate.startX;
        const startY = coordinate.startY;
        const endX = coordinate.endX;
        const endY = coordinate.endY;
        const startEndDistance = endX - startX;
        const smoothRatio = 0.5;
        const line_Control_1_X = startX + startEndDistance * smoothRatio; //  must to =< 0.5.
        const line_Control_1_Y = startY;
        const line_Control_2_X = endX - startEndDistance * smoothRatio; //  must to >= 0.5.
        const line_Control_2_Y = endY;
  
        let line = `M ${arrayCoordinate[i].x} ${arrayCoordinate[i].y} 
                      C ${line_Control_1_X} ${line_Control_1_Y} ${line_Control_2_X} ${line_Control_2_Y}
                      ${endX} ${endY}`;
        return line;
      });
  
      return listLines;
    }
    const getLineSmooth = DrawSmoothLine();
    function DrawArea() {
      const startAreaX = 0 + 5;
      const startAreaY = svgHeight;
      const nearLastPointX = width;
      const nearLastPointY = svgHeight;
      const endAreaX = 0 + 5;
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
    const pathArea = DrawArea();
  
    const [scrollChart, setScrollChart] = useState<boolean>(true);
    const [dragged, setDragged] = useState(false);
    const [position, setPosition] = useState<{x: number; y: number}>({x: -10,y: -10,});
  
    const panResponder3 = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => true,
  
      onPanResponderGrant: (evt, gestureState) => {
        // Set a timeout to simulate a hold
        if (Platform.OS === 'ios') {
          console.log('grant', gestureState.dx);
          setPosition({x: gestureState.moveX, y: gestureState.moveY});
        }
      },
  
      onPanResponderMove: (evt, gestureState) => {
        // This is triggered as the user moves their finger
        if (dragged) {
          setPosition({x: gestureState.moveX, y: gestureState.moveY});
        }
      },
      onPanResponderEnd: () => {
        // This is triggered when the user lifts their finger
        setPosition({x: -10, y: -10});
      },
    });
    const [svgBoxScrollX, setSvgBoxScrollX] = useState<number>(0);
    const handleScroll = (event: any) => {
      const {contentOffset} = event.nativeEvent;
      setSvgBoxScrollX(contentOffset.x);
    };
  
    const [pressDuration, setPressDuration] = useState(0);
    const [timeoutId, setTimeoutId] = useState<any>(null);
  
    const handlePressIn = () => {
      // Set a timeout for 1 second
      const id = setTimeout(() => {
        setPressDuration(2);
        setDragged(true);
        setScrollChart(false);
      }, 300);
  
      // Store the timeout ID in a state variable
      setTimeoutId(id);
  
      // Update the press duration
      setPressDuration(1);
    };
  
    const handlePressOut = () => {
      // Clear the timeout when the press is released
      clearTimeout(timeoutId);
  
      // Reset press duration
      setPressDuration(0);
      setDragged(false);
      setScrollChart(true);
    };
    // useEffect(()=>{
    //   console.log('drag', dragged, 'postion', position.x, 'svgBox', svgBoxScrollX);
  
    // },[dragged, scrollChart, position, svgBoxScrollX]);

    
    return (
      <ScrollView
        style={{marginTop: 0}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        nestedScrollEnabled
      >
        {/* Create background for the chart */}
        {/* <Text>Press Duration: {pressDuration}</Text> */}
        <View style={{ paddingBottom: 20}}>
          <ScrollView
            style={{
              position: 'absolute',
              height: 400,
              marginLeft: textWidth + 5,
              zIndex: 5,
              marginRight: textBTCWidth,
            }}
            horizontal
            scrollEnabled={scrollChart}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator
            contentContainerStyle={{
              width: svgMaxWidth,
            }}
            contentOffset={{ x: svgMaxWidth, y: 0 }} // Set initial position to 4 times screen width
          >
            <View {...panResponder3.panHandlers}>
              <TouchableWithoutFeedback
                onPressOut={handlePressOut}
                onPressIn={handlePressIn}
              >
                <View>
                  <Svg
                    width={svgMaxWidth}
                    height={svgHeight}
                    style={{zIndex: 5, marginTop: 28, marginLeft: 10,}}
                  >
                    <Defs>
                      <LinearGradient id="gradient" x1="1" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="pink" stopOpacity="1" />
                        <Stop offset="1" stopColor="white" stopOpacity="1" />
                      </LinearGradient>
                    </Defs>
                    {arrayPairCoordinate.map((coordinate, i) => {
                      const startX = coordinate.startX + handleLostSpaceInSvg;
                      const startY = coordinate.startY;
                      const endX = coordinate.endX + handleLostSpaceInSvg;
                      const endY = coordinate.endY;
                      return (
                        <AnimatedPath
                          key={i}
                          d={`M ${startX} ${startY} L ${endX} ${endY}`}
                          strokeLinejoin="round"
                          // stroke="rgb(11, 187, 35)"
                          stroke={colors.secondary}
                          strokeWidth={4}
                        />
                      );
                    })}
                    {arrayPairCoordinateBTC.map((coordinate, i) => {
                      const startX = coordinate.startX + handleLostSpaceInSvg;
                      const startY = coordinate.startY;
                      const endX = coordinate.endX + handleLostSpaceInSvg;
                      const endY = coordinate.endY;
                      return (
                        <AnimatedPath
                          key={i}
                          d={`M ${startX} ${startY} L ${endX} ${endY}`}
                          strokeLinejoin="round"
                          // stroke="rgb(11, 187, 35)"
                          stroke={'blue'}
                          strokeWidth={4}
                        />
                      );
                    })}
                    {/* <Path
                      d={pathArea}
                      stroke={'none'}
                      strokeWidth={0}
                      fill="url(#gradient)" 
                      // fill={"#f7f49c"}
                    /> */}
  
                    {/* Draw point */}
                    {arrayCoordinate.map((coordinate, j) => {
                      const getX = coordinate.x + handleLostSpaceInSvg;
                      const getY = coordinate.y;
                      const startY = svgSpaceLine;
                      const endY = svgHeight;
                      const createPath = `M ${getX} ${startY} L ${getX} ${endY}`;
                      const areaWidth = xRangeBetweenTwoPoint / 2 - 1;
  
                      const createArea = `M ${getX - areaWidth} ${startY} L ${getX - areaWidth} ${endY}
                              L ${getX + areaWidth} ${endY} L ${getX + areaWidth} ${startY} L ${getX - areaWidth} ${startY}
                              `;
  
                      const space = xRangeBetweenTwoPoint;
                      // here is value for initial position
                      const initialMinX = 0;
                      const initialMaxX =
                        xRangeBetweenTwoPoint / 2 + svgMarginLeftInsideScrollView;
                      let minX = initialMinX;
                      let maxX = initialMaxX; // 100
                      if (j !== 0) {
                        minX = initialMaxX + space * (j - 1) - svgBoxScrollX;
                        maxX = initialMaxX + space * j - svgBoxScrollX;
                      }
                      // console.log('min', minX, 'max', maxX);
  
                      return (
                        <React.Fragment key={j}>
                          {position.x - distanceFromLeftScrenToFirstPoint >= minX &&
                            position.x - distanceFromLeftScrenToFirstPoint < maxX &&
                            dragged && (
                              <>
                                <Path
                                  d={createPath}
                                  stroke={'gray'}
                                  strokeWidth={2}
                                  fill={'none'}
                                />
                                <Circle
                                  cx={getX}
                                  cy={getY}
                                  r={8}
                                  fill={colors.secondary}
                                />
  
                                {/* This lable will show as coordinate ob=f the point, but we will lost the first point that we cannot see its value. */}
                                {/* <SvgText x={getX - textWidth /2} y={svgSpaceLine * 0.8} fontSize={20}>
                                {dataChart[j].value}
                                </SvgText> */}
  
                                {/* This lable show in center of svg also when svg move. */}
                                <SvgText
                                  x={maxEndPointX * 0.5 - textWidth / 2 +svgBoxScrollX}
                                  y={svgSpaceLine * 0.5}
                                  fontSize={20}
                                >
                                  {dataChart[j].value}
                                </SvgText>
                              </>
                            )}
                          <Circle
                            key={j}
                            cx={getX}
                            cy={getY}
                            r={3}
                            fill={'white'}
                            strokeWidth={1.5}
                            stroke={colors.secondary}
                          />
                          <Path 
                            d={createArea}
                            stroke={'gray'}
                            strokeWidth={0}
                            fill={'none'}
                          />
                        </React.Fragment>
                      );
                    })}
                    {arrayCoordinateBTC.map((coordinate, j) => {
                      const getX = coordinate.x + handleLostSpaceInSvg;
                      const getY = coordinate.y;
                      const startY = svgSpaceLine;
                      const endY = svgHeight;
                      const createPath = `M ${getX} ${startY} L ${getX} ${endY}`;
                      const areaWidth = xRangeBetweenTwoPoint / 2 - 1;
  
                      const createArea = `M ${getX - areaWidth} ${startY} L ${getX - areaWidth} ${endY}
                              L ${getX + areaWidth} ${endY} L ${getX + areaWidth} ${startY} L ${getX - areaWidth} ${startY}
                              `;
  
                      const space = xRangeBetweenTwoPoint;
                      // here is value for initial position
                      const initialMinX = 0;
                      const initialMaxX =
                        xRangeBetweenTwoPoint / 2 + svgMarginLeftInsideScrollView;
                      let minX = initialMinX;
                      let maxX = initialMaxX; // 100
                      if (j !== 0) {
                        minX = initialMaxX + space * (j - 1) - svgBoxScrollX;
                        maxX = initialMaxX + space * j - svgBoxScrollX;
                      }
                      // console.log('min', minX, 'max', maxX);
  
                      return (
                        <React.Fragment key={j}>
                          {position.x - distanceFromLeftScrenToFirstPoint >= minX &&
                            position.x - distanceFromLeftScrenToFirstPoint < maxX &&
                            dragged && (
                              <>
                                {/* <Path
                                  d={createPath}
                                  stroke={'gray'}
                                  strokeWidth={2}
                                  fill={'none'}
                                /> */}
                                <Circle
                                  cx={getX}
                                  cy={getY}
                                  r={8}
                                  fill={'blue'}
                                />
  
                                {/* This lable will show as coordinate ob=f the point, but we will lost the first point that we cannot see its value. */}
                                {/* <SvgText x={getX - textWidth /2} y={svgSpaceLine * 0.8} fontSize={20}>
                                {dataChart[j].value}
                                </SvgText> */}
  
                                {/* This lable show in center of svg also when svg move. */}
                                <SvgText
                                  x={maxEndPointX * 0.5 - textWidth / 2 +svgBoxScrollX}
                                  y={svgSpaceLine * 0.5}
                                  fontSize={20}
                                >
                                  {dataChart[j].value}
                                </SvgText>
                              </>
                            )}
                          <Circle
                            key={j}
                            cx={getX}
                            cy={getY}
                            r={3}
                            fill={'white'}
                            strokeWidth={1.5}
                            stroke={'blue'}
                          />
                          <Path 
                            d={createArea}
                            stroke={'gray'}
                            strokeWidth={0}
                            fill={'none'}
                          />
                        </React.Fragment>
                      );
                    })}
                  </Svg>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                zIndex: 10,
                position: 'absolute',
                top: 0,
                left: 0,
                marginTop: svgHeight + 30,
                width: svgMaxWidth,
                display: 'flex',
                flexDirection: 'row',
              }}>
              {arrayAreaDate?.map((date, j) => {
                return (
                  <Text
                    style={{fontSize: 12, width: xRangeBetweenTwoPoint * 2}}
                    key={j}>
                    {date}
                  </Text>
                );
              })}
            </View>
            <Text>{position.x}</Text>
            <Text>{svgBoxScrollX}</Text>
          </ScrollView>
          <View style={{marginTop: 20, flex: 1}}>
            {getAreaPrice.arrayAreaPrice.map((areaPrice: number, i: number) => {
              return (
                <View
                  key={i}
                  style={{
                    marginTop: i === 0 ? 0 : spaceLine,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      marginRight: 5,
                      fontSize: 12,
                      width: textWidth,
                      textAlign: 'right',
                    }}>
                    {areaPrice}
                  </Text>
                  <View
                    style={{height: 1, backgroundColor: '#e0e0de', flex: 1}}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      width: textBTCWidth,
                      textAlign: 'right',
                    }}>
                    {(arrayAreaBTCPrice[i]/1000).toFixed(1)}k
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
  
  interface DataAssets {
    date: string;
    value: number;
  }
  function FindMinMaxInArray(data: DataAssets[]) {
    const result = data.reduce(
      (acc, curr) => {
        // Find minimum value
        acc.min = Math.min(acc.min, curr.value);
  
        // Find maximum value
        acc.max = Math.max(acc.max, curr.value);
  
        return acc;
      },
      {min: Infinity, max: -Infinity},
    );
  
    return [result.min, result.max];
  }
  function CreateAreaPrice(dataChart: DataAssets[]) {
    const [minValue, maxValue] = FindMinMaxInArray(dataChart);
    const lowestAreaPrice = +(minValue - (maxValue - minValue)).toFixed(2);
    const heighestAreaPrice = +(maxValue + (maxValue - minValue)).toFixed(2);
    const arrayAreaLowToHeight = [
      lowestAreaPrice,
      minValue,
      maxValue,
      heighestAreaPrice,
    ];
    const arrayAreaHeightToLow = [
      heighestAreaPrice,
      maxValue,
      minValue,
      lowestAreaPrice,
    ];
    const heighestAreaPriceString = heighestAreaPrice.toString();
    const heighestAreaPriceLength = heighestAreaPriceString.length;
    const priceRange = maxValue - minValue;
    return {
      arrayAreaPrice: arrayAreaHeightToLow,
      textLength: heighestAreaPriceLength,
      priceRange: priceRange,
    };
  }
  function CreateAreaPrice2(dataChart: DataAssets[]) {
    const [minValue, maxValue] = FindMinMaxInArray(dataChart);
    let numberOfFraction = 2;
    let rangeBetweenMinMax = 0;
    let averageAreaPrice = 0;
    let lowestAreaPrice = 0;
    let heighestAreaPrice = 0;
    if (minValue < 0 && maxValue > 0) {
      // if(Math.abs(minValue) < Math.abs(maxValue))
      rangeBetweenMinMax = (maxValue + (0 - minValue)) / 2;
      averageAreaPrice = +(maxValue - rangeBetweenMinMax).toFixed(numberOfFraction,);

      lowestAreaPrice = +(minValue - averageAreaPrice).toFixed(numberOfFraction,);
      heighestAreaPrice = +(maxValue + averageAreaPrice).toFixed(numberOfFraction,);
    } else if (minValue > 0 && maxValue > 0) {
      rangeBetweenMinMax = maxValue - minValue;
      averageAreaPrice = +(rangeBetweenMinMax / 2).toFixed(numberOfFraction) + minValue;

      lowestAreaPrice =  +(minValue - averageAreaPrice).toFixed(numberOfFraction,);
      heighestAreaPrice = +(maxValue + averageAreaPrice).toFixed(numberOfFraction,);
    } else if (minValue < 0 && maxValue < 0) {
      rangeBetweenMinMax = +(-(Math.abs(maxValue) - Math.abs(minValue))).toFixed(numberOfFraction);
      averageAreaPrice = rangeBetweenMinMax / 2 + minValue; // this value is negative value
      lowestAreaPrice = +(minValue - rangeBetweenMinMax/2).toFixed(numberOfFraction,);
      heighestAreaPrice = +(maxValue + rangeBetweenMinMax/2).toFixed(numberOfFraction,);
    }
    
    const exactlyValueBetweenMinMax = maxValue - averageAreaPrice;
    const arrayAreaLowToHeight = [
      lowestAreaPrice,
      minValue,
      maxValue,
      heighestAreaPrice,
    ];
    const arrayAreaHeightToLow = [
      heighestAreaPrice,
      maxValue,
      averageAreaPrice,
      minValue,
      lowestAreaPrice,
    ];
    const heighestAreaPriceString = heighestAreaPrice.toString();
    const heighestAreaPriceLength = heighestAreaPriceString.length;
    const priceRange = maxValue - minValue;
    //   console.log('averageAreaPrice', averageAreaPrice);
    //   console.log('arrayAreaHeightToLow', arrayAreaHeightToLow);
    //   console.log('priceRange',priceRange);
    return {
      arrayAreaPrice: arrayAreaHeightToLow,
      textLength: heighestAreaPriceLength,
      priceRange: priceRange,
    };
  }
  function CreateAreaDate(dataChart: DataAssets[], dateMode: string) {
    let arrayDate = null;
    if (dateMode === '7D') {
      // arrayDate = [dataChart[0].date, dataChart[2].date, dataChart[4].date, dataChart[6].date];
      const getArrayDate = [
        dataChart[0].date,
        dataChart[2].date,
        dataChart[4].date,
        dataChart[6].date,
      ];
      arrayDate = getArrayDate.map(dateString => dateString.slice(0, -5));
    } else {
      const getArrayDate = [];
      for (let i = 0; i < dataChart.length; i++) {
        if (i === 0) {
          getArrayDate.push(dataChart[0].date);
        } else if (i % 2 === 0) {
          getArrayDate.push(dataChart[i].date);
        } else {
          // do nothoing
        }
      }
      arrayDate = getArrayDate.map(dateString => dateString.slice(0, -5));
    }
    //   console.log('arrayDate', arrayDate);
    return arrayDate;
  }
  
  function CreateArrayValue(dataChart: DataAssets[]) {
    const arrayValue = [];
    for (let i = 0; i < dataChart.length; i++) {
      arrayValue.push(dataChart[i].value);
    }
    return arrayValue;
  }
  const LongPressMoveExample = () => {
    const [dragged, setDragged] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
  
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
          setPosition({x: gestureState.moveX, y: gestureState.moveY});
        }
      },
      onPanResponderRelease: () => {
        // Reset state on release
        setDragged(false);
        setPosition({x: 0, y: 0});
      },
    });
  };
  
  const dataForTest: DataAssets[] = [
    {
      date: '03-03-2024',
      value: 15.37,
    },
    {
      date: '04-03-2024',
      value: 14.41,
    },
    {
      date: '05-03-2024',
      value: 15.05,
    },
    {
      date: '06-03-2024',
      value: 40544.39,
    },
    {
      date: '07-03-2024',
      value: 38324.53,
    },
    {
      date: '08-03-2024',
      value: 43478.69,
    },
    {
      date: '09-03-2024',
      value: 48166.33,
    },
  ];
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
  
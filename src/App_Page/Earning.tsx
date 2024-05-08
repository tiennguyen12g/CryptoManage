import { StyleSheet, Text, View, TouchableOpacity, Animated, ViewStyle, Dimensions,  NativeSyntheticEvent, NativeScrollEvent ,
 } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import {PieChart} from "react-native-chart-tnbt";
import {useTheme} from '@react-navigation/native';
import LineHorizontalAnimated from '../Utilitys/LineHorizontalAnimated';
import SvgLineChart from '../Utilitys/SvgLineChart/SvgLineChart2';
import SvgLineChart3 from '../Utilitys/SvgLineChart/SvgLineChart3';
import { BarChart, LineChart,  PopulationPyramid } from "react-native-gifted-charts";
import { GiftedLineChart, GiftedLineChart2, Chart3 } from '../Utilitys/SvgLineChart/GiftedChart';
import LongPressMoveExample from '../Utilitys/SvgLineChart/PanResponde';
import { ScrollView } from 'react-native-gesture-handler';
import LongPressDurationExample from '../Utilitys/SvgLineChart/TestPress';
import CalendarChart from '../Utilitys/CalenderChart/CalenderChart';
import CumulativePNL from '../Utilitys/SvgLineChart/CumulativePNL';
import MyCalenderChart from '../Utilitys/CalenderChart/MyCalenderChart';
import MyCalenderChart2 from '../Utilitys/CalenderChart/MyCalenderChart2';

interface ScreenNameType {
  screenName: string,
  function: (isSwipe: boolean ) => void
}
const {width, height} = Dimensions.get("screen");
export default function Earning() {
  const {colors} = useTheme();
  const [boxActive, setBoxActive] = useState<string>('Overview');
  const [boxIndex, setBoxIndex] = useState<number>(0);

  const navigateOverview = (isSwipe: boolean ) => {
    setBoxActive("Overview");
    setBoxIndex(0)
    handleLineIndex('Overview');
    console.log('hello');
    if (scrollViewRef.current && isSwipe) {
      scrollViewRef.current.scrollTo({ x: (0)*(width),animated: true});
    }
  }

  const navigateSpot = (isSwipe: boolean ) => {
    setBoxActive('Spot');
    setBoxIndex(1)
    handleLineIndex('Spot');
    console.log('hello');
    if (scrollViewRef.current && isSwipe) {
      scrollViewRef.current.scrollTo({ x: (1)*(width),animated:true, });
    }
  }

  const navigateFuture = (isSwipe: boolean ) => {
    setBoxActive('Future');
    setBoxIndex(2)
    handleLineIndex('Future');
    if (scrollViewRef.current && isSwipe) {
      scrollViewRef.current.scrollTo({ x: (2)*(width),animated:true, });
    }
  }
  
  const navigateEarn = (isSwipe: boolean) => {
    setBoxActive('Earn');
    setBoxIndex(3)
    handleLineIndex('Earn');
    if (scrollViewRef.current && isSwipe) {
      scrollViewRef.current.scrollTo({ x: (3)*(width),animated:true, });
    }
  }

  const lineLength = (width - 30);
  const [lineIndex, setLineIndex] = useState<number>(0);
  const handleLineIndex = (goTo: string) => {
    if(goTo === 'Overview') setLineIndex(0)
    else if(goTo === 'Spot') setLineIndex(1)
    else if(goTo === 'Future') setLineIndex(2)
    else if(goTo === 'Earn') setLineIndex(3)
  }
  // set width for title navigate
  const titleWidth = "25%";

  const screenNames:ScreenNameType[] = [
    {
      "screenName": "Overview",
      "function" : navigateOverview
    },
    {
      "screenName": "Spot",
      "function" : navigateSpot
    },
    {
      "screenName": "Future",
      "function" : navigateFuture
    },
    {
      "screenName": "Earn",
      "function" : navigateEarn
    },
  ];
  const scrollViewRef = useRef<ScrollView | null>(null);
  const handleScroll = useRef(
    debounce((event: NativeScrollEvent) => {
      const { contentOffset } = event;
      const pageIndex = Math.ceil(contentOffset.x /width);
      
      screenNames.forEach((screenName: ScreenNameType, k: number)=>{
        console.log('pageIndex', pageIndex, "k", k);
        if(pageIndex === k && scrollViewRef.current ){
          // console.log('screenName.screenName',screenName.screenName);
          screenName.function(false);
        }
      })
    }, 300)
  ).current;

  function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    } as T;
  }
  // const handleScroll = (event: any) => {
  //   console.log('dont use nut run');
  //   const { contentOffset, layoutMeasurement } = event.nativeEvent;
  //   const pageIndex: number = setTimeout(()=>{
  //     const a: number = Math.ceil((contentOffset.x )/ width); 
  //     return a;
  //   },300) 
  //   if (scrollViewRef.current && pageIndex) {
      
  //     scrollViewRef.current.scrollTo({ x: (pageIndex)*(width -30),animated: true});
  //   }
  //   // screenNames.forEach((screenName: ScreenNameType, k: number)=>{
  //   //   // console.log('pageIndex', pageIndex, "k", k);
  //   //   if(pageIndex === k && scrollViewRef.current ){
  //   //     // console.log('screenName.screenName',screenName.screenName);
  //   //     // screenName.function(false);
  //   //     // setBoxActive(screenName.screenName)
  //   //     scrollViewRef.current.scrollTo({ x: (pageIndex)*(width),animated:true, });
  //   //   }
  //   // })
  //   // if (scrollViewRef.current && boxActive === "Overview") {
  //   //   scrollViewRef.current.scrollTo({ x: (0)*(width),animated: true});
  //   // }
  //   // if (scrollViewRef.current && boxActive === "Spot") {
  //   //   scrollViewRef.current.scrollTo({ x: (1)*(width),animated: true});
  //   // }
  //   // if (scrollViewRef.current && boxActive === "Future") {
  //   //   scrollViewRef.current.scrollTo({ x: (2)*(width),animated: true});
  //   // }
  //   // if (scrollViewRef.current && boxActive === "Earn") {
  //   //   scrollViewRef.current.scrollTo({ x: (3)*(width),animated: true});
  //   // }
  // };
  console.log('earning re-render');
  return (
    <ScrollView style={[styles.earningContainer]}>
      <View style={{marginBottom: 10}}>
        <View style={[styles.decorNavigateBtn]}>
          {screenNames.map((screenName: ScreenNameType, i: number) => {
            return(
              <View key={i} style={{ display:'flex', justifyContent:'center', alignItems:'center', width: titleWidth}}>
                <TouchableOpacity onPress={()=> screenName.function(true)}>
                  <Text style={[styles.titleText, {color: boxActive === screenName.screenName ? colors.secondary : "gray",}]}>
                    {screenName.screenName}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
        
        <LineHorizontalAnimated lineAmount={4} indexPlace={lineIndex} animateMode='timing' lineLength={lineLength} animateDuration={100}/>
      </View>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[{ width: 4 * width}]}
        horizontal
        
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        scrollEnabled={true}
        // onScroll={handleScroll}
        onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: 0 }} // Set initial position to 4 times screen width 
        style={{width:width,  minHeight: height, height: "auto"}}
        nestedScrollEnabled
      >
        {screenNames.map((screenName: ScreenNameType, j: number) => {
          return (
            <View key={j} style={{width: width-30, borderWidth: 1, borderColor:'gray', marginRight: 30}}>
              <Text>{screenName.screenName}</Text>
              {boxActive === "Overview" && 
                <View>
                  <View style={{width:'100%'}}>
                    <Text>
                      Total Balance
                    </Text>
                    <View style={{width:'100%'}}>
                      <Text style={{fontSize: 35, fontWeight:"600", color:'black', width: '100%', textAlign:'center'}}>
                        $46,153.94
                      </Text>
                    </View>
                    <View>
                      <Text>Profits</Text>
                      
                      <SvgLineChart3 dataChart={ptData}/>
                    </View>                
                  </View>
                </View>
              }
              {boxActive === "Spot" && 
                <View>
                  <View style={{width:'100%'}}>
                    <Text>
                      Total Balance
                    </Text>
                    <View style={{width:'100%'}}>
                      <Text style={{fontSize: 35, fontWeight:"600", color:'black', width: '100%', textAlign:'center'}}>
                        $46,153.94
                      </Text>
                    </View>
                    <View>
                      <Text>Profits</Text>    
                      <MyCalenderChart2 timePeriods={6}/>
                    </View>                
                  </View>
                </View>
              }
            </View>
          )
        })}


        {/* Title navigate */}
      </ScrollView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  earningContainer:{
    paddingHorizontal: 15,
    marginTop:10,
  },
  titleText:{
    fontSize: 18,
    fontWeight:"600",
  },
  decorNavigateBtn: {
    // borderWidth: 1, 
    // borderColor:"gray",
    width:"100%", 
    display:'flex',
    flexDirection:'row',
    // justifyContent:"space-around"
  },
  navigateSpot:{

  },
  navigateFuture:{

  },
})
const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]
const dataForTest = [
  {
      date:"03-03-2024",
      value: 0
  },
  {
      date:"04-03-2024",
      value: 1
  },
  {
      date:"05-03-2024",
      value: 1
  },
  {
      date:"06-03-2024",
      value: 1
  },
  {
    date:"04-03-2024",
    value: 1
},
{
    date:"05-03-2024",
    value: 1
},
{
    date:"06-03-2024",
    value: 1
},
{
  date:"04-03-2024",
  value: 1
},
// {
//   date:"05-03-2024",
//   value: 1
// },
// {
//   date:"06-03-2024",
//   value: 1
// },{
//   date:"04-03-2024",
//   value: 1
// },
// {
//   date:"05-03-2024",
//   value: 1
// },
// {
//   date:"06-03-2024",
//   value: 1
// },
//   {
//       date:"07-03-2024",
//       value: 10
//   },

]
const dataForProfit = [
  {
      date:"03-03-2024",
      value: -0.2
  },
  {
      date:"04-03-2024",
      value: -1.15
  },
  {
      date:"05-03-2024",
      value: -0.51
  },
  {
      date:"06-03-2024",
      value: 1151.90
  },
  {
      date:"07-03-2024",
      value: -1067.96
  },
  {
      date:"08-03-2024",
      value: 4086.20
  },
  {
      date:"09-03-2024",
      value: 7722.18
  },
//   {
//     date:"10-03-2024",
//     value: 9393.33
// },
// {
//   date:"11-03-2024",
//   value: 6612.33
// },

//   {
//       date:"12-03-2024",
//       value: 48166.33
//   },
//   {
//     date:"13-03-2024",
//     value: 51166.33
// },
// {
//   date:"14-03-2024",
//   value: 45166.33
// },
]
const dataForCumulative = [
  {
      date:"03-03-2024",
      value: -0.2
  },
  {
      date:"04-03-2024",
      value: -1.15
  },
  {
      date:"05-03-2024",
      value: -0.51
  },
  {
      date:"06-03-2024",
      value: 1151.90
  },
  {
      date:"07-03-2024",
      value: -1067.96
  },
  {
      date:"08-03-2024",
      value: 4086.20
  },
  {
      date:"09-03-2024",
      value: 7722.18
  },
  {
    date:"10-03-2024",
    value: 9393.33
},
{
  date:"11-03-2024",
  value: 6612.33
},

  {
      date:"12-03-2024",
      value: 8166.33
  },
  {
    date:"13-03-2024",
    value: 1166.33
},
{
  date:"14-03-2024",
  value: 5166.33
},
]
const dataForBTC = [
  {
      date:"03-03-2024",
      value: 57318.04
  },
  {
      date:"04-03-2024",
      value: 61733.08
  },
  {
      date:"05-03-2024",
      value: 65618.16
  },
  {
      date:"06-03-2024",
      value:68796.93
  },
  {
      date:"07-03-2024",
      value: 71994.40
  },
  {
      date:"08-03-2024",
      value: 71975.70
  },
  {
      date:"09-03-2024",
      value: 67752.29
  },
  {
    date:"10-03-2024",
    value: 61293.33
},
{
  date:"11-03-2024",
  value: 66612.33
},

  {
      date:"12-03-2024",
      value: 48166.33
  },
  {
    date:"13-03-2024",
    value: 51166.33
},
{
  date:"14-03-2024",
  value: 45166.33
},
]
const dataForBTCNegative = [
  {
      date:"03-03-2024",
      value: -57318.04
  },
  {
      date:"04-03-2024",
      value: -61733.08
  },
  {
      date:"05-03-2024",
      value: -65618.16
  },
  {
      date:"06-03-2024",
      value:-68796.93
  },
  {
      date:"07-03-2024",
      value: -71994.40
  },
  {
      date:"08-03-2024",
      value: -71975.70
  },
  {
      date:"09-03-2024",
      value: -67752.29
  },
]

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
  },
  {value: 240, date: '1 May 2022'},
  {value: 250, date: '2 May 2022'},
  {value: 280, date: '3 May 2022'},
  {value: 250, date: '4 May 2022'},
  {value: 210, date: '5 May 2022'},
];

// {boxActive === "Overview" && 
//                 <View>
//                   <View style={{width:'100%'}}>
//                   <Text>
//                     Total Balance
//                   </Text>
//                   <View style={{width:'100%'}}>
//                     <Text style={{fontSize: 35, fontWeight:"600", color:'black', width: '100%', textAlign:'center'}}>
//                       $46,153.94
//                     </Text>
//                   </View>
//                   <View style={{marginTop: 20}}>
//                     <Text>Asset Net Worth</Text>
//                     <SvgLineChart3 dataChart={ptData}/>
//                   </View>
//                   <View style={{marginTop: 20}}>
//                     <Text>Profits</Text>
//                     <SvgLineChart3 dataChart={ptData}/>
//                   </View>
//                   <View style={{marginTop: 20}}>
//                     <Text>Cumulative PNL</Text>
//                     <CumulativePNL dataChart={dataForCumulative} dataBTCTrend={dataForBTC}/>
//                   </View>
//                   <View>
//                     <Text>Profits</Text>
//                     <SvgLineChart dataChart={ptData}/>
//                     <SvgLineChart3 dataChart={ptData}/>
//                   </View>                
//                   </View>
//                   <View>
//                   <MyCalenderChart />
//                   <MyCalenderChart2 timePeriods={6}/>
//                   </View>
//                   <View style={{position:'relative', marginTop:200, marginBottom: 300}}>
//                   <GiftedLineChart />
//                   <GiftedLineChart2 />
//                   <Chart3 />
//                   <LongPressMoveExample />
//                   <LongPressDurationExample />
//                   </View>
//                 </View>
//               }
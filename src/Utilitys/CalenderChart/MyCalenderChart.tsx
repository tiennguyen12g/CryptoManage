import { View, Text, Dimensions, StyleSheet, PanResponder, Platform, Animated, } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";
import { HandleArrayDayForCurrentYear, HandleArrayDayForFullMonth , HandleArrayDayCorrespondingPeriods} from './HandleArrayDay';
import { HandleArrayDayCorrespondingPeriods2 } from './HandleArrayDay2';

interface MonthAndYearNeed{
  year:  number,
  monthName: string[],
  monthNumber: number[],
  dataPNL?: DataPNLType[][][]
}
interface CalenderPnlAllYear {
  year: number,
  monthDetails: CalenderMonthDetails[]
}
interface CalenderMonthDetails{
  monthInNumber: number,
  monthName: string,
  dataPNL?: DataPNLType[][],
}

interface CalenderEachYearInfo{
  year: number,
  monthNames: string[],
  monthNumbers: number[]
}

const {width, height} = Dimensions.get('screen');
const timePeriods = 6;
export default function MyCalenderChart() {

    // Size calender
    const calenderWidth = width - 30; // 30 is total value of padding horizontal of the screen.
    const calenderPadding = 10;
    const calenderCanSee = calenderWidth - 10 * 2;
    // Name of the day in week.
    const dayNameInWeek = ["Sun","Mon", "Tue", "Web", "Thu", "Fri", "Sat",];
    const monthNameInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const {currentDay, currentMonth, currentYear, currentDayName} = GetDate();

    const [activeDay, setActiveDay] = useState<number | null>(null);
    
    const [calenderPNLData, setCalenderPNLData] = useState<MonthAndYearNeed[]>([])
    useEffect(() => {
      const getCalenderPnlData =  HandleArrayDayCorrespondingPeriods({arrayDataPNL: dataPNLForDayForSixMonths, periods: 6});
      const a = HandleArrayDayCorrespondingPeriods2({arrayDataPNL: dataPNLForDayForSixMonths2, periods: 6})
      if(getCalenderPnlData.length> 0){
        setCalenderPNLData(getCalenderPnlData);
        // CreateArraySomeArrayFromDataPNL(getCalenderPnlData);   getCalenderPnlData: MonthAndYearNeed[]
        CreateArraySomeArrayFromDataPNL2(a); 
      }
      // function CreateArraySomeArrayFromDataPNL (getCalenderPnlData: MonthAndYearNeed[]){

      //   // Task 1: Create monthName array;
      //   let arrayMonthName: string[] = [];

      //   // Task 2: Create object that has info about limit of period such as "endMonth", "endYear".
      //   let objectEndMonthAndYear:{monthIndex: number, year: number, monthName: string} = {monthIndex: 1,monthName: "January", year: currentYear};

      //   // Task 3: Create array PNL. Follow this structure. [lastmonth,...,firstmonth].
      //   let arrayPNL: DataPNLType[][][] = []
      //   getCalenderPnlData.map((objPNL: MonthAndYearNeed, i: number) =>{
      //     const monthName = objPNL.monthName;
      //     const reverseMonthName = monthName.reverse();
      //     const monthPNL = objPNL.dataPNL || [];
      //     const copyMonthPNL = [...monthPNL]
      //     const reverseMonthPNL = copyMonthPNL.reverse() || [];
      //     arrayPNL = [...arrayPNL, ...reverseMonthPNL]; // Array like [3,2,1,12,11,10]. go back time.
      //     arrayMonthName = [...arrayMonthName,...reverseMonthName];
      //     const year = objPNL.year;
      //     const monthNumber = objPNL.monthNumber
      //     if(i === getCalenderPnlData.length - 1){
      //       objectEndMonthAndYear.year = year;
      //       objectEndMonthAndYear.monthIndex = monthNumber[0];
      //       objectEndMonthAndYear.monthName = monthName.reverse()[0];
      //     }
      //   });
      //   // console.log('arrayMonthName',arrayMonthName);

      //   // This result for task 1.
      //   setListMonthName(arrayMonthName);

      //   // This result for task 2.
      //   setEndMonthYear(objectEndMonthAndYear);

      //   // This result for task 3.
      //   setArrayPNLEachMonth(arrayPNL);
      //   setArrayPNLEachMonthReverse(arrayPNL.reverse());
      //   setActiveScrollIndex(arrayPNL.length - 1);
      // };
      function CreateArraySomeArrayFromDataPNL2 (getCalenderPnlData: CalenderPnlAllYear[]){

        // Task 1: Create monthName array;
        let arrayMonthName: string[] = [];

        // Task 2: Create object that has info about limit of period such as "endMonth", "endYear".
        let objectEndMonthAndYear:{monthIndex: number, year: number, monthName: string} = {monthIndex: 1,monthName: "January", year: currentYear};

        // Task 3: Create array PNL. Follow this structure. [lastmonth,...,firstmonth].
        let arrayPnlAllYear: DataPNLType[][][] = []

        getCalenderPnlData.map((objYear: CalenderPnlAllYear, i: number) =>{
          const year = objYear.year;
          const monthDetails = objYear.monthDetails;
          // const monthName = objPNL.monthName;
          // const reverseMonthName = monthName.reverse();
          // const monthPNL = objPNL.dataPNL || [];
          // const copyMonthPNL = [...monthPNL]
          // const reverseMonthPNL = copyMonthPNL.reverse() || [];
          // arrayPNL = [...arrayPNL, ...reverseMonthPNL]; // Array like [3,2,1,12,11,10]. go back time.
          // arrayMonthName = [...arrayMonthName,...reverseMonthName];
          // const monthNumber = objPNL.monthNumber

          // Solve task 1.
          let arrayMonthNameThisYear: string[] = [];
          let arrayPNLMonthThisYear: DataPNLType[][][] = [];
          monthDetails.map((monthDetail: CalenderMonthDetails, k : number) => {
            const monthName = monthDetail.monthName;
            const monthInNumber = monthDetail.monthInNumber;
            const dataPNL = monthDetail.dataPNL || [];
            arrayMonthNameThisYear.push(monthName);
            arrayPNLMonthThisYear.push(dataPNL);
          })
          const reverseArrayMonthName = arrayMonthNameThisYear.reverse();
          arrayMonthName.push(...reverseArrayMonthName);

          const reverseArrayPnlAllYear = arrayPNLMonthThisYear.reverse();
          arrayPnlAllYear.push(...reverseArrayPnlAllYear)

          // Solve task 2.
          // Determine the last month and las year in calender
          if(i === getCalenderPnlData.length - 1){
            objectEndMonthAndYear.year = year;
            const lastMonthInCalender = objYear.monthDetails[0];
            objectEndMonthAndYear.monthIndex = lastMonthInCalender.monthInNumber;
            objectEndMonthAndYear.monthName = lastMonthInCalender.monthName;
          }

          // Solve task 3.
        });
        // console.log('arrayMonthName',arrayMonthName);

        // This result for task 1.
        setListMonthName(arrayMonthName);

        // This result for task 2.
        setEndMonthYear(objectEndMonthAndYear);

        // This result for task 3.
        setArrayPNLEachMonth(arrayPnlAllYear);
      };

      
    },[])

    const [activeYear, setActiveYear] = useState<number>(currentYear);
    const [endMonthYear, setEndMonthYear] = useState<{monthIndex: number, year: number, monthName: string}>({monthIndex: 1,monthName: "January", year: currentYear});
        
    const [activeMonth, setActiveMonth] = useState<number>(currentMonth); 
    const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0); // set the initial value = 0 because it get the first element from lisMonthName array.
    const [listMonthName, setListMonthName] = useState<string[]>([]);
    const [monthNameActive, setMonthNameActive] = useState<string>(monthNameInYear[currentMonth - 1]);

    const [arrayPNLEachMonth, setArrayPNLEachMonth] = useState<DataPNLType[][][]>([]);  // Array is arrange look like [3,2,1,12,11,10]. go back time.
    const handlePreviuosMonth = () =>{
      if(monthNameActive === endMonthYear.monthName && activeYear === endMonthYear.year) return console.log('Last month data PNL');;
      if(activeMonth > 1){
        setActiveMonth(activeMonth - 1)
        setMonthNameActive(monthNameInYear[activeMonth - 2]); // need to plus for 2 because in the first time activeMonth = currentMonth. We -1 for array form, and -1 for set the previous month.
      } else if (activeMonth === 1){
        setActiveMonth(12);
        setMonthNameActive("December");
        setActiveYear(prev => {return prev - 1})
      }
      setActiveMonthIndex(prev => { return prev + 1});
      setActiveDay(null)
    }
    const handleNextMonth = () =>{
      if(activeMonth === currentMonth && activeYear === currentYear) return console.log('No more data PNL');;
      if ( activeMonth === currentMonth){
        console.log('no more for next');
      } else if (activeMonth === 12) {
        setActiveMonth(1);
        setMonthNameActive("January");
        setActiveYear(prev => {return prev + 1});
      } else if(activeMonth < currentMonth){
        setActiveMonth(activeMonth + 1);
        setMonthNameActive(monthNameInYear[activeMonth]);
      } else if( activeMonth > currentMonth){
        setActiveMonth(activeMonth + 1);
        setMonthNameActive(monthNameInYear[activeMonth]);
      } 
      setActiveMonthIndex(activeMonthIndex - 1);
      setActiveDay(null)
    }

    const [dragged, setDragged] = useState(false);
    const [position, setPosition] = useState<{x: number; y: number}>({x: 0,y: 0,});
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => true,
  
      onPanResponderGrant: (evt, gestureState) => {
        // Set a timeout to simulate a hold
        // if (Platform.OS === 'ios') {
        //   console.log('grant', gestureState.dx);
        //   setPosition({x: gestureState.moveX, y: gestureState.moveY});
        // }
        setDragged(true)
      },
  
      onPanResponderMove: (evt, gestureState) => {
        // This is triggered as the user moves their finger
        if (dragged) {
          setPosition({x: gestureState.moveX, y: gestureState.moveY});
        }
      },
      onPanResponderEnd: () => {
        // This is triggered when the user lifts their finger
        // setPosition({x: 0, y: 0});
      },
    });
    // useEffect(() => {
    //   console.log('drag', dragged, "position", position.x);
    // },[position, dragged])
    

    const [boxColorActive, setBoxColorActive] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const boxColors = ["red", "blue", "pink", "orange", "gray"];
    const panResponder2 = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        console.log('move');
        const dx = gestureState.dx;
        const absoluteDX = Math.abs(dx);
        const percentage = absoluteDX / width;
        if (currentIndex === 0 && dx > 0) {
          // If on the first box and swiping right, move to the next box
          setCurrentIndex(1);
        } else if (dx < 0 && currentIndex > 0) {
          // If swiping left and not on the first box, move to the previous box
          setCurrentIndex(currentIndex - 1);
        } else if (dx > 0 && currentIndex < boxColors.length - 1) {
          // If swiping right and not on the last box, move to the next box
          setCurrentIndex(currentIndex + 1);
        }
      },
      onPanResponderRelease: () => {},
    });
    useEffect(() => {
      console.log('currentIndex', currentIndex,);
    },[currentIndex]);
    const handleScroll = (event: any) => {
      if (Platform.OS === 'android') {
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.ceil(offsetX / width) + 1;
        return;
      }
      const offsetX = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.floor(offsetX / width) + 1;
    };
  
    const scrollWidth = calenderWidth * arrayPNLEachMonth.length
  return (
    <View style={{width: calenderWidth, paddingHorizontal: 10, borderWidth: 1, borderColor:'gray'}}>

      {/* The heading of the callender that include "monthName, year, and two buttons for navigate between month" */}
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: "100%", marginVertical: 10}}>
            <View>
              <TouchableWithoutFeedback onPress={handlePreviuosMonth}>
                <View style={{width: 40, height:30, justifyContent:'center', alignItems:'center'}}>
                  <Ionicons 
                    name="chevron-back" 
                    size={20} 
                    color={monthNameActive === endMonthYear.monthName && activeYear === endMonthYear.year ? 'gray' : "blue"} 
                    style={{}} 
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          <Text style={{fontSize: 18, fontWeight: "500"}}>
            {listMonthName?.[activeMonthIndex]} {activeYear}
          </Text>
          <View>
            <TouchableWithoutFeedback onPress={handleNextMonth}>
              <View style={{width: 40, height:30, justifyContent:'center', alignItems:'center'}}>
                <Ionicons 
                  name="chevron-back" 
                  size={20} 
                  color={activeMonth === currentMonth && activeYear === currentYear ? "gray" : "blue"} 
                  style={{transform:[{rotate: '180deg'}]}} 
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
      </View>

      {/* This is create the shoter dayName (Sun, Mon, Tue ...) */}
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', width: "100%", marginVertical: 10,}}> 
          {dayNameInWeek.map((dayName: string, i: number) => {
              return(
                  <Text key={i} style={{width: calenderCanSee / 7, textAlign: 'center'}}>
                      {dayName}
                  </Text>
              )
          })}
      </View>

      {/* This is main of the calender, that include exactly day in month and its pnl data */}
      {calenderPNLData.length > 0 ? calenderPNLData.map((objPNL: MonthAndYearNeed, k: number)=>{
        const arrayPNL: DataPNLType[][][] = objPNL.dataPNL || [];
        const monthNumber = objPNL.monthNumber;
        const year = objPNL.year;
        return(
          <View key={k} style={{borderWidth: 0, borderColor:'gray', }}>
            {monthNumber.map((monthIndex: number, m: number) => {
              const pnlForThisMonth = arrayPNL[m];
              return (
                <View key={m} style={{ width: "100%", display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                  {monthIndex === activeMonth && year === activeYear && pnlForThisMonth.length > 0 && Array.from({length:pnlForThisMonth?.length},(_,index)=> index + 1).map((_, index) =>{
                      return(
                        // this code draw the line in calender
                          <View key={index} style={{ width: "100%", height: calenderCanSee/7, display:'flex', flexDirection:'row', marginBottom: 5}}>
                              {pnlForThisMonth.length > 0 && pnlForThisMonth[index].map((dayData: DataPNLType, i: number) => {
                                  const dayNumber = dayData.dayNumber ;
                                  const dayPNL = dayData.valuePNL ;
                                  return (
                                      <TouchableWithoutFeedback onPress={() => {console.log('touch in day'); setActiveDay(dayNumber === activeDay ? null : (dayNumber === 0 ? null : dayNumber))}} key={i}>
                                        <View style={[styles.decorLineShowDate, {width: calenderCanSee / 7,height: calenderCanSee/7, backgroundColor: dayNumber === activeDay ? "pink" : "white",}]}>
                                          <Text style={{ textAlign:'center', fontSize:13, fontWeight:"600", }}>
                                              {dayNumber !== 0 ? dayNumber : ""}
                                          </Text>
                                          <Text style={{color: dayPNL > 0 ? "green" : "red", fontSize: 12}}>
                                              {dayPNL > 0 ? "+" : (dayPNL !== 0 ? "-" : "")}
                                              {dayPNL !== 0 ? dayPNL : ""}
                                          </Text>
                                        </View>
                                      </TouchableWithoutFeedback>
                                  )
                              })}
                          </View>
                      )
                  })}
                </View>)})}
          </View>
        )
      }) : ""}

    {/* <ScrollView
      contentContainerStyle={[
        {
          width: calenderWidth * boxColors.length,
        },
      ]}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentOffset={{ x: calenderWidth * boxColors.length, y: 0 }}
      >
      <View style={{flexDirection: 'row'}}>
        {boxColors.map((boxColor, index) => (
          <View
            key={index}
            style={{
              width: calenderWidth,
              height: 300,
              backgroundColor: boxColor,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{boxColor}</Text>
          </View>
        ))}
      </View>
    </ScrollView> */}
    </View>
  )
}
// Stylesheet
const styles = StyleSheet.create({
  decorLineShowDate: {
    display:'flex', 
    justifyContent:'center', 
    alignItems:'center', 
    padding: 5,
    borderWidth: 0, 
    borderColor:'gray', 
    borderRadius: 5,
  },
})

function GetDate(){
    const currentDate = new Date();

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const currentYear = currentDate.getFullYear();

    // Get the name of the current day
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", ];
    const currentDayName = dayNames[currentDate.getDay()];

    return {
        "currentDay": currentDay,
        "currentMonth": currentMonth,
        "currentYear": currentYear,
        "currentDayName": currentDayName
    }
}
const dataPNL2 = [
    [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      }, {
        dayNumber: 31,
        valuePNL: 100
      }],
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 0
      }, {
        dayNumber: 23,
        valuePNL: 0
      }, {
        dayNumber: 24,
        valuePNL: 0
      }, {
        dayNumber: 25,
        valuePNL: 0
      }, {
        dayNumber: 26,
        valuePNL: 0
      }, {
        dayNumber: 27,
        valuePNL: 0
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      }, {
        dayNumber: 31,
        valuePNL: 100
      }]
]
interface DataPNLType {
    dayNumber: number,
    valuePNL: number
}

const dataPNL: DataPNLType[] = [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }]
  const dataPNLForDayInMonth: DataPNLType[] = [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }]
const dataPNLForDayInYear: DataPNLType[][] = [
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }]
]
const dataPNLForDayInYear2: DataPNLType[][] = [
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }]
]

const dataPNLForDayInPreviousYear: DataPNLType[][] = [
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, ],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, ],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
]
const dataPNLForDayForOneYear: DataPNLType[][] = [
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, ],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, ],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
]
const dataPNLForDayForSixMonths: DataPNLType[][] = [
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  },
  {
    dayNumber: 29,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  }, {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },
  {
    dayNumber: 31,
    valuePNL: 100
  }],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  }, {
    dayNumber: 30,
    valuePNL: 100
  },],
  [{
    dayNumber: 1,
    valuePNL: 100
  }, {
    dayNumber: 2,
    valuePNL: 100
  }, {
    dayNumber: 3,
    valuePNL: 100
  }, {
    dayNumber: 4,
    valuePNL: 100
  }, {
    dayNumber: 5,
    valuePNL: 100
  }, {
    dayNumber: 6,
    valuePNL: 100
  }, {
    dayNumber: 7,
    valuePNL: 100
  }, {
    dayNumber: 8,
    valuePNL: 100
  }, {
    dayNumber: 9,
    valuePNL: 100
  }, {
    dayNumber: 10,
    valuePNL: 100
  }, {
    dayNumber: 11,
    valuePNL: 100
  }, {
    dayNumber: 12,
    valuePNL: 100
  }, {
    dayNumber: 13,
    valuePNL: 100
  }, {
    dayNumber: 14,
    valuePNL: 100
  }, {
    dayNumber: 15,
    valuePNL: 100
  }, {
    dayNumber: 16,
    valuePNL: 100
  }, {
    dayNumber: 17,
    valuePNL: 100
  }, {
    dayNumber: 18,
    valuePNL: 100
  }, {
    dayNumber: 19,
    valuePNL: 100
  }, {
    dayNumber: 20,
    valuePNL: 100
  }, {
    dayNumber: 21,
    valuePNL: 100
  }, {
    dayNumber: 22,
    valuePNL: 100
  }, {
    dayNumber: 23,
    valuePNL: 100
  }, {
    dayNumber: 24,
    valuePNL: 100
  }, {
    dayNumber: 25,
    valuePNL: 100
  }, {
    dayNumber: 26,
    valuePNL: 100
  }, {
    dayNumber: 27,
    valuePNL: 100
  }, {
    dayNumber: 28,
    valuePNL: 100
  }, {
    dayNumber: 29,
    valuePNL: 100
  },  {
    dayNumber: 30,
    valuePNL: 100
  },{
    dayNumber: 31,
    valuePNL: 100
  },],
]
interface DataPNLFromServer{
  year: number,
  dataPNL: DataPNLType[][]
}
const dataPNLForDayForSixMonths2: DataPNLFromServer[] = [
  {
    year: 2024,
    dataPNL: [
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      }, {
        dayNumber: 31,
        valuePNL: 100
      }],
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      },
      {
        dayNumber: 29,
        valuePNL: 100
      }],
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      }, {
        dayNumber: 31,
        valuePNL: 100
      }],
    ]
  },
  {
    year: 2023,
    dataPNL: [
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      },
      {
        dayNumber: 31,
        valuePNL: 100
      }],
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      }, {
        dayNumber: 30,
        valuePNL: 100
      },],
      [{
        dayNumber: 1,
        valuePNL: 100
      }, {
        dayNumber: 2,
        valuePNL: 100
      }, {
        dayNumber: 3,
        valuePNL: 100
      }, {
        dayNumber: 4,
        valuePNL: 100
      }, {
        dayNumber: 5,
        valuePNL: 100
      }, {
        dayNumber: 6,
        valuePNL: 100
      }, {
        dayNumber: 7,
        valuePNL: 100
      }, {
        dayNumber: 8,
        valuePNL: 100
      }, {
        dayNumber: 9,
        valuePNL: 100
      }, {
        dayNumber: 10,
        valuePNL: 100
      }, {
        dayNumber: 11,
        valuePNL: 100
      }, {
        dayNumber: 12,
        valuePNL: 100
      }, {
        dayNumber: 13,
        valuePNL: 100
      }, {
        dayNumber: 14,
        valuePNL: 100
      }, {
        dayNumber: 15,
        valuePNL: 100
      }, {
        dayNumber: 16,
        valuePNL: 100
      }, {
        dayNumber: 17,
        valuePNL: 100
      }, {
        dayNumber: 18,
        valuePNL: 100
      }, {
        dayNumber: 19,
        valuePNL: 100
      }, {
        dayNumber: 20,
        valuePNL: 100
      }, {
        dayNumber: 21,
        valuePNL: 100
      }, {
        dayNumber: 22,
        valuePNL: 100
      }, {
        dayNumber: 23,
        valuePNL: 100
      }, {
        dayNumber: 24,
        valuePNL: 100
      }, {
        dayNumber: 25,
        valuePNL: 100
      }, {
        dayNumber: 26,
        valuePNL: 100
      }, {
        dayNumber: 27,
        valuePNL: 100
      }, {
        dayNumber: 28,
        valuePNL: 100
      }, {
        dayNumber: 29,
        valuePNL: 100
      },  {
        dayNumber: 30,
        valuePNL: 100
      },{
        dayNumber: 31,
        valuePNL: 100
      },],
    ]
  }
]
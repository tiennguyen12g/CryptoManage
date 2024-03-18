import { View, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons";
import { HandleArrayDayForCurrentYear, HandleArrayDayForFullMonth , HandleArrayDayCorrespondingPeriods} from './HandleArrayDay';


interface MonthAndYearNeed{
  year:  number,
  monthName: string[],
  monthNumber: number[],
  dataPNL?: DataPNLType[][][]
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
    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };
    
    const numberDayInMonth = isLeapYear(currentYear) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const totalDaysInYear = numberDayInMonth.reduce((total, days) => total + days, 0);
    const totalDayInMonth = numberDayInMonth[currentMonth - 1]
    const arrayAllNumberDay = Array.from({ length: totalDayInMonth }, (_, index) => index + 1);
    const {indexBefore,indexAfter} =  FindDayNameStartInMonth(currentYear,currentMonth);
    const totalLineShowNumberDay = (totalDayInMonth + indexBefore + (6 - indexAfter)) / 7;
    // console.log('totalLineShowNumberDay ', totalLineShowNumberDay );
    const arrayLine =  Array.from({length: totalLineShowNumberDay}, (_, index) => index + 1);
    // console.log('arrayLine',arrayLine);
    // console.log('startFromDayNameIndex', startFromDayNameIndex);
    // const virtualDayBefore = startFromDayNameIndex;
    // const virtualDayAfter = 0;
    // console.log('indexBef', indexBefore, indexAfter);
    
    function AddVirtualDayInList (arrayData: DataPNLType[]){
        let array: DataPNLType[] = arrayData;
        let virtualDayInLast = 1;
        for(let i = 0; i <= totalLineShowNumberDay * 7; i++){
            if(i < indexBefore){
                array.unshift({
                    dayNumber: 0,
                    valuePNL: 0,
                })
            } else if ( i > (arrayAllNumberDay.length + indexBefore)){
                const index = i -  indexBefore;
                array.push({
                    dayNumber: 0,
                    valuePNL: 0,
                })
            } 
        };
        // make long array to each array with 7 elements
        const chunkSize = 7;
        function chunkArray(arr: DataPNLType[]) {
            const result = [];
            for (let i = 0; i < arr.length; i += chunkSize) {
                result.push(arr.slice(i, i + chunkSize));
            }
            return result;
        }
        const sliceArray = chunkArray(array);
        
        return sliceArray;
    }
    
    

    
    // const arrayVirtual = AddVirtualDayInList(dataPNL);
    // console.log('arrayVirtual', arrayVirtual);

    // console.log('arrayAllNumberDay', arrayAllNumberDay);
    const arrayAllNumberThisYear = 0
    function CreateArrayNumberDayInMonth() {
        const array = numberDayInMonth.map((totalDays, i) => {
            return Array.from({ length: totalDays }, (_, index) => index + 1);
        });
        return array;
    }

    const arrayAllNumberDayInThisYear = CreateArrayNumberDayInMonth();
    // console.log('arrayAllNumberDayInThisYear',arrayAllNumberDayInThisYear);

    function FindDayNameStartInMonth (currentYear: number, currentMonth: number) {
        // Get the day name for the 1st of the current month
        const firstOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const firstOfMonthDayName = dayNameInWeek[firstOfMonth.getDay()];
        const noBefore = dayNameInWeek.indexOf(firstOfMonthDayName);

        // Get the day name for the last day of the current month
        const lastOfMonth = new Date(currentYear, currentMonth - 1, totalDayInMonth);
        const lastOfMonthDayName = dayNameInWeek[lastOfMonth.getDay()];
        const noAfter = dayNameInWeek.indexOf(lastOfMonthDayName);
        return {
            "indexBefore": noBefore,
            "indexAfter" : noAfter};
    }
    
    
    const [activeColor, setActiveColor] = useState("pink");
    const [activeDay, setActiveDay] = useState<number | null>(null);
    // useEffect(()=>{
    //     console.log('activeDay',activeDay);
    // },[activeDay])
    // console.log('dataPNLForDayInYear2 ',dataPNLForDayInYear2);
    let preventReRunHandleArrayDay = 0;
    
    const [arrayDayForCurrentYear, setArrayDayForCurrentYear] = useState<DataPNLType[][][]>([]);
    const [reRender,setRerender] = useState(0);
    const [arrayVirtual, setArrayVirtual] = useState<DataPNLType[][] | null>(null);
    const [calenderPNLData, setCalenderPNLData] = useState<MonthAndYearNeed[]>([])
    useEffect(() => {
      // const getArrayCurrentYear = HandleArrayDayForCurrentYear({arrayDataPNL: dataPNLForDayInYear2, currentYear: 2024, currentMonth: 3}) || [];
      // const getArrayPreviousYear = HandleArrayDayForFullMonth()
      
      // if(getArrayCurrentYear.length>0){
      //   setArrayDayForCurrentYear(getArrayCurrentYear);
      //   console.log('getArrayCurrentYear', getArrayCurrentYear.length);
      //   setArrayVirtual(getArrayCurrentYear[0])
      // } else {
      //   console.log('getArrayCurrentYear no data', getArrayCurrentYear.length);
      // }
      const getCalenderPnlData =  HandleArrayDayCorrespondingPeriods({arrayDataPNL: dataPNLForDayForSixMonths, periods: 6});
      if(getCalenderPnlData.length> 0){
        setCalenderPNLData(getCalenderPnlData);
        CreateArrayMonthName();   
      }
      function CreateArrayMonthName (){
        let arrayMonthName: string[] = [];
        let objectEndMonthAndYear:{monthIndex: number, year: number, monthName: string} = {monthIndex: 1,monthName: "January", year: currentYear}
        getCalenderPnlData.map((objPNL: MonthAndYearNeed, i: number) =>{
          const monthName = objPNL.monthName;
          const reverseMonthName = monthName.reverse();
          arrayMonthName = [...arrayMonthName,...reverseMonthName];

          const year = objPNL.year;
          const monthNumber = objPNL.monthNumber
          if(i === getCalenderPnlData.length - 1){
            objectEndMonthAndYear.year = year;
            objectEndMonthAndYear.monthIndex = monthNumber[0];
            objectEndMonthAndYear.monthName = monthName.reverse()[0];
          }
        });
        // console.log('arrayMonthName',arrayMonthName);
        setListMonthName(arrayMonthName);
        setEndMonthYear(objectEndMonthAndYear)
      };
    },[reRender])

    const [activeYear, setActiveYear] = useState<number>(currentYear);
    const [endMonthYear, setEndMonthYear] = useState<{monthIndex: number, year: number, monthName: string}>({monthIndex: 1,monthName: "January", year: currentYear});
        
    const [activeMonth, setActiveMonth] = useState<number>(currentMonth); 
    const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0); // set the initial value = 0 because it get the first element from lisMonthName array.
    const [listMonthName, setListMonthName] = useState<string[]>([]);
    const [monthNameActive, setMonthNameActive] = useState<string>(monthNameInYear[currentMonth - 1]);
    const handlePreviuosMonth = () =>{
      // console.log('endMonthYear.monthIndex',endMonthYear.monthName,endMonthYear.year);
      // console.log('monthNameActive',monthNameActive, activeYear);
      // console.log('activeMonthIndex',activeMonthIndex);
      // console.log('listMonthName',listMonthName);
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
    }
    
  return (
    <View style={{width: calenderWidth, paddingHorizontal: 10, borderWidth: 0, borderColor:'gray'}}>
      <TouchableWithoutFeedback onPress={() => setRerender(prev => {return prev + 1})}>
        <Text>Re-Run</Text>
      </TouchableWithoutFeedback>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: "100%", marginVertical: 10}}>
            <View style={{width: 40, backgroundColor:'pink', height:40}}>
              <TouchableWithoutFeedback onPress={handlePreviuosMonth}>
                <View style={{width: 40, backgroundColor:'pink', height:40}}>
                  <Ionicons 
                    name="chevron-back" 
                    size={20} 
                    color={"black"} 
                    style={{}} 
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          <Text style={{fontSize: 18, fontWeight: "500"}}>
            {listMonthName?.[activeMonthIndex]} {activeYear}
          </Text>
          <View style={{width: 40, backgroundColor:'pink', height : 40}}>
            <TouchableWithoutFeedback onPress={handleNextMonth}>
              <View style={{width: 40, backgroundColor:'pink', height:40}}>
                <Ionicons 
                  name="chevron-back" 
                  size={20} 
                  color={"black"} 
                  style={{transform:[{rotate: '180deg'}]}} 
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
      </View>
      <ScrollView>
        <View style={{display:'flex', flexDirection:'row', alignItems:'center', width: "100%", marginVertical: 10}}> 
          {dayNameInWeek.map((dayName: string, i: number) => {
              return(
                  <Text key={i} style={{width: calenderCanSee / 7, textAlign: 'center'}}>
                      {dayName}
                  </Text>
              )
          })}
        </View>
        {/* <View style={{ width: "100%", display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
          {arrayLine.map((_, index) =>{
              return(
                  <View key={index} style={{ width: "100%", height: calenderCanSee/7, display:'flex', flexDirection:'row', marginBottom: 5}}>
                      {arrayVirtual !== null && arrayVirtual.length > 0 && arrayVirtual[index].map((dayData: DataPNLType, i: number) => {
                          const dayNumber = dayData.dayNumber ;
                          const dayPNL = dayData.valuePNL ;
                          return (
                              <TouchableWithoutFeedback onPress={() => {console.log('touch in day'); setActiveDay(dayNumber === activeDay ? null : (dayNumber === 0 ? null : dayNumber))}} key={i}>
                              <View 
                                  style={{width: calenderCanSee / 7,height: calenderCanSee/7, backgroundColor: dayNumber === activeDay ? "pink" : "white",
                                      display:'flex', justifyContent:'center', alignItems:'center', padding: 5,borderWidth: 0, borderColor:'gray', borderRadius: 5, 
                                  }}
                               >
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
        </View> */}
      </ScrollView>
      {/* {arrayDayForCurrentYear.length > 0 ? 
      arrayDayForCurrentYear.map((arrayVirtual: DataPNLType[][], k: number)=>{
        console.log('k',k);
        return(
          <View key={k} style={{ width: "100%", display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
          {k+1 === activeMonth && arrayVirtual !== null && arrayVirtual.length > 0 && Array.from({length:arrayVirtual?.length},(_,index)=> index + 1).map((_, index) =>{
              return(
                  <View key={index} style={{ width: "100%", height: calenderCanSee/7, display:'flex', flexDirection:'row', marginBottom: 5}}>
                      {arrayVirtual !== null && arrayVirtual.length > 0 && arrayVirtual[index].map((dayData: DataPNLType, i: number) => {
                          const dayNumber = dayData.dayNumber ;
                          const dayPNL = dayData.valuePNL ;
                          return (
                              <TouchableWithoutFeedback onPress={() => {console.log('touch in day'); setActiveDay(dayNumber === activeDay ? null : (dayNumber === 0 ? null : dayNumber))}} key={i}>
                              <View 
                                  style={{width: calenderCanSee / 7,height: calenderCanSee/7, backgroundColor: dayNumber === activeDay ? "pink" : "white",
                                      display:'flex', justifyContent:'center', alignItems:'center', padding: 5,borderWidth: 0, borderColor:'gray', borderRadius: 5, 
                                  }}
                               >
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
        </View>
        )
      }) : ""} */}
      {calenderPNLData.length > 0 ? calenderPNLData.map((objPNL: MonthAndYearNeed, k: number)=>{
        const arrayPNL: DataPNLType[][][] = objPNL.dataPNL || [];
        const monthNumber = objPNL.monthNumber;
        console.log('monthNumber',monthNumber);
        const monthName = objPNL.monthName;
        const year = objPNL.year;
        return(
          <View key={k}>
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
                                        <View 
                                            style={{width: calenderCanSee / 7,height: calenderCanSee/7, backgroundColor: dayNumber === activeDay ? "pink" : "white",
                                                display:'flex', justifyContent:'center', alignItems:'center', padding: 5,borderWidth: 0, borderColor:'gray', borderRadius: 5, 
                                            }}
                                        >
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
    </View>
  )
}

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
interface DataPNLForAllYearType{

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
function CreateArrayPNLForYear(year: number, dataInput: DataPNLType[]){
  const {currentDay, currentMonth, currentYear, currentDayName} = GetDate();


}

const a = [[
  [{"dayNumber": 0, "valuePNL": 0}, {"dayNumber": 1, "valuePNL": 100}, {"dayNumber": 2, "valuePNL": 100}, {"dayNumber": 3, "valuePNL": 100}, {"dayNumber": 4, "valuePNL": 100}, {"dayNumber": 5, "valuePNL": 100}, {"dayNumber": 6, "valuePNL": 100}], 
  [{"dayNumber": 7, "valuePNL": 100}, {"dayNumber": 8, "valuePNL": 100}, {"dayNumber": 9, "valuePNL": 100}, {"dayNumber": 10, "valuePNL": 100}, {"dayNumber": 11, "valuePNL": 100}, {"dayNumber": 12, "valuePNL": 100}, {"dayNumber": 13, "valuePNL": 100}], 
  [{"dayNumber": 14, "valuePNL": 100}, {"dayNumber": 15, "valuePNL": 100}, {"dayNumber": 16, "valuePNL": 100}, {"dayNumber": 17, "valuePNL": 100}, {"dayNumber": 18, "valuePNL": 100}, {"dayNumber": 19, "valuePNL": 100}, {"dayNumber": 20, "valuePNL": 100}], 
  [{"dayNumber": 21, "valuePNL": 100}, {"dayNumber": 22, "valuePNL": 100}, {"dayNumber": 23, "valuePNL": 100}, {"dayNumber": 24, "valuePNL": 100}, {"dayNumber": 25, "valuePNL": 100}, {"dayNumber": 26, "valuePNL": 100}, {"dayNumber": 27, "valuePNL": 100}], 
  [{"dayNumber": 28, "valuePNL": 100}, {"dayNumber": 29, "valuePNL": 100}, {"dayNumber": 30, "valuePNL": 100}, {"dayNumber": 31, "valuePNL": 100}, {"dayNumber": 0, "valuePNL": 0}, {"dayNumber": 0, "valuePNL": 0}, {"dayNumber": 0, "valuePNL": 0}], 
]]
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
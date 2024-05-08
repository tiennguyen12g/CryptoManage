import { View, Text } from 'react-native'
import React from 'react'
interface HandleArrayDayProps{
    startYear: number,
    endYear: number,
    arrayDataPNL: DataPNLType[],
}
interface HandleArrayDayForCurrentYearProps{ 
    arrayDataPNL: DataPNLType[][],
    currentYear: number,
    currentMonth: number,
}
interface HandleArrayDayCorrespondingPeriodProps{ 
  arrayDataPNL: DataPNLType[][],
  periods: number,
}
interface MonthAndYearNeed{
  year:  number,
  monthName: string[],
  monthNumber: number[],
  dataPNL?: DataPNLType[][][]
}


const dayNameInWeek = ["Sun","Mon", "Tue", "Web", "Thu", "Fri", "Sat",];
const monthNameInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function HandleArrayDayForFullMonth({startYear, endYear, arrayDataPNL} : HandleArrayDayProps) {   

    const arrayYears = Array.from({length: endYear - startYear +1},(_, index)=> startYear + index);

    // Determin exactly the day in month. Because in leap year the total day of Feb is different.
    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };
    
    const arrayNumberDayInMonthCorrespondingYear = arrayYears.map((yearNo: number, i: number) => {
        const numberDayInMonth = isLeapYear(yearNo) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return numberDayInMonth;
    })
    console.log('arrayNumberDayInMonthCorrespondingYear',arrayNumberDayInMonthCorrespondingYear);

    const a = arrayNumberDayInMonthCorrespondingYear.map((arrayNumberDayInMonths: number[], i: number) => {
        return arrayNumberDayInMonths.map((totalDay: number, j: number) => {
            const {indexBefore,indexAfter} = FindDayNameStartInMonth(arrayYears[i], (j + 1), totalDay);
            const totalLineShowNumberDay = (totalDay + indexBefore + (6 - indexAfter)) / 7;
            const virtualArray = AddVirtualDayInList(arrayDataPNL, totalLineShowNumberDay, indexBefore, indexAfter, arrayNumberDayInMonths.length);
            return virtualArray;
        })
        
    })
    console.log('a',a);
  return ;
}
function HandleArrayDayForCurrentYear({arrayDataPNL, currentYear, currentMonth, } : HandleArrayDayForCurrentYearProps) {   
    // Determin exactly the day in month. Because in leap year the total day of Feb is different.
    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };
    // console.log('arrayDataPNL,', arrayDataPNL);
    const numberDayInMonth = isLeapYear(currentYear) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const arrayNumberDayInMonthsUntilCurrentDay = numberDayInMonth.slice(0,currentMonth);
    
    const a = arrayNumberDayInMonthsUntilCurrentDay.map((totalDay: number, j: number) => {
        const {indexBefore,indexAfter} = FindDayNameStartInMonth(currentYear, j + 1, totalDay);
        const totalLineShowNumberDay = (totalDay + indexBefore + (6 - indexAfter)) / 7;
        const virtualArray = AddVirtualDayInList(arrayDataPNL[j], totalLineShowNumberDay, indexBefore, indexAfter, arrayNumberDayInMonthsUntilCurrentDay[j]);
        return virtualArray;
    })
    // console.log('a',a[0]);
  return a;
}
function HandleArrayDayCorrespondingPeriods({arrayDataPNL, periods}: HandleArrayDayCorrespondingPeriodProps){
  const dayNameInWeek = ["Sun","Mon", "Tue", "Web", "Thu", "Fri", "Sat",];
  const monthNameInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const {currentDay, currentMonth, currentYear, currentDayName} = GetDate();

  // Part 1: Create array month and year that we need to show.
    function GetMonthAndYearNeeded(periods: number,){
      // This array store the amount of the month that we need to use. like [ 3, 12, 1];
      // Take 3 months current year, 12 months in (current -1)year and last value we take 1 month in (current - 2)year;
      const arrayListTotalMonthEachYear: number[] = [];
      const number_Of_Month_Until_Current_Month_In_Current_Year = currentMonth;
      arrayListTotalMonthEachYear.push(number_Of_Month_Until_Current_Month_In_Current_Year);
      const number_Of_Month_Need_In_Previous_Year = periods - number_Of_Month_Until_Current_Month_In_Current_Year;
      if(number_Of_Month_Need_In_Previous_Year > 12){
        const totalYear = Math.floor(number_Of_Month_Need_In_Previous_Year / 12);
        Array.from({length: totalYear},(_, index) => index + 1).map((_, i: number) =>{
          arrayListTotalMonthEachYear.push(12);
          return;
        });
        const remainingMonth = number_Of_Month_Need_In_Previous_Year % 12;
        arrayListTotalMonthEachYear.push(remainingMonth);
      }else{
        arrayListTotalMonthEachYear.push(number_Of_Month_Need_In_Previous_Year);
      };

      const arrayListMonthYear: MonthAndYearNeed[] = arrayListTotalMonthEachYear.map((totalMonth: number, k: number) => {
        const year =  currentYear - k;
        const monthName = year === currentYear ? monthNameInYear.slice(0, currentMonth) : monthNameInYear.slice(12 - totalMonth,12);
        const monthNumber =year === currentYear ?  Array.from({length: totalMonth},(_, index)=>  (index + 1)) : Array.from({length: totalMonth},(_, index)=>  (12 - index)).reverse() ;

        const object: MonthAndYearNeed = {
          "year": year,
          "monthName": monthName,
          "monthNumber": monthNumber.reverse()
        }
        return object;
      });
      return arrayListMonthYear;
    }; 

  const arrayListMonthYear = GetMonthAndYearNeeded(periods);
    
  // Part 2: Handle dataPNL from server. 
    function CreateArrayPNLForEachMonth (){
      let newArrayListMonthYear = [...arrayListMonthYear];

      // Determin exactly the day in month. Because in leap year the total day of Feb is different.
      const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };
      let dataIndex = 0;
      const arrayVirtualPNL =  arrayListMonthYear.map((objectData: MonthAndYearNeed, i: number) =>{
        const year = objectData.year;
        const monthNumber = objectData.monthNumber;
        const monthName = objectData.monthName;
        const arrayTotalDayInMonth = isLeapYear(year) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const arrayTotalDayNeed  = year ===  currentYear ? arrayTotalDayInMonth.slice(0, monthName.length) : arrayTotalDayInMonth.slice(12 - monthName.length, 12);
        const reverseMonthNumber = monthNumber.reverse();


        const arrayPNL: DataPNLType[][][] = arrayTotalDayNeed.reverse().map((totalDay: number, j: number) => {
          const {indexBefore,indexAfter} = FindDayNameStartInMonth(year, reverseMonthNumber[j], totalDay);
          const totalLineShowNumberDay = (totalDay + indexBefore + (6 - indexAfter)) / 7;
          const virtualArray: DataPNLType[][] = AddVirtualDayInList(arrayDataPNL[dataIndex], totalLineShowNumberDay, indexBefore, indexAfter, arrayTotalDayNeed[j]);
          dataIndex += 1;
          return virtualArray;
        });
        Object.assign(newArrayListMonthYear[i], {"dataPNL": arrayPNL})
        // console.log('arrayPNL', arrayPNL);
        
      })
      // console.log('newArrayListMonthYear,', newArrayListMonthYear);
      return newArrayListMonthYear;
    }; 
    const arrayVirtualPNL = CreateArrayPNLForEachMonth();
    return arrayVirtualPNL;
}
interface DataPNLType {
    dayNumber: number,
    valuePNL: number
}
function FindDayNameStartInMonth (year: number, month: number, totalDayInMonth: number) {
    // Get the day name for the 1st of the current month
    const firstOfMonth = new Date(year, month - 1, 1);
    const firstOfMonthDayName = dayNameInWeek[firstOfMonth.getDay()];
    const noBefore = dayNameInWeek.indexOf(firstOfMonthDayName);

    // Get the day name for the last day of the current month
    const lastOfMonth = new Date(year, month - 1, totalDayInMonth);
    const lastOfMonthDayName = dayNameInWeek[lastOfMonth.getDay()];
    const noAfter = dayNameInWeek.indexOf(lastOfMonthDayName);
    return {
        "indexBefore": noBefore,
        "indexAfter" : noAfter};
}
function AddVirtualDayInList (arrayData: DataPNLType[], totalLineShowNumberDay: number, indexBefore: number, indexAfter:number, lengArrayDayInMonth: number){
    let array: DataPNLType[] = arrayData;
    
    for(let i = 0; i <= totalLineShowNumberDay * 7; i++){
        if(i < indexBefore){
            array.unshift({
                dayNumber: 0,
                valuePNL: 0,
            })
        } else if ( i > (lengArrayDayInMonth + indexBefore)){
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
    // console.log('sliceArray',sliceArray);
    
    return sliceArray;
}
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

export { HandleArrayDayForCurrentYear, HandleArrayDayForFullMonth, HandleArrayDayCorrespondingPeriods}

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
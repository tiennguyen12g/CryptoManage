
interface HandleArrayDayCorrespondingPeriodProps{ 
  arrayDataPNL: DataPNLFromServer[],
  periods: number,
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

interface DataPNLFromServer{
  year: number,
  dataPNL: DataPNLType[][]
}
const dayNameInWeek = ["Sun","Mon", "Tue", "Web", "Thu", "Fri", "Sat",];
const monthNameInYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function HandleArrayDayCorrespondingPeriods2({arrayDataPNL, periods}: HandleArrayDayCorrespondingPeriodProps){
  console.log('re-render 2');
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

      const arrayListMonthYear: CalenderEachYearInfo[] = arrayListTotalMonthEachYear.map((totalMonth: number, k: number) => {
        const year =  currentYear - k;
        const monthName = year === currentYear ? monthNameInYear.slice(0, currentMonth) : monthNameInYear.slice(12 - totalMonth,12);
        const monthNumber =year === currentYear ?  Array.from({length: totalMonth},(_, index)=>  (index + 1)) : Array.from({length: totalMonth},(_, index)=>  (12 - index)).reverse() ;

        const object: CalenderEachYearInfo = {
          "year": year,
          "monthNames": monthName,
          "monthNumbers": monthNumber
        }
        return object;
      });
      // console.log('arrayListMonthYear',arrayListMonthYear);
      return arrayListMonthYear;
    }; 
    const arrayListMonthYear = GetMonthAndYearNeeded(periods);
  // Part 2: Handle dataPNL from server. 
    function CreateArrayPNLForEachMonth2(){
      const arrayPnlAllYear: CalenderPnlAllYear[] = arrayListMonthYear.map((yearDetails: CalenderEachYearInfo, i: number) => {
        const monthNames = yearDetails.monthNames; 
        const monthNumbers = yearDetails.monthNumbers;
        const year = yearDetails.year;

        // this array arrange the month pnl look like: [3,2,1] , mean "Mar" "Feb" "Jan"
        const dataPnlForThisYear = year === arrayDataPNL[i].year ?  arrayDataPNL[i].dataPNL : console.log('DataPNL is not correct for this year'); 
        const reversePNLData = dataPnlForThisYear?.reverse() || []; // Convert to [1,2,3]
        // Determin exactly the day in month. Because in leap year the total day of Feb is different.
        const isLeapYear = (year: number) => {
          return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        };
        const arrayTotalDayInMonth = isLeapYear(year) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const arrayTotalDayNeed  = year ===  currentYear ? arrayTotalDayInMonth.slice(0, monthNames.length) : arrayTotalDayInMonth.slice(12 - monthNames.length, 12);
        
        const arrayCalenderMonthDetailsPNL: CalenderMonthDetails[] = arrayTotalDayNeed.map((totalDay: number, j: number) => {
          const monthInNumber = monthNumbers[j];
          const monthName = monthNames[j];
          const monthPNL = reversePNLData[j];
          const {indexBefore,indexAfter} = FindDayNameStartInMonth(year, monthInNumber, totalDay);
          const totalLineShowNumberDay = (totalDay + indexBefore + (6 - indexAfter)) / 7;
          const virtualArray: DataPNLType[][] = AddVirtualDayInList(monthPNL, totalLineShowNumberDay, indexBefore, indexAfter, arrayTotalDayNeed[j]);
          const objForMonth: CalenderMonthDetails = {
              monthInNumber: monthInNumber,
              monthName: monthName,
              dataPNL: virtualArray,
          }
          return objForMonth;
        });
        const objForYear = {
          "year": year,
          "monthDetails": arrayCalenderMonthDetailsPNL
        }
        // Object.assign(newArrayListMonthYear[i], {"dataPNL": arrayCalenderMonthDetailsPNL})
        return objForYear
      });
      // console.log('arrayPnlAllYear', arrayPnlAllYear);
      return arrayPnlAllYear;
    }
    const getDataPNL = CreateArrayPNLForEachMonth2();
    return getDataPNL;
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

export {  HandleArrayDayCorrespondingPeriods2}


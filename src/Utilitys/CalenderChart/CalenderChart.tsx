import React, {useState} from 'react';
import { ScrollView } from 'react-native';
import {Calendar, LocaleConfig, CalendarList} from 'react-native-calendars';

const CalendarChart = () => {
  const [selected, setSelected] = useState('');

  return (

        <Calendar
          // Customize the appearance of the calendar
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 350,
          }}
          // Specify the current date
          current={'2012-03-01'}
          // Callback that gets called when the user selects a day
          onDayPress={day => {
            console.log('selected day', day);
          }}
          // Mark specific dates as marked
          markedDates={{
            '2012-05-15': {marked: true, dotColor: '#50cebb'},
    '2012-05-16': {marked: true, dotColor: '#50cebb'},
    '2012-05-21': {startingDay: true, color: '#50cebb', textColor: 'white'},
    '2012-05-22': {color: '#70d7c7', textColor: 'white'},
    '2012-05-23': {color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white'},
    '2012-05-24': {color: '#70d7c7', textColor: 'white'},
    '2012-05-25': {endingDay: true, color: '#50cebb', textColor: 'white'}
          }}
          markingType={'period'}
        />
  );
};

export default CalendarChart;

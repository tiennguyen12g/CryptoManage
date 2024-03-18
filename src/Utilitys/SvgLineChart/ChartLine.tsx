import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import Svg,{Rect, Text as SvgText} from 'react-native-svg';
const {width, height} = Dimensions.get('window')

interface ChartLineProps {
    lineChart: {
        invested: number,
        current: number,
        sold: number
    },
}
export default function ChartLine({lineChart}: ChartLineProps) {
    // (width - 20 -20 -4) is max size horizontal for the svg 
    const maxSVG = (width - 20 -20 -4) * 1 
    const max_LineChart = (width - 20 -20 -4) * 0.85
    const startLineChart = (width - 20 -20 -4)*0.15;
    const endLineChart = (width - 20 -20 -4) * 0.7; 
    const profit = (lineChart.current + lineChart.sold) - lineChart.invested;
    let width_lineCurrent; 
    let width_lineSold;
    let width_lineInvested;
    let maxCurrentAndSold;
    if(profit > 0){
        width_lineSold = (lineChart.sold /(lineChart.current + lineChart.sold)) * endLineChart;
        width_lineCurrent = (lineChart.current /(lineChart.current + lineChart.sold)) * endLineChart;
        width_lineInvested = lineChart.invested / (lineChart.current + lineChart.sold) * endLineChart;
    } else {
        maxCurrentAndSold = (lineChart.current + lineChart.sold) / lineChart.invested * endLineChart;
        width_lineSold = (lineChart.sold /(lineChart.current + lineChart.sold)) * maxCurrentAndSold;
        width_lineCurrent = (lineChart.current /(lineChart.current + lineChart.sold)) * maxCurrentAndSold;
    }
  return (
    <View style={[styles.container]}>
      <Text style={{fontSize: 24, color: 'black'}}>BTC</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{  justifyContent:'center',borderWidth: 1,marginLeft:startLineChart}}>
            <Svg width={max_LineChart} height="20" >
                <Rect x={0} y={0}  width={profit >0 ? width_lineInvested : endLineChart} height="20"     fill="rgb(11, 187, 35)" strokeWidth="3"/>
                {profit > 0  ? (
                    <SvgText x={width_lineInvested} y={20} fontSize={20} fill="rgb(38, 102, 46)">+ ${profit}</SvgText>
                ):("")}
            </Svg>
        </View>
      </View>
      <View style={{flexDirection: 'row', marginVertical:10}}>
        {/* <Text style={{flex: 0.25, borderWidth: 1, height: 50}}>Current</Text> */}
        <View style={{ justifyContent:'center',borderWidth: 1,marginLeft:startLineChart}}>
            <Svg width={max_LineChart} height="20" >
                <Rect x={0} y={0} width={width_lineSold} height="20" fill="rgb(240, 64, 102)" strokeWidth="3"/>
                <Rect x={width_lineSold} y={0} width={width_lineCurrent} height="20" fill="rgb(84, 184, 241)" strokeWidth="3"/>
                {profit < 0 ? (
                    <SvgText x={maxCurrentAndSold} y={20} fontSize={20} fill="rgb(38, 102, 46)">- ${-profit}</SvgText>
                ):("")}
            </Svg>
            {/* <Text>+ $2500</Text> */}

        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 0.25, borderWidth: 1, height: 50}}>Type</Text>
        <View style={{flex: 0.75, borderWidth: 1}}>
          <Text>Trading Coin</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 0.25, borderWidth: 1, height: 50}}>Quantity</Text>
        <View style={{flex: 0.75, borderWidth: 1}}>
          <Text>Trading Coin</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    height: 300,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
    borderColor: 'transparent',
    padding: 10,
  },
  tradingDetails: {},
  testViewBox: {
    borderWidth: 1,
  },
});

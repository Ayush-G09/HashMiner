import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const MyLineChart = () => {
  return (
    <View style={{backgroundColor: 'black', marginTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 10, boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)'}}>
      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fir', 'Sat', 'Sun'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43, 50],
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // Width of chart
        height={220} // Height of chart
        yAxisLabel={'$'}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          decimalPlaces: 2, // Number of decimal places
          color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`, // White lines and labels
          labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`, // White axis labels
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4', // Dot size
            strokeWidth: '2',
            stroke: '#ffa726', // Dot border color
          },
        }}
        bezier // Adds smooth bezier curves
      />
    </View>
  );
};

export default MyLineChart;

import React, { useEffect, useState } from 'react';
import {View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import axiosInstance from '../axios/axiosConfig';

const MyLineChart = () => {

  const [state, setState] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: ['a'],
    datasets: [{ data: [1] }]
  });
  
  useEffect(() => {
    const fetchCoinPrice = async () => {
      try {
        const response = await axiosInstance.get(`/auth/get-prices?period=1w`);
        const transformedData = {
          labels: response.data.prices.map((item: {date: string}) => {
            const date = new Date(item.date);
            return date.toLocaleDateString("en-US", { weekday: "short" });
          }),
          datasets: [{ data: response.data.prices.map((item: {price: number}) => item.price) }]
        };
        setState(transformedData);
      } catch (err: any) {}
    };

    fetchCoinPrice();
  }, []);

  return (
    <View
      style={{
        backgroundColor: 'black',
        marginTop: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
      }}>
      <LineChart
        data={state}
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

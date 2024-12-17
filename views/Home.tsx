import {Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MinerCard, { MinerCardType } from '../components/MinerCard';

const Home = () => {

  const miners = [
    {
      id: 'sdcs',
      minerName: 'Miner #01',
      status: 'Stopped',
      imageSource: require('../assets/m1.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs2',
      minerName: 'Miner #02',
      status: 'Running',
      imageSource: require('../assets/m2.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs3',
      minerName: 'Miner #03',
      status: 'Stopped',
      imageSource: require('../assets/m3.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs4',
      minerName: 'Miner #04',
      status: 'Running',
      imageSource: require('../assets/m4.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs5',
      minerName: 'Miner #05',
      status: 'Stopped',
      imageSource: require('../assets/m5.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs6',
      minerName: 'Miner #06',
      status: 'Running',
      imageSource: require('../assets/m6.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
    {
      id: 'sdcs7',
      minerName: 'Miner #07',
      status: 'Stopped',
      imageSource: require('../assets/m7.png'),
      hashRate: '1 coin/hr',
      coinsMined: '50',
      capacity: '100',
      onCollectCoins: () => console.log(''),
    },
  ] as MinerCardType[]
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
          <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>

            <View style={{width: '100%', alignItems: 'center'}}>

          <View style={{width: '90%', paddingVertical: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 10, marginTop: 20, alignItems: 'center', gap: 10, boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)'}}>
              <View style={{display: 'flex', width: '85%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={{color: 'rgb(148, 146, 146)', fontWeight: 700, fontSize: 20}}>Balance</Text>
                <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>💰 0.00</Text>
              </View>
          </View>

          <View style={{width: '90%', paddingVertical: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 10, marginTop: 20, alignItems: 'center', gap: 10, boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)'}}>
              <View style={{display: 'flex', width: '85%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={{color: 'rgb(148, 146, 146)', fontWeight: 700, fontSize: 20}}>Hash Coin/$</Text>
                <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>1/$0.5</Text>
              </View>
          </View>
          
          <View style={{width: '90%', paddingVertical: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 10, marginTop: 20, alignItems: 'center', gap: 10, boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)'}}>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
              <View style={{display: 'flex', width: '50%', alignItems: 'center', justifyContent: 'space-between', gap: 10}}>
                <Text style={{color: 'rgb(148, 146, 146)', fontWeight: 700, fontSize: 20}}>Active Miners</Text>
                <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>15 🛠️</Text>
              </View>
              <View style={{display: 'flex', width: '50%', alignItems: 'center', justifyContent: 'space-between',}}>
                <Text style={{color: 'rgb(148, 146, 146)', fontWeight: 700, fontSize: 20}}>Mining Rate</Text>
                <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>15 coins/hr ⚡</Text>
              </View>
            </View>
          </View>
          {miners.map((miner) => (
          <MinerCard
          key={miner.id}
              miner={miner}
            />
          ))}

          </View>

          </ScrollView>

        </ImageBackground>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    display: 'flex',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  Button: {
    minWidth: '30%',
    height: 50,
    marginTop: 50,
    backgroundColor: '#0288d1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 600
  }
});

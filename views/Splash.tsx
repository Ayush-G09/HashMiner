import { Image, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash = ({navigation}: Props) => {

  const validate = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
  
      if (userToken) {
        navigation.navigate('Layout');
      } else {
        navigation.navigate('Auth');
      }
    } catch (error) {
      navigation.navigate('Auth');
    }
  }

  useEffect(() => {
    setTimeout(() => {
      validate();
    }, 3000);
  }, []);
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
      <Image source={require('../assets/splash.gif')} style={{width: 500, height: 500}}/>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({})
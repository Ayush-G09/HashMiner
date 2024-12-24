import {
  ActivityIndicator,
  BackHandler,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MinerCard from '../components/MinerCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetCoinsMinedById,
  setBalance,
  setCoinPrice,
  setMiners,
} from '../store/minerSlice';
import {RootState} from '../store/store';
import axiosInstance from '../axios/axiosConfig';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type State = {
  loading: boolean;
  backPressedOnce: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const {balance, miners, coinPrice} = useSelector(
    (state: RootState) => state.miner,
  );

  const [state, setState] = useState<State>({
    loading: false,
    backPressedOnce: false,
  });

  useEffect(() => {
    const backAction = () => {
      if (state.backPressedOnce) {
        BackHandler.exitApp(); // Exit app on the second press
      } else {
        setState(prev => ({...prev, backPressedOnce: true}));
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);

        // Reset the back press flag after 2 seconds
        setTimeout(
          () => setState(prev => ({...prev, backPressedOnce: false})),
          2000,
        );
      }
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [state.backPressedOnce]);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('userToken');
      setState(prev => ({...prev, loading: true}));
      const response = await axiosInstance.get(`/auth/user/${userId}`, {headers: {Authorization: `Bearer ${token}`}});
      dispatch(setMiners(response.data.user.miners));
      dispatch(setBalance(response.data.user.balance));
    } catch (err: any) {
      if(err.response.data.message === 'Invalid token.'){
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('image');
        navigation.navigate('Auth');
      }else{
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        });
      }
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  };

  const fetchCoinPrice = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axiosInstance.get(`/auth/get-coin-price`, {headers: {Authorization: `Bearer ${token}`}});
      dispatch(setCoinPrice(response.data));
    } catch (err: any) {
      if(err.response.data.message === 'Invalid token.'){
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('image');
        navigation.navigate('Auth');
      }else{
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        });
      }
    }
  };

  useEffect(() => {
    // Call API when screen is loaded
    fetchData(); // Call the API function
    fetchCoinPrice();
  }, []);

  const refreshData = () => {
    fetchData();
    fetchCoinPrice();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
        {state.loading ? (
          <View
            style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={50} color="white" />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={state.loading}
                onRefresh={refreshData}
              />
            }
            showsVerticalScrollIndicator={false}
            style={{width: '100%'}}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <View
                style={{
                  width: '90%',
                  paddingVertical: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
                }}>
                <View
                  style={{
                    display: 'flex',
                    width: '85%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: 'rgb(148, 146, 146)',
                      fontWeight: 700,
                      fontSize: 20,
                    }}>
                    Balance
                  </Text>
                  <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>
                    💰 {balance}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: '90%',
                  paddingVertical: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
                }}>
                <View
                  style={{
                    display: 'flex',
                    width: '85%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: 'rgb(148, 146, 146)',
                      fontWeight: 700,
                      fontSize: 20,
                    }}>
                    Hash Coin/$
                  </Text>
                  <Text style={{color: 'white', fontWeight: 500, fontSize: 15}}>
                    1/$
                    {
                      coinPrice.datasets[0].data[
                        coinPrice.datasets[0].data.length - 1
                      ]
                    }
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: '90%',
                  paddingVertical: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
                }}>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}>
                    <Text
                      style={{
                        color: 'rgb(148, 146, 146)',
                        fontWeight: 700,
                        fontSize: 20,
                      }}>
                      Active Miners
                    </Text>
                    <Text
                      style={{color: 'white', fontWeight: 500, fontSize: 15}}>
                      {miners.length} 🛠️
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: 'rgb(148, 146, 146)',
                        fontWeight: 700,
                        fontSize: 20,
                      }}>
                      Mining Rate
                    </Text>
                    <Text
                      style={{color: 'white', fontWeight: 500, fontSize: 15}}>
                      {miners.reduce(
                        (total, miner) => total + miner.hashRate,
                        0,
                      )}{' '}
                      coins/hr ⚡
                    </Text>
                  </View>
                </View>
              </View>
              {!miners.length ? (
                <View
                  style={{
                    width: '90%',
                    backgroundColor: 'red',
                    height: '20%',
                    borderRadius: 10,
                    marginTop: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 500,
                    }}>
                    You need to buy a Miner to start mining.
                  </Text>
                </View>
              ) : (
                miners.map(miner => (
                  <MinerCard
                    updateMiner={id => dispatch(resetCoinsMinedById(id))}
                    updateBalance={newBalance =>
                      dispatch(setBalance(newBalance))
                    }
                    key={miner._id}
                    miner={miner}
                  />
                ))
              )}
            </View>
          </ScrollView>
        )}
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
    fontWeight: 600,
  },
});

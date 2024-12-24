import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { setBalance } from '../store/minerSlice';

type State = {
  loading: boolean;
  amount: number;
  upiId: string;
  upiLoading: boolean;
  editing: boolean;
  transaction: {type: "Miner" | "Coin", title: string, date: string, status: "Pending" | "Complete", amount: number, _id: string, to: string}[];
  transactionLoading: boolean;
};

const Wallet = () => {
  const [state, setState] = useState<State>({
    loading: false,
    amount: 0,
    upiId: '',
    upiLoading: false,
    editing: false,
    transaction: [],
    transactionLoading: false,
  });

  const { balance, coinPrice } = useSelector((state: RootState) => state.miner);

  const dispatch = useDispatch();

  const handleWithdraw = async () => {
    if(state.upiId){
    if(state.amount){
      if(state.amount>balance){
        Toast.show({
          type: 'error',
          text1: 'Insufficient Balance',
        });
        setState((prev) => ({...prev, amount: 0}));
        return;
      }else{
        try {
          const userId = await AsyncStorage.getItem("id");
          setState((prev) => ({...prev, loading: true}));
          const data = {
            userId: userId,
            title: `${state.amount} Coins`,
            type: 'Coin',
            amount: state.amount,
          };
          const response = await axios.post(`https://hash-miner-backend.vercel.app/api/auth/transaction`, data);
          setState((prev) => ({...prev, amount: 0, transaction: response.data.transactions}));
          dispatch(setBalance(balance-state.amount));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setState((prev) => ({...prev, loading: false}));
        }
      }
    }else{
      return;
    }}else{
      Toast.show({
        type: 'error',
        text1: 'Add UPI ID to withdraw'
      })
    }
  };

  const fetchTransactions = async () => {
    try {
      setState((prev) => ({...prev, transactionLoading: true}));
      const userId = await AsyncStorage.getItem("id");
      const response = await axios.get(`https://hash-miner-backend.vercel.app/api/auth/transactions/${userId}`);
      setState((prev) => ({...prev, upiId: response.data.upiId, transaction: response.data.transactions}));
    } catch (error) {
      console.error('Error fetching data:', error);
    }finally{
      setState((prev) => ({...prev, transactionLoading: false}));
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const changeUpiId = async () => {
    if(state.upiId){
      try{
        setState((prev) => ({...prev, upiLoading: true}));
        const userId = await AsyncStorage.getItem("id");
        const data = {userId: userId, upiID: state.upiId};
        await axios.put('https://hash-miner-backend.vercel.app/api/auth/user/upi', data);
        setState((prev) => ({...prev, editing: false}));
      }catch(error){
        console.error("erroe", error);
      }finally{
        setState((prev) => ({...prev, upiLoading: false}));
      }
    }else{return;};
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/gra4.jpg')} style={styles.backgroundImage}>
        <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
          <View style={{width: '90%', height: '100%'}}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 800, marginTop: 20}}>Wallet</Text>
            <View style={{width: '100%', height: 170, marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
              <View style={{backgroundColor: 'white', width: '30%', height: '90%', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 10}}>
                <View style={{width: 50, height: 50, backgroundColor: 'white', overflow: 'hidden', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.5)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/wallet.gif')} style={{width: 40, height: 40}} />
                </View>
                <Text style={{fontSize: 13, fontWeight: '400', color: 'gray'}}>Balance</Text>
                <Text style={{fontSize: 15, fontWeight: '600'}}>{balance}</Text>
              </View>
              <View style={{backgroundColor: 'white', width: '30%', height: '90%', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 10}}>
                <View style={{width: 50, height: 50, backgroundColor: 'white', overflow: 'hidden', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.5)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/dollar.gif')} style={{width: 40, height: 40}} />
                </View>
                <Text style={{fontSize: 13, fontWeight: '400', color: 'gray'}}>Coin Rate</Text>
                <Text style={{fontSize: 15, fontWeight: '600'}}>{coinPrice.datasets[0].data[coinPrice.datasets[0].data.length-1]}$/1 coin</Text>
              </View>
              <View style={{backgroundColor: 'white', width: '30%', height: '90%', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 10}}>
                <View style={{width: 50, height: 50, backgroundColor: 'white', overflow: 'hidden', boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.5)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/transaction.gif')} style={{width: 40, height: 40}} />
                </View>
                <Text style={{fontSize: 13, fontWeight: '400', color: 'gray'}}>Pending Request</Text>
                <Text style={{fontSize: 15, fontWeight: '600'}}>{state.transaction.filter(trx => trx.status === 'Pending').length}</Text>
              </View>
            </View>
              <View style={{width: '100%', display: 'flex', flexDirection: 'row', height: 50, marginTop: 20, justifyContent: 'space-between', alignItems: 'center'}}>
                <TextInput
                            inputMode="text"
                            style={styles.input}
                            placeholder="UPI ID"
                            value={state.upiId}
                            onChangeText={(e) => setState((prev) => ({...prev, upiId: e}))}
                            editable={state.editing}
                          />
                {state.editing ? <View style={{display: 'flex', flexDirection: 'row', gap: 10}}> <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.loginButton}
                  onPress={() => setState((prev) => ({...prev, editing: false}))}>
                  {!state.upiLoading && <View style={{...styles.loginButtonContainer, backgroundColor: 'red'}}>
                    <Text style={styles.loginButtonText}>X</Text>
                  </View>}
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.7}
                style={styles.loginButton}
                onPress={changeUpiId}>
                <View style={styles.loginButtonContainer}>
                  {state.upiLoading ? <ActivityIndicator size={25} color={'white'} /> :
                  <Text style={styles.loginButtonText}>Change</Text>}
                </View>
              </TouchableOpacity></View> : 
                <TouchableOpacity
                activeOpacity={0.7}
                style={styles.loginButton}
                onPress={() => setState((prev) => ({...prev, editing: true}))}>
                <View style={styles.loginButtonContainer}>
                  <Text style={styles.loginButtonText}>Edit</Text>
                </View>
              </TouchableOpacity>
                }
              </View>
              <View style={{width: '100%', marginTop: 20}}>
              <Text style={{color: 'white', fontWeight: 800, fontSize: 20}}>Request Withdraw</Text>
              <View style={{width: '100%', display: 'flex', flexDirection: 'row', height: 50, marginTop: 20, justifyContent: 'space-between', alignItems: 'center'}}>
                <TextInput
                            inputMode="numeric"
                            style={styles.input}
                            placeholder="Amount"
                            value={state.amount ? state.amount.toString() : ''}
                            onChangeText={(e) => setState((prev) => ({...prev, amount: parseInt(e)}))}
                          />
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.loginButton}
                  onPress={handleWithdraw}>
                  <View style={styles.loginButtonContainer}>
                    {state.loading ? <ActivityIndicator size={25} color={'white'} /> :
                    <Text style={styles.loginButtonText}>Withdraw</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ width: '100%', backgroundColor: 'white', alignItems: 'center', height: '45%', marginTop: 30, borderTopRightRadius: 30, borderTopLeftRadius: 30}}>
              <Text style={{fontSize: 20, fontWeight: 700, marginTop: 10, textAlign: 'center'}}>Transaction History</Text>
              <ScrollView style={{width: '100%'}}>
                <View style={{width: '100%', height: '100%', alignItems:  'center', paddingBottom: 50}}>
              {state.transactionLoading ? <ActivityIndicator style={{marginTop: 100}} size={50} color='black'/> : state.transaction.length ? state.transaction.map(data => (<View key={data._id} style={{width: '90%', display: 'flex', flexDirection: 'row', alignItems: 'center', boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.3)', borderRadius: 10, marginTop: 15, paddingHorizontal: 10, paddingVertical: 15}}>
                <View style={{width: 40, height: 40, borderRadius: '50%', backgroundColor: data.status === 'Complete' ? 'rgba(144, 238, 144, 0.5)' : 'rgba(173, 216, 230, 0.5)', alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={data.status === 'Complete' ? require('../assets/checked.png') : require('../assets/time.png')} style={{width: 20, height: 20}} />
                </View>
                <View style={{height: 40, marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={{fontWeight: 500}}>{data.title}</Text>
                  <Text style={{color: 'gray', fontSize: 12}}>{data.date}</Text>
                </View>
                <View style={{height: 40, marginLeft: 'auto', justifyContent: 'center', alignItems: 'flex-end'}}>
                  <Text style={{fontWeight: 500}}>{data.type === 'Miner' ? 'Bought' : 'Withdraw'}</Text>
                  <Text style={{color: 'gray', fontSize: 12}}>{data.status}</Text>
                  <Text style={{color: 'gray', fontSize: 12}}>{data.to}</Text>
                </View>
              </View>
              )) : 
              <View style={{width: '90%', backgroundColor: 'red', height: '80%', borderRadius: 10, marginTop: 100, alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center', color: 'white', fontSize: 15, fontWeight: 500}}>You have no transactions.</Text></View>
              }
              </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },loginButton: {
    height: 35,
  },
  loginButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0288d1',
    borderRadius: 5,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },input: {
    width: '65%',
    height: 45,
    borderRadius: 10,
    borderColor: 'rgba(225, 225, 225, 0.3)',
    borderWidth: 2,
    backgroundColor: 'rgba(225, 225, 225, 0.2)',
    paddingHorizontal: 15,
    color: 'white'
  },
})
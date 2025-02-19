import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axiosInstance from '../axios/axiosConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

export type MinerCardType = {
  minerId: {
    _id: string,
    hashRate: number,
    capacity: number,
    image: string,
    name: string,
    desc: string,
    price: number,
  },
  _id: string;
  status: 'Running' | 'Stopped';
  coinsMined: number;
};

type Porp = {
  miner: MinerCardType;
  updateBalance: (newBalance: number) => void;
  updateMiner: (id: string) => void;
};

const MinerCard = ({miner, updateBalance, updateMiner}: Porp) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleCollection = async () => {
    try {
      setLoading(true);
      const UserId = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('userToken');
      console.log({token: `/auth/collect-coins/${UserId}/${miner._id}`, a: {headers: {Authorization: `Bearer ${token}`}}})
      const response = await axiosInstance.post(
        `/auth/collect-coins/${UserId}/${miner._id}`, {}, {headers: {Authorization: `Bearer ${token}`}}
      );
      console.log({response: response.data})
      updateBalance(response.data.balance);
      updateMiner(miner._id);
      Toast.show({
        type: 'success',
        text1: 'Coins Collected',
        text2: `You have collected ${miner.coinsMined} coins`,
      });
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
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.minerName}>{miner.minerId.name}</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Text
            style={{
              ...styles.minerStatus,
              color: miner.status === 'Running' ? 'green' : 'red',
            }}>
            {miner.status}
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 1,
              backgroundColor: 'white',
              borderRadius: 5,
              overflow: 'hidden',
            }}>
            <Image
              source={
                miner.status === 'Running'
                  ? require('../assets/management.gif')
                  : require('../assets/forbidden-sign.gif')
              }
              style={{width: 30, height: 30}}
            />
          </View>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image src={miner.minerId.image} style={styles.minerImage} />
      </View>

      <InfoRow title="Hash Rate" value={miner.minerId.hashRate} />
      <InfoRow title="Coins Mined" value={miner.coinsMined} />
      <InfoRow title="Capacity" value={miner.minerId.capacity} />

      {!(miner.coinsMined === 0) && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={handleCollection}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Collect Coins</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

// Reusable InfoRow Component for displaying information
interface InfoRowProps {
  title: string;
  value: number;
}

const InfoRow: React.FC<InfoRowProps> = ({title, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: '90%',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    gap: 10,
    boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
  },
  header: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  minerName: {
    color: 'white',
    fontSize: 18,
  },
  minerStatus: {
    fontWeight: '500',
    fontSize: 15,
  },
  imageContainer: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  minerImage: {
    width: 250,
    height: 250,
  },
  infoRow: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTitle: {
    color: 'rgb(148, 146, 146)',
    fontWeight: '600',
    fontSize: 17,
  },
  infoValue: {
    color: 'white',
    fontWeight: '400',
    fontSize: 15,
  },
  button: {
    minWidth: '30%',
    height: 50,
    marginTop: 20,
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
    fontWeight: '600',
  },
});

export default MinerCard;

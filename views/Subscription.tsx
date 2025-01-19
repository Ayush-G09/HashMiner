import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Modal from 'react-native-modal';
import axiosInstance from '../axios/axiosConfig';
import Toast from 'react-native-toast-message';
import RazorpayCheckout from 'react-native-razorpay';

type CardData = {
  _id: string;
  name: string;
  capacity: number;
  desc: string;
  hashRate: number;
  image: string;
  price: number;
};

const Tag = ({ label, backgroundColor }: { label: string; backgroundColor: string }) => (
  <View style={[styles.tag, { backgroundColor }]}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const Card = ({ item, onSelect }: { item: CardData, onSelect: (name: string) => void} ) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageContainer}>
      <Image src={item.image} style={styles.foregroundImage} />
    </View>
    <View style={styles.cardContent}>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.desc}</Text>
        <TouchableOpacity onPress={() => onSelect(item._id)} activeOpacity={0.7} style={styles.loginButton}>
          <View style={styles.loginButtonContainer}>
            <Text style={styles.loginButtonText}>View</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const Subscription = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('');
  const [miners, setMiners] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onSelect = (id: string) => {
    setSelected(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handlePayment = () => {
    return;
    // var options = {
    //   description: 'buying a miner',
    //   image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png',
    //   currency: 'INR',
    //   key: '',
    //   amount: 100*100,
    //   name: 'test order',
    //   order_id: "",
    //   prefill: {
    //     email: 'xyz@gmail.com',
    //     contact: '9999999999',
    //     name: 'User 1',
    //   },
    //   theme: {color: "#F37254"},
    // };

    // RazorpayCheckout.open(options).then((data) => {
    //   console.log(data)
    // }).catch((err) => {
    //   console.log(err)
    // });
  };

  const fetchMiners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/auth/all-miners');
      setMiners(response.data.miners);
    } catch (err: any) {
      console.error('Error fetching miners:', err);
      Toast.show({
        type: 'error',
        text1: err.response?.data.message || 'Unknown error occurred',
      });
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMiners();
  }, []);

  return ( 
  <View style={styles.container}>
    <Modal isVisible={modal} style={{display: 'flex', alignItems: 'center'}}>
      <View style={{width: '100%', backgroundColor: 'black', borderRadius: 20, overflow: 'hidden'}}>
        <View style={styles.imageContainer}>
          <Image src={miners.find(card => card._id === selected)?.image} style={styles.foregroundImage} />
        </View>
        <View style={styles.cardContent}>
      <View style={{...styles.cardDetails, backgroundColor: 'white'}}>
        <Text style={{...styles.cardTitle, color: 'black'}}>{miners.find(card => card._id === selected)?.name}</Text>
        <Text style={{...styles.cardDescription, color: 'black'}}>{miners.find(card => card._id === selected)?.desc}</Text>
        <View style={{width: '55%', display: 'flex', marginRight: 'auto', marginTop: 15}}>
          <Tag label={`Hash Rate: ${miners.find(card => card._id === selected)?.hashRate!} coin/hr`} backgroundColor='crimson'/>
        </View>
        <View style={{width: '35%', display: 'flex', marginRight: 'auto', marginTop: 0}}>
          <Tag label={`Price: ${miners.find(card => card._id === selected)?.price!}`} backgroundColor='limegreen'/>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 20}}>
        <TouchableOpacity onPress={handlePayment} activeOpacity={0.7} style={{...styles.loginButton, marginTop: 0, width: '40%'}}>
          <View style={{...styles.loginButtonContainer, backgroundColor: '#0288d1'}}>
            <Text style={{...styles.loginButtonText, color: 'white'}}>Buy</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeModal} activeOpacity={0.7} style={{...styles.loginButton, marginTop: 0, width: '40%'}}>
          <View style={{...styles.loginButtonContainer, backgroundColor: 'red'}}>
            <Text style={{...styles.loginButtonText, color: 'white'}}>Close</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>
    </View>
      </View>
    </Modal>
    <ImageBackground source={require('../assets/gra4.jpg')} style={styles.backgroundImage}>
      <Text style={styles.headerText}>Subscriptions</Text>
      <FlatList
        data={miners}
        renderItem={({ item }) => <Card item={item} onSelect={onSelect} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMiners}
          />
        }
      />
    </ImageBackground>
  </View>
);
}

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 20,
    paddingLeft: '5%',
    textAlign: 'left',
    width: '100%',
  },
  listContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardContainer: {
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backImage: {
    width: '100%',
    height: 300,
  },
  foregroundImage: {
    width: 250,
    height: 250,
  },
  cardContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  cardDetails: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  },
  cardDescription: {
    marginTop: 10,
    color: 'white'
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontWeight: '600',
    color: 'white'
  },
  loginButton: {
    height: 40,
    marginTop: 20,
  },
  loginButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
  },
});

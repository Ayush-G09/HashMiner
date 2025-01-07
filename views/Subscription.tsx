import React, { useState } from 'react';
import {
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import RazorpayCheckout, {CheckoutOptions} from 'react-native-razorpay';
import Modal from 'react-native-modal';

type CardData = {
  id: string;
  name: string;
  price: string;
  description: string;
  hashRate: string;
  image: any;
};

const cardData: CardData[] = [
  {
    id: '1',
    name: 'Basic Miner',
    price: '$100',
    description:
      'A reliable entry-level miner for beginners, offering consistent performance.',
    hashRate: '1 Coin/hr',
    image: require('../assets/m1.png'),
  },
  {
    id: '2',
    name: 'Advanced Miner',
    price: '$120',
    description:
      'A cost-effective miner with boosted performance for moderate crypto earnings.',
    hashRate: '10 Coin/hr',
    image: require('../assets/m2.png'),
  },
  {
    id: '3',
    name: 'Pro Miner',
    price: '$150',
    description:
      'A high-performance miner for users looking to scale their operations.',
    hashRate: '1200 H/s',
    image: require('../assets/m3.png'),
  },
  {
    id: '4',
    name: 'Galaxy Miner',
    price: '$200',
    description:
      'A cutting-edge device with futuristic tech, designed for premium mining yields.',
    hashRate: '1500 H/s',
    image: require('../assets/m4.png'),
  },
  {
    id: '5',
    name: 'Quantum Extractor',
    price: '$200',
    description:
      'A revolutionary miner utilizing quantum tech for unmatched hashing power.',
    hashRate: '1500 H/s',
    image: require('../assets/m5.png'),
  },
  {
    id: '6',
    name: 'Cosmic Harvester',
    price: '$200',
    description:
      'A sci-fi marvel that pushes the boundaries of mining efficiency.',
    hashRate: '1500 H/s',
    image: require('../assets/m6.png'),
  },
  {
    id: '7',
    name: 'Nebula Reactor',
    price: '$200',
    description:
      'An elite miner equipped with intergalactic tech, a must-have for top miners.',
    hashRate: '1500 H/s',
    image: require('../assets/m7.png'),
  }
];

const Tag = ({ label, backgroundColor }: { label: string; backgroundColor: string }) => (
  <View style={[styles.tag, { backgroundColor }]}>
    <Text style={styles.tagText}>{label}</Text>
  </View>
);

const Card = ({ item, onSelect }: { item: CardData, onSelect: (name: string) => void} ) => (
  <View style={styles.cardContainer}>
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.foregroundImage} />
    </View>
    <View style={styles.cardContent}>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <TouchableOpacity onPress={() => onSelect(item.id)} activeOpacity={0.7} style={styles.loginButton}>
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
  const handlePayment = () => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: '', 
      order_id: '',
      amount: 5000,
      name: 'foo',
      prefill: {
        email: 'void@razorpay.com',
        contact: '9191919191',
        name: 'Razorpay Software'
      },
      theme: {color: '#F37254'}
    }
    RazorpayCheckout.open(options).then((data) => {
      // handle success
      console.log(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      // handle failure
      console.log(`Error: ${error.code} | ${error.description}`);
    });
  };

  const onSelect = (id: string) => {
    setSelected(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  return ( 
  <View style={styles.container}>
    <Modal isVisible={modal} style={{display: 'flex', alignItems: 'center'}}>
      <View style={{width: '100%', backgroundColor: 'black', borderRadius: 20, overflow: 'hidden'}}>
        <View style={styles.imageContainer}>
          <Image source={cardData.find(card => card.id === selected)?.image} style={styles.foregroundImage} />
        </View>
        <View style={styles.cardContent}>
      <View style={{...styles.cardDetails, backgroundColor: 'white'}}>
        <Text style={{...styles.cardTitle, color: 'black'}}>{cardData.find(card => card.id === selected)?.name}</Text>
        <Text style={{...styles.cardDescription, color: 'black'}}>{cardData.find(card => card.id === selected)?.description}</Text>
        <View style={{width: '55%', display: 'flex', marginRight: 'auto', marginTop: 15}}>
          <Tag label={`Hash Rate: ${cardData.find(card => card.id === selected)?.hashRate!}`} backgroundColor='crimson'/>
        </View>
        <View style={{width: '35%', display: 'flex', marginRight: 'auto', marginTop: 0}}>
          <Tag label={`Price: ${cardData.find(card => card.id === selected)?.price!}`} backgroundColor='limegreen'/>
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
        data={cardData}
        renderItem={({ item }) => <Card item={item} onSelect={onSelect} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingLeft: '5%'
  },
  listContent: {
    width: '90%',
    paddingVertical: 20,
  },
  cardContainer: {
    width: '100%',
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
    position: 'absolute',
    top: 50,
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

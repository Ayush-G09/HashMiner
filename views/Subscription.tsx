import React from 'react';
import { ImageBackground, FlatList, StyleSheet, Text, View, Image, ListRenderItem } from 'react-native';

interface CardData {
  id: string;
  name: string;
  price: string;
  description: string;
  hashRate: string;
  image: any;
}

const Subscription = () => {
  const cardData: CardData[] = [
    { id: '1', name: 'Basic Miner', price: '$100', description: 'A reliable entry-level miner for beginners, offering consistent performance.', hashRate: '1 Coin/hr', image: require('../assets/m1.png') },
    { id: '2', name: 'Advanced Miner', price: '$120', description: 'A cost-effective miner with boosted performance for moderate crypto earnings.', hashRate: '10 Coin/hr', image: require('../assets/m2.png') },
    { id: '3', name: 'Pro Miner', price: '$150', description: 'A high-performance miner for users looking to scale their operations.', hashRate: '1200 H/s', image: require('../assets/m3.png') },
    { id: '4', name: 'Galaxy Miner', price: '$200', description: 'A cutting-edge device with futuristic tech, designed for premium mining yields.', hashRate: '1500 H/s', image: require('../assets/m4.png') },
    { id: '5', name: 'Quantum Extractor', price: '$200', description: 'A revolutionary miner utilizing quantum tech for unmatched hashing power.', hashRate: '1500 H/s', image: require('../assets/m5.png') },
    { id: '6', name: 'Cosmic Harvester', price: '$200', description: 'A sci-fi marvel that pushes the boundaries of mining efficiency.', hashRate: '1500 H/s', image: require('../assets/m6.png') },
    { id: '7', name: 'Nebula Reactor', price: '$200', description: 'An elite miner equipped with intergalactic tech, a must-have for top miners.', hashRate: '1500 H/s', image: require('../assets/m7.png') }
  ];

  const renderCard: ListRenderItem<CardData> = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardHashRate}>Hash Rate: {item.hashRate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/gra4.jpg')} style={styles.backgroundImage}>
        <View style={{width: '95%'}}>
        {/* FlatList with Header */}
        <FlatList
          data={cardData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={
            <Text style={styles.headerText}>Subscription</Text>
          }
          ListFooterComponent={<View style={{ marginBottom: 60 }} />}
        />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardPrice: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    color: 'lightgray',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardHashRate: {
    color: 'lightgreen',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

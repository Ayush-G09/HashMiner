import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import MyLineChart from '../components/LineChart';

type Miner = {
  id: number;
  title: string;
  image: number;
  miningRate: string;
  coinsMined: number;
  status: 'Running' | 'Stopped';
};

const miners = [
  {
    id: 1,
    title: 'Miner #01',
    image: require('../assets/m1.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 2,
    title: 'Miner #02',
    image: require('../assets/m2.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 3,
    title: 'Miner #03',
    image: require('../assets/m3.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 4,
    title: 'Miner #04',
    image: require('../assets/m4.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 5,
    title: 'Miner #05',
    image: require('../assets/m5.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 6,
    title: 'Miner #06',
    image: require('../assets/m6.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
  {
    id: 7,
    title: 'Miner #07',
    image: require('../assets/m7.png'),
    miningRate: '1 coin/hr',
    coinsMined: 50,
    status: 'Running',
  },
] as Miner[];

const MinerCard = ({title, image, miningRate, coinsMined, status}: Miner) => {
  return (
    <View style={{...styles.card, boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)'}}>
      <Text style={styles.minerTitle}>{title}</Text>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.minerImage} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.minerType}>Basic Miner</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mining Rate</Text>
            <Text style={styles.value}>{miningRate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Coins Mined</Text>
            <Text style={styles.value}>{coinsMined}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.status}>{status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Activity = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.contentWrapper}>
            <MyLineChart />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Miners</Text>
              {miners.map(miner => (
                <MinerCard key={miner.id} {...miner} />
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    width: '90%',
    marginVertical: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  minerTitle: {
    color: '#0288d1',
    fontSize: 16,
    fontWeight: '600',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    flex: 1,
    gap: 5,
  },
  minerType: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'rgb(148, 146, 146)',
    fontWeight: '600',
    fontSize: 15,
  },
  value: {
    color: 'white',
    fontWeight: '400',
    fontSize: 13,
  },
  status: {
    color: 'green',
    fontWeight: '400',
    fontSize: 13,
  },
});

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
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {MinerCardType} from '../components/MinerCard';
import {getImageByCode, getNameByCode} from '../utils';

type Props = {
  miner: MinerCardType;
  index: number;
};

const MinerCard = ({miner, index}: Props) => {
  return (
    <View
      style={{
        ...styles.card,
        boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
      }}>
      <Text style={styles.minerTitle}>{`Miner #0${index + 1}`}</Text>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={getImageByCode(miner.type)}
            style={styles.minerImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.minerType}>{getNameByCode(miner.type)}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mining Rate</Text>
            <Text style={styles.value}>{miner.hashRate} coin/hr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Coins Mined</Text>
            <Text style={styles.value}>{miner.coinsMined}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={{
                ...styles.status,
                color: miner.status === 'Running' ? 'green' : 'red',
              }}>
              {miner.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Activity = () => {
  const {miners} = useSelector((state: RootState) => state.miner);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 800,
            width: '90%',
            marginTop: 20,
          }}>
          Activity
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.contentWrapper}>
            <MyLineChart />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Miners</Text>
              {!miners.length ? (
                <View
                  style={{
                    width: '100%',
                    backgroundColor: 'red',
                    height: '30%',
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
                    You don't have a Miner.
                  </Text>
                </View>
              ) : (
                miners.map((miner, index) => (
                  <MinerCard key={miner._id} miner={miner} index={index} />
                ))
              )}
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
    fontWeight: '400',
    fontSize: 13,
  },
});

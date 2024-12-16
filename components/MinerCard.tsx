import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export type MinerCardType = {
  id: string;
  minerName: string;
  status: 'Running'| 'Stopped';
  imageSource: number;
  hashRate: string;
  coinsMined: string;
  capacity: string;
  onCollectCoins: () => void;
}

type Porp = {
  miner: MinerCardType;
}

const MinerCard = ({miner}: Porp) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.minerName}>{miner.minerName}</Text>
        <Text style={{...styles.minerStatus, color: miner.status === 'Running' ? 'green' : 'red'}}>{miner.status}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={miner.imageSource} style={styles.minerImage} />
      </View>

      <InfoRow title="Hash Rate" value={miner.hashRate} />
      <InfoRow title="Coins Mined" value={miner.coinsMined} />
      <InfoRow title="Capacity" value={miner.capacity} />

      <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={miner.onCollectCoins}>
        <Text style={styles.buttonText}>Collect Coins</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reusable InfoRow Component for displaying information
interface InfoRowProps {
  title: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ title, value }) => (
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
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
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

import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

type State = {
  loading: boolean;
  data: {image: string, username: string, totalCoinsMined: number, _id: string}[];
}

const Leaderboard = () => {

  const [state, setState] = useState<State>({
    loading: false,
    data: [],
  });

  const fetchData = async () => {
    try {
      setState((prev) => ({...prev, loading: true}));
      const response = await axios.get(`https://hash-miner-backend.vercel.app/api/auth/leaderboard`);
      setState((prev) => ({...prev, data: response.data.data}));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setState((prev) => ({...prev, loading: false}));
    }
  };

  useEffect(() => {
    // Call API when screen is loaded
    fetchData(); // Call the API function
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/gra4.jpg')} style={styles.backgroundImage}>
        <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
          <View style={{width: '100%', alignItems: 'center', paddingTop: 20, marginBottom: 20}}>
            <View style={{display: 'flex', width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 800, width: '50%'}}>Leaderboard</Text>
              <Image source={require('../assets/award.png')} style={{width: 30, height: 30, marginLeft: 'auto'}} />
            </View>
            {state.loading ? <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={50} color='white'/>
            </View>
            : state.data.length ? state.data.map((user, index) => (<View key={user._id} style={{width: '90%', display: 'flex', flexDirection: 'row', padding: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)', marginTop: 20, borderRadius: 10}}>
              <View style={{width: 70, height: 70, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{width: 50,  height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden'}}>
                <Image source={user.image ? {uri: user.image} : require('../assets/man.png')} style={{width: 50, height: 50}} />
                </View>
              </View>
              <View style={{flex: 1, justifyContent: 'center', paddingLeft: 15}}>
                <Text style={{color: 'white', fontWeight: 800, fontSize: 17}}>{user.username}</Text>
                <Text style={{color: 'gray', fontWeight: 700, fontSize: 15}}>{user.totalCoinsMined} Coins Mined</Text>
              </View>
              {index < 3 && <View style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={index === 0 ? require('../assets/gold-medal.png') : index === 1 ? require('../assets/silver-medal.png') : require('../assets/bronze-medal.png')} style={{width: 30, height: 30}} />
              </View>}
            </View>)) : 
            <View style={{width: '90%', backgroundColor: 'red', height: '40%', borderRadius: 10, marginTop: 100, alignItems: 'center', justifyContent: 'center'}}><Text style={{textAlign: 'center', color: 'white', fontSize: 15, fontWeight: 500}}>Leaderboard not available.</Text></View>
            }
          </View>
        </ScrollView>
        </ImageBackground>
    </View>
  )
}

export default Leaderboard

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
        justifyContent: 'center',
      },
})
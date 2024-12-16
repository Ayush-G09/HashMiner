import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Users = [
  { name: 'Ayush Gokhle', coinsMined: 105 },
  { name: 'John Doe', coinsMined: 120 },
  { name: 'Jane Smith', coinsMined: 150 },
  { name: 'Alice Johnson', coinsMined: 90 },
  { name: 'Bob Brown', coinsMined: 200 },
  { name: 'Charlie Davis', coinsMined: 75 },
  { name: 'David Wilson', coinsMined: 130 },
  { name: 'Eva White', coinsMined: 110 },
  { name: 'Frank Black', coinsMined: 160 },
  { name: 'Grace Lee', coinsMined: 95 },
];

const Leaderboard = () => {

  const sortedUsers = Users.sort((a, b) => b.coinsMined - a.coinsMined);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/gra4.jpg')} style={styles.backgroundImage}>
        <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
          <View style={{width: '100%', alignItems: 'center', paddingTop: 100, marginBottom: 20}}>
            <View style={{display: 'flex', width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 800}}>Leaderboard</Text>
              <Image source={require('../assets/award.png')} style={{width: 30, height: 30}} />
            </View>
            {sortedUsers.map((user, index) => (<View key={user.name} style={{width: '90%', display: 'flex', flexDirection: 'row', padding: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)', marginTop: 20, borderRadius: 10}}>
              <View style={{width: 75, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={require('../assets/man.png')} style={{width: 60, height: 60}} />
              </View>
              <View style={{flex: 1, justifyContent: 'center', paddingLeft: 15}}>
                <Text style={{color: 'white', fontWeight: 800, fontSize: 17}}>{user.name}</Text>
                <Text style={{color: 'gray', fontWeight: 700, fontSize: 15}}>{user.coinsMined} Coins Mined</Text>
              </View>
              {index < 3 && <View style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={index === 0 ? require('../assets/gold-medal.png') : index === 1 ? require('../assets/silver-medal.png') : require('../assets/bronze-medal.png')} style={{width: 30, height: 30}} />
              </View>}
            </View>))}
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
import { StyleSheet, View } from 'react-native'
import React from 'react'
import Navigator from '../components/Navigator'

const Layout = () => {
  return (
    <View style={styles.container}>
      
            <Navigator/>
    </View>
  )
}

export default Layout

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
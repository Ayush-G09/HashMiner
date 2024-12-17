import {
    Animated,
    BackHandler,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, { useEffect, useRef } from 'react';
  
  const Header = () => {
    const [openLeft, setOpenLeft] = React.useState(false);
    const [openRight, setOpenRight] = React.useState(false);
  
    const animatedLeft = useRef(new Animated.Value(100)).current;
    const animatedRight = useRef(new Animated.Value(100)).current;
  
    // Function to trigger the left view animation
    const animateViewLeft = () => {
      Animated.timing(animatedLeft, {
        toValue: openLeft ? 0 : 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    };
  
    // Function to trigger the right view animation
    const animateViewRight = () => {
      Animated.timing(animatedRight, {
        toValue: openRight ? 0 : 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    };
  
    // Trigger animations
    useEffect(() => {
      animateViewLeft();
    }, [openLeft]);
  
    useEffect(() => {
      animateViewRight();
    }, [openRight]);
  
    // Unified BackHandler for both left and right views
    useEffect(() => {
      const handleBackPress = () => {
        if (openLeft) {
          setOpenLeft(false);
          return true; // Prevent default behavior
        }
        if (openRight) {
          setOpenRight(false);
          return true; // Prevent default behavior
        }
        return false; // Allow default back behavior if no views are open
      };
  
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [openLeft, openRight]);
  
    return (
      <>
        {/* Left View */}
        {openLeft && (
          <Animated.View
            style={[
              { width: '100%', height: '100%', backgroundColor: 'black'},
              {
                left: animatedLeft.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <View style={{backgroundColor: 'black', width: '100%', height: 70, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: 'gray'}}>
              <TouchableOpacity onPress={() => setOpenLeft(false)} activeOpacity={0.7}>
                <Image source={require('../assets/left-arrow.png')} style={{width: 20, height: 20, marginLeft: 10}}/>
              </TouchableOpacity>
              <Text style={{color: 'white', fontSize: 20}}>Edit Profile</Text>
            </View>
            <ScrollView>
              <View style={{width: '100%', height: '100%', alignItems: 'center', paddingVertical: 30}}>
                <View style={{width: 170, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray', borderRadius: '50%', boxShadow: '0px 0px 5px 0px rgba(25, 225, 225, 1)'}}>
                  <Image source={require('../assets/man.png')} style={{width: 160, height: 160}} />
                  <TouchableOpacity activeOpacity={0.7} style={{position: 'absolute', bottom: 10, right: 0}}>
                  <View style={{width: 40, height: 40, backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../assets/exchange.png')} style={{width: 25, height: 25}}/>
                  </View>
                  </TouchableOpacity>
                </View>
                <Text style={{...styles.label, marginTop: 50}}>Email</Text>
                <TextInput
                  inputMode="email"
                  style={styles.input}
                  value='ayushgokhle@gmail.com'
                />
                <Text style={{...styles.label, marginTop: 20}}>Username</Text>
                <TextInput
                  inputMode="text"
                  style={styles.input}
                  value="AyushG09"
                />
                <Text style={{...styles.label, marginTop: 100}}>Refered By</Text>
                <TextInput
                  inputMode="email"
                  style={styles.input}
                  value='ayushgokhle@gmail.com'
                  editable={false}
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.loginButton}>
                  <View style={styles.loginButtonContainer}>
                    <Text style={styles.loginButtonText}>Update Info</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        )}
  
        {/* Right View */}
        {openRight && (
          <Animated.View
            style={[
              { width: '100%', height: '100%', backgroundColor: 'blue' },
              {
                right: animatedRight.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <Text onPress={() => setOpenRight(false)}>Close Right</Text>
          </Animated.View>
        )}
  
        {/* Header */}
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: 'black',
            paddingHorizontal: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Right Icon */}
          <TouchableOpacity
            onPress={() => setOpenRight(true)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../assets/menu.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
  
          {/* Left Icon */}
          <TouchableOpacity
            onPress={() => setOpenLeft(true)}
            style={{ marginLeft: 'auto' }}
            activeOpacity={0.7}
          >
            <Image
              source={require('../assets/man.png')}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };
  
  export default Header;
  
  const styles = StyleSheet.create({
    input: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      borderColor: 'rgba(225, 225, 225, 0.3)',
      borderWidth: 2,
      backgroundColor: 'rgba(225, 225, 225, 0.2)',
      paddingHorizontal: 15,
      color: 'white',
      marginTop: 5
    },
    label: {
      color: 'white', width: '78%', fontWeight: '400', fontSize: 20,
    },
    loginButton: {
      minWidth: '30%',
      height: 40,
      marginRight: 'auto',
      marginLeft: '10%',
      marginTop: 50,
    },
    loginButtonContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#0288d1',
      borderRadius: 5,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.3)',
      paddingHorizontal: 10
    },
    loginButtonText: {
      textAlign: 'center',
      fontSize: 20,
      color: 'white',
      fontWeight: '600',
    },
  });
  
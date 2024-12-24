import {
  Animated,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import axiosInstance from '../axios/axiosConfig';

type State = {
  openLeft: boolean;
  updatingImage: boolean;
  email: string;
  username: string;
  termsVisible: boolean;
};

const Header = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [state, setState] = useState<State>({
    openLeft: false,
    updatingImage: false,
    email: '',
    username: '',
    termsVisible: false,
  });

  const animatedLeft = useRef(new Animated.Value(100)).current;

  // Function to trigger the left view animation
  const animateViewLeft = () => {
    Animated.timing(animatedLeft, {
      toValue: state.openLeft ? 0 : 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  // Trigger animations
  useEffect(() => {
    animateViewLeft();
  }, [state.openLeft]);

  // Unified BackHandler for both left and right views
  useEffect(() => {
    const handleBackPress = () => {
      if (state.openLeft) {
        setState(prev => ({...prev, openLeft: false}));
        return true; // Prevent default behavior
      }
      return false; // Allow default back behavior if no views are open
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, [state.openLeft]);

  useEffect(() => {
    const fetchData = async () => {
      const username = await AsyncStorage.getItem('username');
      const email = await AsyncStorage.getItem('email');
      if (username && email) {
        setState(prev => ({...prev, email: email}));
        setState(prev => ({...prev, username: username}));
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('id');
    await AsyncStorage.removeItem('image');
    navigation.navigate('Auth');
  };

  const [photo, setPhoto] = useState<string>('');

  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    if (result.assets && result.assets.length > 0) {
      const base64Image = result.assets[0].base64;
      if (base64Image) {
        const dataUri = `data:image/jpeg;base64,${base64Image}`;
        try {
          setState(prev => ({...prev, updatingImage: true}));
          const userId = await AsyncStorage.getItem('id');
          await axiosInstance.post(
            `/auth/user/${userId}/image`,
            {image: dataUri},
          );
          setPhoto(dataUri);
          await AsyncStorage.setItem('image', dataUri);
          Toast.show({
            type: 'success',
            text1: 'Profile Picture Updated',
            text2: 'Your profile picture has been updated successfully.',
          });
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Error Updating Picture',
          });
        } finally {
          setState(prev => ({...prev, updatingImage: false}));
        }
      }
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const image = await AsyncStorage.getItem('image');
      if (image) {
        setPhoto(image);
      }
    };
    fetchImage();
  }, []);

  return (
    <>
      {/* Left View */}
      {state.openLeft && (
        <Animated.View
          style={[
            {width: '100%', height: '100%', backgroundColor: 'black'},
            {
              left: animatedLeft.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}>
          <Modal isVisible={state.termsVisible}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Terms and Conditions</Text>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.bodyText}>
                  Welcome to HashMiner! Please read these Terms and Conditions
                  carefully before using the application. By accessing or using
                  the app, you agree to be bound by these terms. If you disagree
                  with any part of the terms, you may not use the app.
                </Text>

                <Text style={styles.sectionHeading}>1. General Overview</Text>
                <Text style={styles.bodyText}>
                  1.1 This application allows users to purchase and manage
                  digital miners, collect mined coins, and withdraw them based
                  on the prevailing coin price.
                  {'\n'}1.2 Users must abide by these terms to ensure a safe and
                  fair experience for everyone.
                </Text>

                <Text style={styles.sectionHeading}>2. Miners</Text>
                <Text style={styles.bodyText}>
                  {'\n'}2.1 Each miner purchased has a specific hash rate
                  (mining capability) and capacity (storage limit).
                  {'\n'}2.2 Miners will stop operating once their storage
                  capacity is full. Users must collect the mined coins to
                  restart the miner.
                  {'\n'}2.3 Coins collected from miners will be added to the
                  user's balance.
                  {'\n'}2.4 Miners have a validity period of one (1) year from
                  the date of purchase. After this period, the miner will cease
                  functioning.
                </Text>

                <Text style={styles.sectionHeading}>3. Purchasing Miners</Text>
                <Text style={styles.bodyText}>
                  {'\n'}3.1 Users can purchase miners using UPI (Unified
                  Payments Interface).
                  {'\n'}3.2 All payments are non-refundable. Ensure you review
                  your purchase before completing the transaction.
                </Text>

                <Text style={styles.sectionHeading}>4. Coin Withdrawal</Text>
                <Text style={styles.bodyText}>
                  {'\n'}4.1 Users can submit a withdrawal request to convert
                  mined coins into cash or other forms of compensation.
                  {'\n'}4.2 The withdrawal amount is calculated based on the
                  coin price on the withdrawal request date.
                  {'\n'}4.3 Withdrawal requests will be processed and confirmed
                  within 48 hours.
                  {'\n'}4.4 The application reserves the right to decline
                  withdrawal requests if fraudulent activity is suspected.
                </Text>

                <Text style={styles.sectionHeading}>5. Referral Program</Text>
                <Text style={styles.bodyText}>
                  {'\n'}5.1 Users can share their unique referral code with
                  others.
                  {'\n'}5.2 Both the referrer and the new user will receive
                  benefits if the referral code is used during the sign-up
                  process.
                  {'\n'}5.3 The referral benefits may vary and are subject to
                  change without prior notice.
                </Text>

                <Text style={styles.sectionHeading}>
                  6. Fraudulent Activity
                </Text>
                <Text style={styles.bodyText}>
                  {'\n'}6.1 Users must not attempt to alter data, manipulate the
                  system, or engage in fraudulent activities.
                  {'\n'}6.2 Any user found engaging in such activities will be
                  permanently blocked from using the application.
                  {'\n'}6.3 Legal action may be taken against users involved in
                  fraudulent practices.
                </Text>

                <Text style={styles.sectionHeading}>
                  7. User Responsibilities
                </Text>
                <Text style={styles.bodyText}>
                  {'\n'}7.1 Users are responsible for keeping their account
                  information, including passwords and referral codes,
                  confidential.
                  {'\n'}7.2 Users must provide accurate and truthful information
                  during the sign-up process and throughout their use of the
                  application.
                </Text>

                <Text style={styles.sectionHeading}>8. Privacy</Text>
                <Text style={styles.bodyText}>
                  {'\n'}8.1 The application collects and processes user data as
                  described in the Privacy Policy.
                  {'\n'}8.2 By using the app, you consent to the collection and
                  use of your data as outlined in the Privacy Policy.
                </Text>

                <Text style={styles.sectionHeading}>9. Disclaimer</Text>
                <Text style={styles.bodyText}>
                  {'\n'}9.1 The application does not guarantee specific earnings
                  or returns from miners.
                  {'\n'}9.2 Coin prices are subject to market fluctuations, and
                  the application is not responsible for any losses resulting
                  from price changes.
                </Text>

                <Text style={styles.sectionHeading}>10. Amendments</Text>
                <Text style={styles.bodyText}>
                  {'\n'}10.1 These terms may be updated periodically. Users will
                  be notified of significant changes, and continued use of the
                  application after such changes constitutes acceptance of the
                  revised terms.
                </Text>

                <Text style={styles.sectionHeading}>11. Governing Law</Text>
                <Text style={styles.bodyText}>
                  {'\n'}11.1 These terms are governed by the laws of [Your
                  Country/Region].
                  {'\n'}11.2 Any disputes arising from these terms shall be
                  resolved through arbitration in [Your Jurisdiction].
                </Text>

                <Text style={styles.sectionHeading}>12. Contact</Text>
                <Text style={styles.bodyText}>
                  {'\n'}If you have any questions or concerns about these terms,
                  please contact us at [support email or contact information].
                </Text>

                <Text style={styles.footerText}>
                  By signing up or using this application, you agree to these
                  Terms and Conditions.
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setState(prev => ({...prev, termsVisible: false}))
                  }
                  activeOpacity={0.7}
                  style={{
                    ...styles.loginButton,
                    marginRight: 0,
                    marginLeft: 0,
                  }}>
                  <View style={styles.loginButtonContainer}>
                    <Text style={styles.loginButtonText}>Close</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>
          <View
            style={{
              backgroundColor: 'black',
              width: '100%',
              height: 70,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              borderBottomWidth: 0.5,
              borderBottomColor: 'gray',
            }}>
            <TouchableOpacity
              onPress={() => setState(prev => ({...prev, openLeft: false}))}
              activeOpacity={0.7}>
              <Image
                source={require('../assets/left-arrow.png')}
                style={{width: 20, height: 20, marginLeft: 10}}
              />
            </TouchableOpacity>
            <Text style={{color: 'white', fontSize: 20}}>Edit Profile</Text>
          </View>
          <ScrollView>
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                paddingVertical: 30,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'gray',
                  borderRadius: '50%',
                  boxShadow: '0px 0px 15px 0px rgba(25, 225, 225, 1)',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={photo ? {uri: photo} : require('../assets/man.png')}
                    style={{width: 160, height: 160}}
                  />
                </View>
                {!state.updatingImage && (
                  <TouchableOpacity
                    onPress={openGallery}
                    activeOpacity={0.7}
                    style={{position: 'absolute', bottom: 10, right: 0}}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/exchange.png')}
                        style={{width: 25, height: 25}}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={{...styles.label, marginTop: 50}}>Email</Text>
              <TextInput
                inputMode="email"
                style={styles.input}
                value={state.email}
                editable={false}
              />
              <Text style={{...styles.label, marginTop: 20}}>Username</Text>
              <TextInput
                inputMode="text"
                style={styles.input}
                value={state.username}
                editable={false}
              />
              <Text style={{...styles.label, marginTop: 100}}>Refered By</Text>
              <TextInput
                inputMode="email"
                style={styles.input}
                value="ayushgokhle@gmail.com"
                editable={false}
              />

              <TouchableOpacity
                onPress={() =>
                  setState(prev => ({...prev, termsVisible: true}))
                }
                activeOpacity={0.7}
                style={styles.loginButton}>
                <View style={styles.loginButtonContainer}>
                  <Text style={styles.loginButtonText}>Terms & Conditions</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={logout}
                activeOpacity={0.7}
                style={styles.loginButton}>
                <View style={styles.loginButtonContainer}>
                  <Text style={styles.loginButtonText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
        }}>
        {/* Left Icon */}
        <TouchableOpacity
          onPress={() => setState(prev => ({...prev, openLeft: true}))}
          style={{marginLeft: 'auto'}}
          activeOpacity={0.7}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
            }}>
            <Image
              source={photo ? {uri: photo} : require('../assets/man.png')}
              style={{width: 40, height: 40}}
            />
          </View>
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
    marginTop: 5,
  },
  label: {
    color: 'white',
    width: '78%',
    fontWeight: '400',
    fontSize: 20,
  },
  loginButton: {
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
    paddingHorizontal: 10,
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  modalContainer: {
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginTop: 10,
  },
  bodyText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

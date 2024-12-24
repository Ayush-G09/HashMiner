import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {emailRegex} from '../utils';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import axiosInstance from '../axios/axiosConfig';

type State = {
  email: {
    value: string;
    error: string;
  };
  password: {
    value: string;
    error: string;
    show: boolean;
  };
  loading: boolean;
  forgotPassword: boolean;
  resetPassEmail: {value: string; error: string};
  validOtp: {value: string; loading: boolean};
  timer: number;
  otp: string[];
  otpSent: boolean;
  otpVerified: {value: boolean; msg: string};
  isTimerRunning: boolean;
  resetPass: {value: string; error: string; show: boolean};
  resetCnfPass: {value: string; error: string; show: boolean};
  resetPassloading: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const Auth = ({navigation}: Props) => {
  const [state, setState] = useState<State>({
    email: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
      show: false,
    },
    loading: false,
    forgotPassword: false,
    resetPassEmail: {value: '', error: ''},
    validOtp: {value: '', loading: false},
    timer: 120,
    otp: Array(6).fill(''),
    otpSent: false,
    otpVerified: {value: false, msg: ''},
    isTimerRunning: true,
    resetPass: {value: '', error: '', show: false},
    resetCnfPass: {value: '', error: '', show: false},
    resetPassloading: false,
  });

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleLogin = async () => {
    if (!state.email.value) {
      setState(prev => ({
        ...prev,
        email: {...prev.email, error: 'Email is required'},
      }));
      return;
    } else {
      setState(prev => ({...prev, email: {...prev.email, error: ''}}));
    }

    if (!emailRegex.test(state.email.value)) {
      setState(prev => ({
        ...prev,
        email: {...prev.email, error: 'Invalid email address'},
      }));
      return;
    } else {
      setState(prev => ({...prev, email: {...prev.email, error: ''}}));
    }

    if (!state.password.value) {
      setState(prev => ({
        ...prev,
        password: {...prev.password, error: 'Password is required'},
      }));
      return;
    } else {
      setState(prev => ({...prev, password: {...prev.password, error: ''}}));
    }

    const data = {email: state.email.value, password: state.password.value};

    try {
      setState(prev => ({...prev, loading: true}));
      const response = await axiosInstance.post(
        '/auth/login',
        data,
      );
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('username', response.data.user.username);
      await AsyncStorage.setItem('email', response.data.user.email);
      await AsyncStorage.setItem('id', response.data.user.id);
      await AsyncStorage.setItem('image', response.data.user.image);
      setState(prev => ({
        ...prev,
        email: {...prev.email, value: ''},
        password: {...prev.password, value: ''},
      }));
      Toast.show({
        type: 'success',
        text1: `Welcome ${response.data.user.username}! 🎉`,
        visibilityTime: 2000,
      });
      navigation.navigate('Layout');
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setState(prev => ({...prev, loading: false}));
    }
  };

  const sendOtp = async () => {
    if (!state.resetPassEmail.value) {
      setState(prev => ({
        ...prev,
        resetPassEmail: {...prev.resetPassEmail, error: 'Email is required'},
      }));
      return;
    } else {
      setState(prev => ({
        ...prev,
        resetPassEmail: {...prev.resetPassEmail, error: ''},
      }));
    }

    // Validate email format
    if (!emailRegex.test(state.resetPassEmail.value)) {
      setState(prev => ({
        ...prev,
        resetPassEmail: {...prev.resetPassEmail, error: 'Invalid email'},
      }));
      return; // Exit early if email is invalid
    } else {
      setState(prev => ({
        ...prev,
        resetPassEmail: {...prev.resetPassEmail, error: ''},
      }));
    }

    try {
      // Send OTP request to backend
      setState(prev => ({
        ...prev,
        validOtp: {...prev.validOtp, loading: true},
      }));
      const response = await axiosInstance.post(
        '/auth/reset-password-send-otp',
        {email: state.resetPassEmail.value},
      );

      const data = response.data;
      console.log({otp: data.otp});
      // Update the state on successful OTP send
      setState(prev => ({
        ...prev,
        timer: 120,
        validOtp: {...prev.validOtp, value: data.otp},
        otpSent: true,
      }));
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err.response.data.message,
      });
    } finally {
      setState(prev => ({
        ...prev,
        validOtp: {...prev.validOtp, loading: false},
      }));
    }
  };

  const verifyOtp = () => {
    console.log({otp: state.validOtp.value, otpEntered: state.otp.join('')});
    if (state.otp.join('') === state.validOtp.value) {
      setState(prev => ({
        ...prev,
        otpVerified: {...prev.otpVerified, value: true, msg: ''},
        isTimerRunning: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        otpVerified: {...prev.otpVerified, msg: 'Invalid Otp'},
      }));
    }
  };

  const handleResendOtp = () => {
    setState(prev => ({...prev, timer: 120, isTimerRunning: true}));
    sendOtp();
  };

  const handleInputChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...state.otp];
    newOtp[index] = text;
    setState(prev => ({...prev, otp: newOtp}));

    // Move focus to the next input if not the last index
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && index > 0 && state.otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resetPassword = async () => {
    if (!state.resetPass.value) {
      setState(prev => ({
        ...prev,
        resetPass: {...prev.resetPass, error: 'Password required'},
      }));
      return;
    } else {
      setState(prev => ({...prev, resetPass: {...prev.resetPass, error: ''}}));
    }

    if (!state.resetCnfPass.value) {
      setState(prev => ({
        ...prev,
        resetCnfPass: {...prev.resetCnfPass, error: 'Password required'},
      }));
      return;
    } else {
      setState(prev => ({
        ...prev,
        resetCnfPass: {...prev.resetCnfPass, error: ''},
      }));
    }

    if (state.resetCnfPass.value !== state.resetPass.value) {
      setState(prev => ({
        ...prev,
        resetCnfPass: {...prev.resetCnfPass, error: 'Password do not match'},
      }));
      return;
    } else {
      setState(prev => ({
        ...prev,
        resetCnfPass: {...prev.resetCnfPass, error: ''},
      }));
    }

    try {
      setState(prev => ({...prev, resetPassloading: true}));
      const data = {
        email: state.resetPassEmail.value,
        newPassword: state.resetPass.value,
      };
      await axiosInstance.post(
        '/auth/reset-password',
        data,
      );
      Toast.show({
        type: 'success',
        text1: 'Password changed successfully',
      });
      setState(prev => ({...prev, forgotPassword: false}));
    } catch (err: any) {
      console.error({error: err.response.data});
    } finally {
      setState(prev => ({...prev, resetPassloading: false}));
    }
  };

  useEffect(() => {
      let interval: NodeJS.Timeout | undefined;
  
      if (state.isTimerRunning && state.timer > 0) {
        // Start the countdown
        interval = setInterval(() => {
          setState(prev => ({...prev, timer: state.timer - 1}));
        }, 1000);
      } else if (state.timer === 0) {
        // When timer ends, stop the countdown
        setState(prev => ({...prev, isTimerRunning: false}));
        clearInterval(interval);
      }
  
      return () => clearInterval(interval); // Cleanup interval
    }, [state.isTimerRunning, state.timer]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
        <Modal isVisible={state.forgotPassword}>
          <View style={styles.modalContainer}>
            <View style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{width: '95%', color: 'white', fontSize: 20, fontWeight: 600, textAlign: 'center'}}>
                Reset Password
              </Text>
              <TouchableOpacity activeOpacity={0.7} style={{paddingHorizontal: 5}} onPress={() => setState((prev) => ({...prev, forgotPassword: false}))}>
                <Text style={{color: 'red', fontSize: 20, fontWeight: 800}}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              inputMode="email"
              style={{...styles.input, marginTop: 50}}
              placeholder="Email"
              value={state.resetPassEmail.value}
              onChangeText={e =>
                setState(prev => ({
                  ...prev,
                  resetPassEmail: {...prev.resetPassEmail, value: e},
                }))
              }
              editable={!state.otpVerified.value}
            />
            {state.resetPassEmail.error && (
              <Text style={{color: 'red', width: '80%', marginTop: 2}}>
                {state.resetPassEmail.error}
              </Text>
            )}
            {!state.otpSent && (
              <TouchableOpacity
                onPress={sendOtp}
                activeOpacity={0.7}
                style={{...styles.loginButton, marginTop: 30}}>
                <View style={styles.loginButtonContainer}>
                  {state.validOtp.loading ? (
                    <ActivityIndicator size={25} color={'white'} />
                  ) : (
                    <Text style={styles.loginButtonText}>Get OTP</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {state.otpSent && !state.otpVerified.value && (
              <>
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: '10%',
                    color: 'white',
                    fontWeight: 500,
                    marginBottom: 5,
                    marginTop: 30,
                  }}>
                  OTP
                </Text>
                <View style={styles.otpContainer}>
                  {state.otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={styles.otpInput}
                      keyboardType="numeric"
                      maxLength={1}
                      value={digit}
                      onChangeText={text => handleInputChange(text, index)}
                      onKeyPress={({nativeEvent}) =>
                        handleKeyPress(nativeEvent.key, index)
                      }
                    />
                  ))}
                </View>
                {state.otpVerified.msg && (
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: '10%',
                      marginTop: 5,
                      color: 'red',
                    }}>
                    {state.otpVerified.msg}
                  </Text>
                )}
                <View style={styles.timerContainer}>
                  {state.isTimerRunning ? (
                    <Text style={styles.timerText}>
                      Resend OTP in{' '}
                      <Text style={styles.highlight}>{state.timer}s</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={verifyOtp}
                    activeOpacity={0.7}
                    style={{
                      ...styles.loginButton,
                      marginTop: 0,
                      marginRight: 0,
                      display: state.otp.some(value => value === '')
                        ? 'none'
                        : 'flex',
                    }}>
                    <View style={styles.loginButtonContainer}>
                      <Text style={styles.loginButtonText}>Verify</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {state.otpVerified.value && (
              <>
                <View style={styles.passwordContainer}>
                  <TextInput
                    inputMode="text"
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={!state.resetPass.show}
                    value={state.resetPass.value}
                    onChangeText={e =>
                      setState(prev => ({
                        ...prev,
                        resetPass: {...prev.resetPass, value: e},
                      }))
                    }
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setState(prev => ({
                        ...prev,
                        resetPass: {
                          ...prev.resetPass,
                          show: !state.resetPass.show,
                        },
                      }))
                    }
                    activeOpacity={0.7}
                    style={styles.passwordIconContainer}>
                    <Image
                      source={
                        state.resetPass.show
                          ? require('../assets/eye.png')
                          : require('../assets/hidden.png')
                      }
                      style={styles.passwordIcon}
                    />
                  </TouchableOpacity>
                </View>
                {state.resetPass.error && (
                  <Text style={{color: 'red', width: '80%', marginTop: 2}}>
                    {state.resetPass.error}
                  </Text>
                )}

                <View style={styles.passwordContainer}>
                  <TextInput
                    inputMode="text"
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    secureTextEntry={!state.resetCnfPass.show}
                    value={state.resetCnfPass.value}
                    onChangeText={e =>
                      setState(prev => ({
                        ...prev,
                        resetCnfPass: {...prev.resetCnfPass, value: e},
                      }))
                    }
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setState(prev => ({
                        ...prev,
                        resetCnfPass: {
                          ...prev.resetCnfPass,
                          show: !state.resetCnfPass.show,
                        },
                      }))
                    }
                    activeOpacity={0.7}
                    style={styles.passwordIconContainer}>
                    <Image
                      source={
                        state.resetCnfPass.show
                          ? require('../assets/eye.png')
                          : require('../assets/hidden.png')
                      }
                      style={styles.passwordIcon}
                    />
                  </TouchableOpacity>
                </View>
                {state.resetCnfPass.error && (
                  <Text style={{color: 'red', width: '80%', marginTop: 2}}>
                    {state.resetCnfPass.error}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={resetPassword}
                  activeOpacity={0.7}
                  style={styles.loginButton}>
                  <View style={styles.loginButtonContainer}>
                    {state.resetPassloading ? (
                      <ActivityIndicator size={25} color={'white'} />
                    ) : (
                      <Text style={styles.loginButtonText}>Reset Password</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
        <View style={styles.form}>
          <Image source={require('../assets/logo2.png')} style={styles.logo} />
          <Text style={styles.appName}>HashMiner</Text>
          <Text style={styles.tagline}>
            Unlocking digital wealth, One hash a time
          </Text>
          <TextInput
            inputMode="email"
            style={[styles.input, styles.emailInput]}
            placeholder="Email"
            value={state.email.value}
            onChangeText={e =>
              setState(prev => ({...prev, email: {...prev.email, value: e}}))
            }
          />
          {state.email.error && (
            <Text style={{color: 'red', width: '80%', marginTop: 2}}>
              {state.email.error}
            </Text>
          )}
          <View style={styles.passwordContainer}>
            <TextInput
              inputMode="text"
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!state.password.show}
              value={state.password.value}
              onChangeText={e =>
                setState(prev => ({
                  ...prev,
                  password: {...prev.password, value: e},
                }))
              }
            />
            <TouchableOpacity
              onPress={() =>
                setState(prev => ({
                  ...prev,
                  password: {...prev.password, show: !state.password.show},
                }))
              }
              activeOpacity={0.7}
              style={styles.passwordIconContainer}>
              <Image
                source={
                  state.password.show
                    ? require('../assets/eye.png')
                    : require('../assets/hidden.png')
                }
                style={styles.passwordIcon}
              />
            </TouchableOpacity>
          </View>
          {state.password.error && (
            <Text style={{color: 'red', width: '80%', marginTop: 2}}>
              {state.password.error}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => setState(prev => ({...prev, forgotPassword: true}))}
            style={styles.forgotPassword}
            activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.7}
            style={styles.loginButton}>
            <View style={styles.loginButtonContainer}>
              {state.loading ? (
                <ActivityIndicator size={25} color={'white'} />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountText}>
              Didn't have an account / Create new
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Auth;

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
  form: {
    width: '90%',
    paddingVertical: 40,
    backgroundColor: 'rgba(225, 225, 225, 0.2)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  tagline: {
    color: 'gray',
  },
  input: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderColor: 'rgba(225, 225, 225, 0.3)',
    borderWidth: 2,
    backgroundColor: 'rgba(225, 225, 225, 0.2)',
    paddingHorizontal: 15,
    color: 'white',
  },
  emailInput: {
    marginTop: 80,
  },
  passwordContainer: {
    marginTop: 20,
    width: '80%',
    height: 50,
    borderRadius: 10,
    borderColor: 'rgba(225, 225, 225, 0.3)',
    borderWidth: 2,
    backgroundColor: 'rgba(225, 225, 225, 0.2)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  passwordInput: {
    width: '85%',
    height: '100%',
    paddingHorizontal: 15,
    color: 'white',
  },
  passwordIconContainer: {
    height: '100%',
    width: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordIcon: {
    width: 20,
    height: 20,
  },
  forgotPassword: {
    width: '80%',
    marginTop: 6,
    padding: 4,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: 'white',
  },
  loginButton: {
    height: 40,
    marginLeft: 'auto',
    marginRight: '10%',
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
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  createAccountText: {
    color: 'white',
    marginTop: 70,
    fontWeight: '500',
    padding: 4,
  },
  modalContainer: {
    height: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0px 0px 5px 0px rgba(225, 225, 225, 0.3)',
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
  },
  otpInput: {
    width: 40,
    height: 50,
    borderRadius: 10,
    borderColor: 'rgba(225, 225, 225, 0.3)',
    borderWidth: 2,
    backgroundColor: 'rgba(225, 225, 225, 0.2)',
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  timerContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
  },
  timerText: {
    fontSize: 16,
    color: 'gray',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#ff6347',
  },
  resendText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

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
import axios from 'axios';
import Toast from 'react-native-toast-message';

type State = {
  email: {
    value: string;
    error: string;
    otpSent: boolean;
    otpVerified: {
      value: boolean;
      msg: string;
    };
  };
  username: {
    value: string;
    error: string;
  };
  password: {
    value: string;
    error: string;
    show: boolean;
  };
  cnfPassword: {
    value: string;
    error: string;
    show: boolean;
  };
  validOtp: {
    value: string;
    loading: boolean;
  };
  signupLoading: boolean;
  otp: string[];
  timer: number;
  isTimerRunning: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = ({navigation}: Props) => {
  const [state, setState] = useState<State>({
    email: {
      value: '',
      error: '',
      otpSent: false,
      otpVerified: {
        value: false,
        msg: '',
      },
    },
    username: {
      value: '',
      error: '',
    },
    password: {
      value: '',
      error: '',
      show: false,
    },
    cnfPassword: {
      value: '',
      error: '',
      show: false,
    },
    validOtp: {
      value: '',
      loading: false,
    },
    signupLoading: false,
    otp: Array(6).fill(''),
    timer: 120,
    isTimerRunning: true,
  });

  // Explicitly typing the ref as an array of TextInput or null
  const inputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleResendOtp = () => {
    // Reset timer when user clicks 'Resend OTP'
    setState(prev => ({...prev, timer: 120, isTimerRunning: true}));
    sendOtp();
  };

  const sendOtp = async () => {
    if (!state.email.value) {
      setState(prev => ({
        ...prev,
        email: {...prev.email, error: 'Email is required'},
      }));
      return;
    } else {
      setState(prev => ({...prev, email: {...prev.email, error: ''}}));
    }

    // Validate email format
    if (!emailRegex.test(state.email.value)) {
      setState(prev => ({
        ...prev,
        email: {...prev.email, error: 'Invalid email'},
      }));
      return; // Exit early if email is invalid
    } else {
      setState(prev => ({...prev, email: {...prev.email, error: ''}}));
    }

    try {
      // Send OTP request to backend
      setState(prev => ({
        ...prev,
        validOtp: {...prev.validOtp, loading: true},
      }));
      const response = await axios.post(
        'https://hash-miner-backend.vercel.app/api/auth/send-otp',
        {email: state.email.value},
      );

      const data = response.data;
      console.log({otp: data.otp});
      // Update the state on successful OTP send
      setState(prev => ({...prev, timer: 120}));
      setState(prev => ({
        ...prev,
        email: {...prev.email, otpSent: true},
        validOtp: {...prev.validOtp, value: data.otp},
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
        email: {...prev.email, otpVerified: {value: true, msg: ''}},
        isTimerRunning: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        email: {
          ...prev.email,
          otpVerified: {...prev.email.otpVerified, msg: 'Invalid Otp'},
        },
      }));
    }
  };

  const handleRegister = async () => {
    if (!state.username.value) {
      setState(prev => ({
        ...prev,
        username: {...prev.username, error: 'Username is required'},
      }));
      return;
    } else {
      setState(prev => ({...prev, username: {...prev.username, error: ''}}));
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
    if (!state.cnfPassword.value) {
      setState(prev => ({
        ...prev,
        cnfPassword: {...prev.cnfPassword, error: 'Password is required'},
      }));
      return;
    } else {
      setState(prev => ({
        ...prev,
        cnfPassword: {...prev.cnfPassword, error: ''},
      }));
    }
    if (state.password.value !== state.cnfPassword.value) {
      setState(prev => ({
        ...prev,
        cnfPassword: {...prev.cnfPassword, error: 'Passwords do not match'},
      }));
      return;
    } else {
      setState(prev => ({
        ...prev,
        cnfPassword: {...prev.cnfPassword, error: ''},
      }));
    }
    const data = {
      username: state.username.value,
      email: state.email.value,
      password: state.password.value,
    };

    try {
      setState(prev => ({...prev, signupLoading: true}));
      await axios.post(
        'https://hash-miner-backend.vercel.app/api/auth/register',
        data,
      );
      Toast.show({
        type: 'success',
        text1: 'User registered successfully! 🎉',
        visibilityTime: 2000,
      });
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Failed to register', error);
    } finally {
      setState(prev => ({...prev, signupLoading: false}));
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/gra4.jpg')}
        style={styles.backgroundImage}>
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
            editable={!state.email.otpVerified.value}
          />
          {state.email.error && (
            <Text style={{color: 'red', width: '80%', marginTop: 2}}>
              {state.email.error}
            </Text>
          )}

          {!state.email.otpSent && (
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
          {state.email.otpSent && !state.email.otpVerified.value && (
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
              {state.email.otpVerified.msg && (
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: '10%',
                    marginTop: 5,
                    color: 'red',
                  }}>
                  {state.email.otpVerified.msg}
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

          {state.email.otpVerified.value && (
            <>
              <TextInput
                inputMode="text"
                style={{...styles.input, marginTop: 20}}
                placeholder="Username"
                value={state.username.value}
                onChangeText={e =>
                  setState(prev => ({
                    ...prev,
                    username: {...prev.username, value: e},
                  }))
                }
              />
              {state.username.error && (
                <Text style={{color: 'red', width: '80%', marginTop: 2}}>
                  {state.username.error}
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

              <View style={styles.passwordContainer}>
                <TextInput
                  inputMode="text"
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  secureTextEntry={!state.cnfPassword.show}
                  value={state.cnfPassword.value}
                  onChangeText={e =>
                    setState(prev => ({
                      ...prev,
                      cnfPassword: {...prev.cnfPassword, value: e},
                    }))
                  }
                />
                <TouchableOpacity
                  onPress={() =>
                    setState(prev => ({
                      ...prev,
                      cnfPassword: {
                        ...prev.cnfPassword,
                        show: !state.cnfPassword.show,
                      },
                    }))
                  }
                  activeOpacity={0.7}
                  style={styles.passwordIconContainer}>
                  <Image
                    source={
                      state.cnfPassword.show
                        ? require('../assets/eye.png')
                        : require('../assets/hidden.png')
                    }
                    style={styles.passwordIcon}
                  />
                </TouchableOpacity>
              </View>
              {state.cnfPassword.error && (
                <Text style={{color: 'red', width: '80%', marginTop: 2}}>
                  {state.cnfPassword.error}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleRegister}
                activeOpacity={0.7}
                style={styles.loginButton}>
                <View style={styles.loginButtonContainer}>
                  {state.signupLoading ? (
                    <ActivityIndicator size={25} color={'white'} />
                  ) : (
                    <Text style={styles.loginButtonText}>Signup</Text>
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.createAccountText}>
              Already have an account / Login
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Register;

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
    width: '30%',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
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

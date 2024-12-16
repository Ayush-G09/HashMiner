import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {emailRegex} from '../utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

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
  });

  const handleLogin = () => {
    if (state.email.value) {
      if (emailRegex.test(state.email.value)) {
        setState(prev => ({...prev, email: {...prev.email, error: ''}}));
        if (state.password.value) {
          setState(prev => ({
            ...prev,
            password: {...prev.password, error: ''},
          }));
          console.log('logged in');
        } else {
          setState(prev => ({
            ...prev,
            password: {...prev.password, error: 'Password Required'},
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          email: {...prev.email, error: 'Enter a valid email'},
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        email: {...prev.email, error: 'Email Required'},
      }));
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
              secureTextEntry={state.password.show}
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

          <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.7}
            style={styles.loginButton}>
            <View style={styles.loginButtonContainer}>
              <Text style={styles.loginButtonText}>Login</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
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
});

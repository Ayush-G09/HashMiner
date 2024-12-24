import React from 'react';
import Auth from './views/Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './views/Register';
import Home from './views/Home';
import Leaderboard from './views/Leaderboard';
import Subsctiption from './views/Subscription';
import Layout from './views/Layout';
import Activity from './views/Activity';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';
import Splash from './views/Splash';
import { Provider } from 'react-redux';
import store from './store/store';

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Home: undefined;
  Activity: undefined;
  Leaderboard: undefined;
  Subscription: undefined;
  Layout: undefined;
  Splash: undefined;
  Wallet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#90EE90', borderLeftWidth: 8, backgroundColor: 'black', boxShadow: '0px 0px 5px 0px rgb(144, 238, 144)' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#DC143C', borderLeftWidth: 8, backgroundColor: 'black', boxShadow: '0px 0px 5px 0px rgb(220, 20, 60)' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: 'white'
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, props }: { text1?: string; props: { uuid: string } }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen 
        name="Splash" 
        component={Splash} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Auth" 
        component={Auth} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Layout" 
        component={Layout} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Activity" 
        component={Activity} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Leaderboard" 
        component={Leaderboard} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Subscription" 
        component={Subsctiption} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </Provider>
  );
}

export default App;

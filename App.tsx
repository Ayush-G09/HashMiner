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

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Home: undefined;
  Activity: undefined;
  Leaderboard: undefined;
  Subscription: undefined;
  Layout: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Auth">
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
    <NavigationContainer>
        <RootStack />
    </NavigationContainer>
  );
}

export default App;

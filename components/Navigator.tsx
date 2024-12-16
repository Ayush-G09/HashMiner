import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Home from '../views/Home';
import Activity from '../views/Activity';
import Leaderboard from '../views/Leaderboard';
import Subscription from '../views/Subscription';

type RouteName = 'Home' | 'Activity' | 'Leaderboard' | 'Subscription';

const Tab = createBottomTabNavigator();

// Custom Tab Bar Component with TypeScript Props
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {

    const iconMapping: Record<RouteName, { active: any; inactive: any }> = {
        Home: {
          active: require('../assets/home-s.png'),
          inactive: require('../assets/home.png'),
        },
        Activity: {
          active: require('../assets/activity-s.png'),
          inactive: require('../assets/activity.png'),
        },
        Leaderboard: {
          active: require('../assets/leaderboard-s.png'),
          inactive: require('../assets/leaderboard.png'),
        },
        Subscription: {
          active: require('../assets/installment-invoice-s.png'),
          inactive: require('../assets/installment-invoice.png'),
        },
      };


  return (
    <View style={styles.customTabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icon = isFocused
        ? iconMapping[route.name as RouteName]?.active
        : iconMapping[route.name as RouteName]?.inactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
          activeOpacity={0.7}
            key={route.key}
            onPress={onPress}
            style={{...styles.tabButton, backgroundColor: isFocused ? 'rgba(128, 128, 128, 0.4)' : 'transparent'}}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <Image source={icon} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />} // Replace default tab bar
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Activity" component={Activity} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="Subscription" component={Subscription} />
    </Tab.Navigator>
  );
};

export default Navigator;

// Styles
const styles = StyleSheet.create({
  customTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    height: 70,
    paddingBottom: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: '50%',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
});
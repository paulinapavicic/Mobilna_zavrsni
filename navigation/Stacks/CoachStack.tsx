import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SkaterStackNavigator from './SkaterStackNavigator';
import ProgramStackNavigator from './ProgramStackNavigator';
import EducationStackNavigator from './EducationStackNavigator';
import ProfileScreen from '../../screens/Profile/ProfileScreen';
import HomeScreen from '../../screens/Home/HomeScreen';
import Ionicons from '@react-native-vector-icons/ionicons';


const Tab = createBottomTabNavigator();

const CoachStack: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        switch (route.name) {
          case 'Home': iconName = 'house'; break;
          case 'Skaters': iconName = 'people'; break;
          case 'Programs': iconName = 'albums'; break;
          case 'Education': iconName = 'school'; break;
          case 'Profile': iconName = 'person'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Skaters" component={SkaterStackNavigator} />
    <Tab.Screen name="Programs" component={ProgramStackNavigator} />
    <Tab.Screen name="Education" component={EducationStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default CoachStack;

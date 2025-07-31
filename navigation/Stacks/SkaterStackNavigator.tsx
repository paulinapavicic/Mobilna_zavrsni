import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SkaterListScreen from '../../screens/Skaters/SkaterListScreen';
import SkaterCreateScreen from '../../screens/Skaters/SkaterCreateScreen';
import SkaterEditScreen from '../../screens/Skaters/SkaterEditScreen';
import SkaterDetailsScreen from '../../screens/Skaters/SkaterDetailsScreen';
import SkaterDeleteScreen from '../../screens/Skaters/SkaterDeleteScreen';

const Stack = createNativeStackNavigator();

const SkaterStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="SkaterList" component={SkaterListScreen} options={{ title: 'Skaters' }} />
    <Stack.Screen name="SkaterCreate" component={SkaterCreateScreen} options={{ title: 'Add Skater' }} />
    <Stack.Screen name="SkaterEdit" component={SkaterEditScreen} options={{ title: 'Edit Skater' }} />
    <Stack.Screen name="SkaterDetails" component={SkaterDetailsScreen} options={{ title: 'Skater Details' }} />
    <Stack.Screen name="SkaterDelete" component={SkaterDeleteScreen} options={{ title: 'Delete Skater' }} />
  </Stack.Navigator>
);

export default SkaterStackNavigator;

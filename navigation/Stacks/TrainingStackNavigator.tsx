import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrainingListScreen from '../../screens/Training/TrainingListScreen';
import TrainingCreateScreen from '../../screens/Training/TrainingCreateScreen';
import TrainingEditScreen from '../../screens/Training/TrainingEditScreen';
import TrainingDetailsScreen from '../../screens/Training/TrainingDetailsScreen';
import TrainingDeleteScreen from '../../screens/Training/TrainingDeleteScreen';
import TrainingAnalyticsScreen from '../../screens/Training/TrainingAnalyticsScreen';

const Stack = createNativeStackNavigator();

const TrainingStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="TrainingList" component={TrainingListScreen} options={{ title: 'Training Sessions' }} />
    <Stack.Screen name="TrainingCreate" component={TrainingCreateScreen} options={{ title: 'Add Training' }} />
    <Stack.Screen name="TrainingEdit" component={TrainingEditScreen} options={{ title: 'Edit Training' }} />
    <Stack.Screen name="TrainingDetails" component={TrainingDetailsScreen} options={{ title: 'Training Details' }} />
    <Stack.Screen name="TrainingDelete" component={TrainingDeleteScreen} options={{ title: 'Delete Training' }} />
    <Stack.Screen name="TrainingAnalytics" component={TrainingAnalyticsScreen} options={{ title: 'Training Analytics' }} />
  </Stack.Navigator>
);

export default TrainingStackNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgramListScreen from '../../screens/Program/ProgramsListScreen';
import ProgramCreateScreen from '../../screens/Program/ProgramCreateScreen';
import ProgramEditScreen from '../../screens/Program/ProgramEditScreen';
import ProgramDetailsScreen from '../../screens/Program/ProgramDetailsScreen';
import ProgramDeleteScreen from '../../screens/Program/ProgramDeleteScreen';
import MusicUploadScreen from '../../screens/Music/MusicUploadScreen';

const Stack = createNativeStackNavigator();

const ProgramStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProgramList" component={ProgramListScreen} options={{ title: 'Programs' }} />
    <Stack.Screen name="ProgramCreate" component={ProgramCreateScreen} options={{ title: 'Add Program' }} />
    <Stack.Screen name="ProgramEdit" component={ProgramEditScreen} options={{ title: 'Edit Program' }} />
    <Stack.Screen name="ProgramDetails" component={ProgramDetailsScreen} options={{ title: 'Program Details' }} />
    <Stack.Screen name="ProgramDelete" component={ProgramDeleteScreen} options={{ title: 'Delete Program' }} />
    <Stack.Screen name="MusicUpload" component={MusicUploadScreen} options={{ title: 'Upload Music' }} />
  </Stack.Navigator>
);

export default ProgramStackNavigator;

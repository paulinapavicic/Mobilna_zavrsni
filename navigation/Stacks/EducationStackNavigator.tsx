import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EducationListScreen from '../../screens/Education/EducationListScreen';
import EducationCreateScreen from '../../screens/Education/EducationCreateScreen';
import EducationDetailsScreen from '../../screens/Education/EducationDetailsScreen';
import EducationDeleteScreen from '../../screens/Education/EducationDeleteScreen';
import EducationalFileUploadScreen from '../../screens/EducationalFile/EducationalFileUploadScreen';

const Stack = createNativeStackNavigator();

const EducationStackNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="EducationList" component={EducationListScreen} options={{ title: 'Educational Materials' }} />
    <Stack.Screen name="EducationCreate" component={EducationCreateScreen} options={{ title: 'Add Material' }} />
    <Stack.Screen name="EducationDetails" component={EducationDetailsScreen} options={{ title: 'Material Details' }} />
    <Stack.Screen name="EducationDelete" component={EducationDeleteScreen} options={{ title: 'Delete Material' }} />
    <Stack.Screen name="EducationalFileUpload" component={EducationalFileUploadScreen} options={{ title: 'Upload File' }} />
  </Stack.Navigator>
);

export default EducationStackNavigator;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './navigation/AuthContext';
import AuthStack from './navigation/Stacks/AuthStack';
import CoachStack from './navigation/Stacks/CoachStack';
import SkaterStack from './navigation/Stacks/SkaterStack';
import { ActivityIndicator, View } from 'react-native';

// ✅ ROOT COMPONENT THAT HANDLES LOGIC
const RootNavigator = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    return <AuthStack />;
  }

  if (user.role === 'Coach') {
    return <CoachStack />;
  }

  if (user.role === 'Skater') {
    return <SkaterStack />;
  }

  // Fallback UI while user is being determined
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
};

// ✅ WRAPS EVERYTHING IN PROVIDERS
const App = () => (
  <AuthProvider>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  </AuthProvider>
);

export default App;



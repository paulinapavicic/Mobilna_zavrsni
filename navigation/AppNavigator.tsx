import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './Stacks/AuthStack';
import CoachStack from './Stacks/CoachStack';
import SkaterStack from './Stacks/SkaterStack';
import { AuthContext } from './AuthContext';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    return <AuthStack />;
  }

  if (user.role === 'Coach') {
    return <CoachStack />;
  }

  return <SkaterStack />;
};
export default AppNavigator;

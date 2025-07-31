import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthContext } from '../navigation/AuthContext';

type NavBarProps = {
  currentRoute: string;
};

const SkatingNavBar: React.FC<NavBarProps> = ({ currentRoute }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { userRole, logout } = React.useContext(AuthContext);

  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Figure Skating App</Text>
      <View style={styles.links}>
        {userRole === 'Coach' ? (
          <>
            <NavLink label="Skaters" route="SkaterList" currentRoute={currentRoute} />
            <NavLink label="Programs" route="ProgramList" currentRoute={currentRoute} />
            <NavLink label="Education" route="EducationList" currentRoute={currentRoute} />
            <NavLink label="Profile" route="Profile" currentRoute={currentRoute} />
          </>
        ) : userRole === 'Skater' ? (
          <>
            <NavLink label="Training" route="TrainingList" currentRoute={currentRoute} />
            <NavLink label="Programs" route="ProgramList" currentRoute={currentRoute} />
            <NavLink label="Education" route="EducationList" currentRoute={currentRoute} />
            <NavLink label="Profile" route="Profile" currentRoute={currentRoute} />
          </>
        ) : null}
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const NavLink: React.FC<{ label: string; route: string; currentRoute: string }> = ({
  label,
  route,
  currentRoute,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const isActive = currentRoute === route;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(route)}
      style={[styles.link, isActive && styles.activeLink]}
    >
      <Text style={[styles.linkText, isActive && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  link: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeLink: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
  activeText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  logout: {
    marginLeft: 12,
    color: '#e53935',
    fontWeight: '600',
  },
});

export default SkatingNavBar;

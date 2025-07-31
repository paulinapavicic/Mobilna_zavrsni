import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AuthContext } from '../../navigation/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';

const HomeScreen: React.FC = () => {
const { user } = useContext(AuthContext);

const userId = user?.id || '-';
const userRole = user?.role || '-';
const coachId = user?.coachId || 'Not assigned';
const skaterId = user?.skaterId || 'Not assigned';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Optional Alert if needed */}
      {/* Alert.alert("Welcome!", "You've successfully logged in."); */}

      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Welcome to Figure Ice Skating Management System
      </Animatable.Text>

     

      <Animatable.View animation="zoomIn" delay={300} style={styles.heroImageWrapper}>
        <Image
          source={require('../../assets/skating-home.jpg')} // Adjust path
          style={styles.heroImage}
          resizeMode="contain"
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={500} style={styles.infoCard}>
        <Text style={styles.cardTitle}>Your All-in-One Skating Hub</Text>
        <Text style={styles.cardText}>
          Track your journey, connect with your coach, and unlock your full potential—right here.
        </Text>

        <View style={styles.cardRow}>
          <View style={styles.subCard}>
            <Ionicons name="person" size={36} color="#2563eb" />
            <Text style={styles.cardSubTitle}>Skaters</Text>
            <Text style={styles.cardSubText}>
              Log your sessions, monitor your progress, and get real feedback from your coach.
            </Text>
          </View>

          <View style={styles.subCard}>
            <Ionicons name="people" size={36} color="#198754" />
            <Text style={styles.cardSubTitle}>Coaches</Text>
            <Text style={styles.cardSubText}>
              Manage skater schedules, assign training, share materials, and guide growth.
            </Text>
          </View>
        </View>

        <Text style={styles.readyText}>
          <Text style={{ fontWeight: '600' }}>Ready to get started?</Text> Use the tabs
          below to explore. New here? Register today.
        </Text>

        <Text style={styles.signature}>
          Let your <Text style={styles.shine}>skating story shine!</Text>
        </Text>
      </Animatable.View>
    </ScrollView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 16,
  },
  userInfo: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#111',
  },
  heroImageWrapper: {
    marginVertical: 24,
    borderColor: '#2563eb',
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: 300,
    height: 200,
    borderRadius: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#444',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  subCard: {
    flex: 1,
    backgroundColor: '#fefefe',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  cardSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 6,
    color: '#2563eb',
  },
  cardSubText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  readyText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  signature: {
    marginTop: 10,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  shine: {
    color: '#2563eb',
  },
});

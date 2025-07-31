import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSkaterById } from '../../services/skaterService';

type RouteParams = { id: string };

const SkaterDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [skater, setSkater] = useState<null | {
    name: string;
    surname: string;
    categoryName: string;
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkater = async () => {
      try {
        const data = await getSkaterById(id);
        setSkater(data);
      } catch {
        // Show error or default fallback
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadSkater();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!skater) {
    return (
      <View style={styles.center}>
        <Text>Skater not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Skater Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{skater.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Surname:</Text>
          <Text style={styles.value}>{skater.surname}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{skater.categoryName}</Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}> Back to List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SkaterDetailsScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    color: '#444',
  },
  backBtn: {
    marginTop: 24,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

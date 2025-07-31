import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSkaterById, deleteSkater } from '../../services/skaterService';

type RouteParams = {
  id: string;
};

type Skater = {
  id: string;
  name: string;
  surname: string;
  categoryName: string;
};

const SkaterDeleteScreen: React.FC = () => {
  const navigation = useNavigation();
  const { id } = useRoute().params as RouteParams;

  const [skater, setSkater] = useState<Skater | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSkater = async () => {
    try {
      const data = await getSkaterById(id);
      setSkater(data);
    } catch {
      Alert.alert('Error', 'Unable to load skater details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSkater(id);
      Alert.alert('Deleted!', 'Skater successfully deleted.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to delete skater.');
    }
  };

  useEffect(() => {
    loadSkater();
  }, []);

  if (loading || !skater) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Ionicons  name="warning" size={50} color="#e53935" style={styles.icon} />
        <Text style={styles.title}>Confirm Delete</Text>
        <Text style={styles.msg}>
          Are you sure you want to delete the following skater?
        </Text>

        <View style={styles.infoCard}>
          <TextRow label="Name:" value={skater.name} />
          <TextRow label="Surname:" value={skater.surname} />
          <TextRow label="Category:" value={skater.categoryName} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons  name="trash" size={20} color="#fff" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SkaterDeleteScreen;

const TextRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: '#e53935',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  msg: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    marginBottom: 22,
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 22,
    backgroundColor: '#fefefe',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  deleteBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});

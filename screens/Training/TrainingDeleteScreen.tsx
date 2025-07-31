import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getTrainingById, deleteTraining } from '../../services/trainingService';

type RouteParams = {
  id: string;
};

type Training = {
  id: string;
  date: string;
  duration: number;
  type: string;
  elements: string;
  notes: string;
};

const TrainingDeleteScreen: React.FC = () => {
  const { id } = useRoute().params as RouteParams;
  const navigation = useNavigation();

  const [session, setSession] = useState<Training | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTraining = async () => {
      try {
        const data = await getTrainingById(id);
        const training = data?.Training || data?.training || data;

        if (!training) throw new Error('Training not found in response');

        setSession(training);
      } catch (e) {
        console.error('❌ Failed to load training:', e);
        Alert.alert('Error', 'Unable to load this training session.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadTraining();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteTraining(id);
      Alert.alert('Deleted', 'Training session deleted successfully.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not delete training session.');
    }
  };

  if (loading || !session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading training...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="warning" size={48} color="#e53935" />
          <Text style={styles.title}>Delete Training Session</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to delete this training session?
          </Text>
        </View>

        <View style={styles.list}>
          <DetailRow label="Date:" value={new Date(session.date).toLocaleDateString()} />
          <DetailRow label="Duration:" value={`${session.duration} minutes`} />
          <DetailRow label="Type:" value={session.type} />
          <DetailRow label="Elements:" value={session.elements || '-'} />
          <DetailRow label="Notes:" value={session.notes || '-'} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>🗑 Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TrainingDeleteScreen;

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={3}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    color: '#e53935',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  list: {
    marginVertical: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    width: 90,
  },
  value: {
    color: '#444',
    maxWidth: 180,
    textAlign: 'right',
    flexShrink: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  deleteBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#ced4da',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});

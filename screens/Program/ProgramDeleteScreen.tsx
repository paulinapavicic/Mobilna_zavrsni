import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProgramById, deleteProgram } from '../../services/programService';

type Program = {
  id: string;
  year: number;
  type: string;
  description: string;
};

type RouteParams = {
  id: string;
};

const ProgramDeleteScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProgram = async () => {
    try {
      const data = await getProgramById(id);
      setProgram(data);
    } catch {
      Alert.alert('Error', 'Failed to load program details.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProgram(id);
      Alert.alert('Success', 'Program deleted successfully.');
      navigation.navigate('ProgramList'); // Or whatever your list screen is
    } catch {
      Alert.alert('Error', 'Failed to delete program.');
    }
  };

  useEffect(() => {
    loadProgram();
  }, []);

  if (loading || !program) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Ionicons name="alert-circle" size={56} color="#e53935" style={styles.icon} />
        <Text style={styles.title}>Delete Program</Text>
        <Text style={styles.subtitle}>
          Are you sure you want to delete this program?
        </Text>

        <View style={styles.detailsList}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Year:</Text>
            <Text style={styles.value}>{program.year}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{program.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{program.description}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>🗑 Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProgramDeleteScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#e53935',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  detailsList: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontWeight: '600',
    color: '#444',
  },
  value: {
    color: '#222',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    borderColor: '#999',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#444',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
});

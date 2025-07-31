import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthContext';
import { getMaterialDetails, deleteEducationMaterial } from '../../services/educationService';

type RouteParams = {
  id: string;
};

type Material = {
  id: string;
  title: string;
  description: string;
};

const EducationDeleteScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const [loading, setLoading] = useState<boolean>(true);
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMaterialDetails(id);
        const materialData = data.material || data; // ✅ unwrap material object
        setMaterial(materialData);
      } catch (err) {
        console.error('Failed to load material:', err);
        Alert.alert('Error', 'Failed to load educational material.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEducationMaterial(id);
      Alert.alert('Deleted', 'Education material was deleted.');
      navigation.navigate('EducationList'); // Make sure this matches your route
    } catch (err) {
      Alert.alert('Error', 'Failed to delete.');
    }
  };

  if (loading || !material) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Loading material...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>Delete Material?</Text>
        <Text style={styles.subtitle}>Are you sure you want to delete this material?</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{material.title}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{material.description}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>🗑 Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EducationDeleteScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
  },
  icon: {
    fontSize: 48,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: '#dc3545',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#444',
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#ced4da',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: '600',
  },
});

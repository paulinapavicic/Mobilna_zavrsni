import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { getEducationMaterials } from '../../services/educationService';
import { AuthContext } from '../../navigation/AuthContext';

type EducationItem = {
  id: string;
  title: string;
  description: string;
};

const EducationListScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const isCoach = user?.role === 'Coach';

  const [materials, setMaterials] = useState<EducationItem[]>([]);
  const [filtered, setFiltered] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getEducationMaterials();
      setMaterials(data);
      setFiltered(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load educational materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const query = text.toLowerCase();
    const filteredList = materials.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFiltered(filteredList);
  };

  const renderItem = ({ item }: { item: EducationItem }) => (
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.actions}>
        {isCoach && (
          <TouchableOpacity
            onPress={() => navigation.navigate('EducationDelete', { id: item.id })}
            style={styles.deleteButton}
          >
            <Text style={styles.actionText}>🗑</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('EducationDetails', { id: item.id })}
          style={styles.detailButton}
        >
          <Text style={styles.actionText}>ℹ️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Educational Materials</Text>

        {isCoach ? (
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
              <Ionicons name="refresh" size={20} color="#2563eb" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => navigation.navigate('EducationCreate')}
            >
              <Text style={styles.uploadText}>+ Upload</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Filter by title..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No educational materials found.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default EducationListScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshBtn: {
    backgroundColor: '#f0f5ff',
    borderColor: '#2563eb',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchRow: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  itemRow: {
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailButton: {
    marginLeft: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  actionText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  emptyIcon: {
    fontSize: 50,
  },
});

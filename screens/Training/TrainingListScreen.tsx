import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import {
  getTrainings,
  getTrainingElements,
} from '../../services/trainingService';

type Training = {
  id: string;
  date: string;
  type: 'OnIce' | 'OffIce';
  duration: number;
  elements: string; // Comma-separated IDs
  notes: string;
};

type ElementDictionary = Record<string, string>;

const TrainingListScreen: React.FC = () => {
  const navigation = useNavigation();

  // State for training sessions and elements
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filtered, setFiltered] = useState<Training[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [onIceElements, setOnIceElements] = useState<ElementDictionary>({});
  const [offIceElements, setOffIceElements] = useState<ElementDictionary>({});

  // Fetch trainings and all elements on mount/refresh
  const loadTrainings = async () => {
    try {
      setLoading(true);

      // Fetch trainings
      const data = await getTrainings();
      setTrainings(data);
      setFiltered(data);

      // Fetch OnIce and OffIce elements
      const onIce = await getTrainingElements('OnIce');
      const offIce = await getTrainingElements('OffIce');

      // Build element dictionaries
      const onIceDict: ElementDictionary = {};
      onIce.forEach(e => { onIceDict[e.id.toString()] = e.name; });
      setOnIceElements(onIceDict);

      const offIceDict: ElementDictionary = {};
      offIce.forEach(e => { offIceDict[e.id.toString()] = e.name; });
      setOffIceElements(offIceDict);
    } catch (error: any) {
      console.error('Failed to load trainings or elements:', error?.response?.data || error);
      Alert.alert('Error', 'Failed to load training sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  // Search filter on notes
  const applySearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(trainings);
      return;
    }
    const filteredList = trainings.filter((t) =>
      t.notes?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredList);
  };

  // Converts stored element IDs to readable names for training cards
  const getElementNames = (elementIds: string, type: 'OnIce' | 'OffIce') => {
    const dict = type === 'OnIce' ? onIceElements : offIceElements;
    if (!elementIds) return '-';
    return elementIds
      .split(',')
      .map((id) => dict[id.trim()] || id)
      .join(', ');
  };

  // Render a training card
  const renderItem = ({ item }: { item: Training }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Type:</Text>
        <View
          style={[
            styles.badge,
            item.type === 'OnIce' ? styles.badgePrimary : styles.badgeSuccess,
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration:</Text>
        <Text>{item.duration} min</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Elements:</Text>
        <Text style={{ flex: 1 }}>{getElementNames(item.elements, item.type)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notes:</Text>
        <Text style={{ flex: 1 }}>{item.notes || '-'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
           onPress={() => {
    console.log('Edit pressed', item.id);
    navigation.navigate('TrainingEdit', { id: item.id });
  }}
        >
          <Ionicons name="pencil" size={20} color="#ffc107" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TrainingDelete', { id: item.id })}
        >
          <Ionicons name="trash" size={20} color="#e53935" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Training Sessions</Text>
        <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate('TrainingCreate')}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Add Training</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[styles.actionBtn, { backgroundColor: '#2563eb'}]}
  onPress={() => navigation.navigate('TrainingAnalytics')}
>
  <Ionicons name="bar-chart-outline" size={20} color="#fff" />
  <Text style={styles.actionBtnText}>View Analytics</Text>
</TouchableOpacity>
</View>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={applySearch}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={loadTrainings} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default TrainingListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  refreshBtn: {
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  card: {
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    width: 100,
    color: '#333',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: '#2563eb',
  },
  badgeSuccess: {
    backgroundColor: '#34c759',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  icon: {
    paddingHorizontal: 8,
  },
  buttonGroup: {
  flexDirection: 'row',
  gap: 8, // adds space between the buttons; if "gap" doesn't work in your RN version, use marginStart/marginLeft below
},
actionBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 3,
  paddingHorizontal: 1,
  borderRadius: 5,
  marginLeft: 5, 
},
actionBtnText: {
  color: '#fff',
  fontWeight: 'bold',
  marginLeft: 4,
  fontSize: 13,
},

});

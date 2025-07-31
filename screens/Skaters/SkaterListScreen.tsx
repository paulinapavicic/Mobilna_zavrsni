import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getSkaters } from '../../services/skaterService';

type Skater = {
  id: string;
  name: string;
  surname: string;
  categoryName: string;
};

const SkaterListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [skaters, setSkaters] = useState<Skater[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSkaters = async () => {
    try {
      setLoading(true);
      const data = await getSkaters();
      setSkaters(data);
    } catch (err) {
      console.error('❌ Failed to fetch skaters:', err?.response?.data || err.message);
      Alert.alert('Error', 'Unable to load skaters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkaters();
  }, []);

  const renderItem = ({ item }: { item: Skater }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.surname}</Text>
      <Text style={styles.cell}>{item.categoryName}</Text>
      <View style={[styles.cell, styles.actions]}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => navigation.navigate('SkaterDelete', { id: item.id })}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>My Skaters</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('SkaterCreate')}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add New Skater</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerText]}>Name</Text>
          <Text style={[styles.cell, styles.headerText]}>Surname</Text>
          <Text style={[styles.cell, styles.headerText]}>Category</Text>
          <Text style={[styles.cell, styles.headerText, { textAlign: 'center' }]}>Actions</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" style={{ margin: 30 }} />
        ) : skaters.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="person-remove" size={34} color="#ccc" />
            <Text style={styles.emptyText}>No skaters found.</Text>
          </View>
        ) : (
          <FlatList
            data={skaters}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

export default SkaterListScreen;


const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#f8f9fa',
    flex: 1,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  addBtn: {
    flexDirection: 'row',
    gap: 7,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    elevation: 2,
    minHeight: 80,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f8fe',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 10,
    marginBottom: 2,
  },
  headerText: {
    fontWeight: '700',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    backgroundColor: '#f8fcff',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 2,
  },
  cell: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 4,
  },
  actions: {
    flex: 1.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#e53935',
    flexDirection: 'row',
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    marginLeft: 7,
    fontWeight: 'bold',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 36,
  },
  emptyText: {
    color: '#bbb',
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 15,
  },
});

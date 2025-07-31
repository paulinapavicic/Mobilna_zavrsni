import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getPrograms } from '../../services/programService';
import { AuthContext } from '../../navigation/AuthContext';

type Program = {
  id: string;
  year: number;
  type: 'Free' | 'Short';
  description: string;
};

const ProgramsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, token } = useContext(AuthContext);
  const isSkater = user?.role === 'Skater';

  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [yearFilter, setYearFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await getPrograms(token);
      setPrograms(data);
      setFilteredPrograms(data);
    } catch (error: any) {
      console.error('Failed to load programs:', error?.response?.data || error.message || error);
      Alert.alert('Error', 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleFilter = () => {
    if (!yearFilter.trim()) {
      setFilteredPrograms(programs);
      return;
    }
    const filtered = programs.filter(p => p.year.toString() === yearFilter.trim());
    setFilteredPrograms(filtered);
  };

  const renderItem = ({ item }: { item: Program }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.year}</Text>
      <View style={[styles.cell, styles.typeCell]}>
        <Text style={[
          styles.badge,
          item.type === 'Free' ? styles.badgePrimary : styles.badgeSuccess,
        ]}>
          {item.type}
        </Text>
      </View>
      <Text style={styles.cell}>{item.description}</Text>
      <View style={[styles.cell, styles.actionsCell]}>
        {isSkater && (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ProgramEdit', { id: item.id })}
            >
              <Ionicons name="pencil" size={22} color="#ffc107" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('ProgramDelete', { id: item.id })}
            >
              <Ionicons name="trash" size={22} color="#e53935" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('ProgramDetails', { id: item.id })}
        >
          <Ionicons name="information-circle" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Programs</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadPrograms}>
            <Ionicons name="refresh" size={22} color="#2563eb" />
          </TouchableOpacity>
          {isSkater && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('ProgramCreate')}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text style={styles.addBtnText}>Add Program</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter by Year</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="e.g. 2025"
          value={yearFilter}
          onChangeText={setYearFilter}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
          <Text style={styles.filterBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : filteredPrograms.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="musical-notes" size={40} color="#bdbdbd" />
          <Text style={styles.emptyText}>No programs found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPrograms}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListHeaderComponent={() => (
            <View style={styles.tableHead}>
              <Text style={[styles.cell, styles.tableHeadText]}>Year</Text>
              <Text style={[styles.cell, styles.tableHeadText]}>Type</Text>
              <Text style={[styles.cell, styles.tableHeadText]}>Description</Text>
              <Text style={[styles.cell, styles.tableHeadText, { textAlign: 'center' }]}>Actions</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ProgramsListScreen;



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshBtn: {
    backgroundColor: '#f0f5fb',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    marginRight: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 7,
  },
  filterLabel: {
    fontWeight: '600',
    color: '#192252',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 7,
    minWidth: 80,
    backgroundColor: '#f8fafc',
  },
  filterBtn: {
    borderColor: '#2563eb',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 7,
    marginLeft: 10,
    backgroundColor: '#f5faff',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#f0f5fb',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 8,
    marginBottom: 2,
  },
  tableHeadText: {
    fontWeight: '700',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9ff',
    borderRadius: 10,
    marginBottom: 7,
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 3,
    fontSize: 14,
  },
  typeCell: {
    alignItems: 'flex-start',
    flex: 1,
  },
  actionsCell: {
    flexDirection: 'row',
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    color: '#fff',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontWeight: '600',
    fontSize: 13,
    overflow: 'hidden',
  },
  badgePrimary: {
    backgroundColor: '#2563eb',
  },
  badgeSuccess: {
    backgroundColor: '#34b233',
  },
  actionBtn: {
    marginHorizontal: 3,
    borderRadius: 10,
    padding: 4,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#bdbdbd',
    fontSize: 16,
    marginTop: 10,
  },
});

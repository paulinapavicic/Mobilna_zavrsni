import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { getTrainingById } from '../../services/trainingService';

type RouteParams = { id: string };

type TrainingDetail = {
  id: string;
  date: string;
  duration: number;
  type: 'OnIce' | 'OffIce' | string;
  elements: string; // CSV (comma-separated values)
  notes: string;
};

const onIceElements: Record<string, string> = {
  '1': 'Axel',
  '2': 'Lutz',
  '3': 'Salchow',
};

const offIceElements: Record<string, string> = {
  '101': 'Jumps',
  '102': 'Stretch',
  '103': 'Strength',
};

const TrainingDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { id } = useRoute().params as RouteParams;

  const [session, setSession] = useState<TrainingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTrainingById(id);
        setSession(data);
      } catch {
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderTypeBadge = (type: string) => {
    if (type === 'OnIce') return <Text style={[styles.badge, styles.badgePrimary]}>❄️ On Ice</Text>;
    if (type === 'OffIce') return <Text style={[styles.badge, styles.badgeSuccess]}>🏃 Off Ice</Text>;
    return <Text style={[styles.badge, styles.badgeSecondary]}>{type}</Text>;
  };

  const renderElementBadges = (csv: string, type: string) => {
    const dict = type === 'OnIce' ? onIceElements : offIceElements;
    return csv
      .split(',')
      .map((elId) => dict[elId.trim()] || elId.trim())
      .map((elName, index) => (
        <Text key={index} style={styles.elementBadge}>
          {elName}
        </Text>
      ));
  };

  if (loading || !session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          <Ionicons name="information-circle" size={22} color="#2563eb" /> Training Session Details
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text>{new Date(session.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>⏱ Duration:</Text>
          <Text>{session.duration} min</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>🏷 Type:</Text>
          {renderTypeBadge(session.type)}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>🧩 Elements:</Text>
          <View style={styles.elementsContainer}>
            {renderElementBadges(session.elements, session.type)}
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>📝 Notes:</Text>
          <Text>{session.notes || '-'}</Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.backText}> Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TrainingDetailsScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    marginBottom: 12,
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  badgeSuccess: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  badgeSecondary: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
  elementBadge: {
    backgroundColor: '#bde0fe',
    color: '#003566',
    marginRight: 6,
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  elementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  backBtn: {
    flexDirection: 'row',
    backgroundColor: '#6c757d',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

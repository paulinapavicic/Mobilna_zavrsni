import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthContext';
import {
  getMaterialDetails,
  deleteEducationFile,
} from '../../services/educationService';

type FileModel = {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl?: string;
};

type MaterialDetails = {
  id: string;
  title: string;
  description: string;
  files: FileModel[];
};

const EducationDetailsScreen: React.FC = () => {
  const { user } = useContext(AuthContext);
  const isCoach = user?.role === 'Coach';

  const route = useRoute<RouteProp<any, any>>();
  const navigation = useNavigation();
  const materialId = route.params?.id;

  const [material, setMaterial] = useState<MaterialDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMaterial = async () => {
    setLoading(true);
    try {
      const data = await getMaterialDetails(materialId);
      setMaterial(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load material details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterial();
  }, []);

 const handleDeleteFile = async (fileId: string) => {
  Alert.alert('Delete File', 'Are you sure you want to delete this file?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        try {
          await deleteEducationFile(fileId, materialId);
          Alert.alert('Success', 'File deleted.');
          loadMaterial(); // refresh file list
        } catch (err) {
          Alert.alert('Error', 'Failed to delete file.');
        }
      },
    },
  ]);
};

  const renderFile = ({ item }: { item: FileModel }) => (
    <View style={styles.fileRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.fileMeta}>
          {item.contentType} • {item.fileSize.toLocaleString()} bytes • Uploaded{' '}
          {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
      {item.fileUrl && (
        <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
          <Text style={styles.actionButton}>Download</Text>
        </TouchableOpacity>
      )}
      {isCoach && (
        <TouchableOpacity
          onPress={() => handleDeleteFile(item.id)}
          style={styles.deleteButton}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading || !material)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>📂 Educational Files</Text>
        {material.files && material.files.length > 0 ? (
          <FlatList
            data={material.files}
            keyExtractor={f => f.id}
            renderItem={renderFile}
          />
        ) : (
          <View style={styles.emptyFiles}>
            <Text style={styles.emptyFilesText}>
              No files uploaded for this material.
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          {isCoach && (
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() =>
                navigation.navigate('EducationalFileUpload', { materialId })
              }
            >
              <Text style={styles.uploadBtnText}>+ Upload File</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EducationDetailsScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#f0f4f9',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },
  titleHeader: {
    fontSize: 21,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descLabel: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  descValue: {
    marginBottom: 4,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 10,
  },
  fileRow: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    gap: 8,
  },
  fileName: {
    fontWeight: 'bold',
    color: '#1b263b',
  },
  fileMeta: {
    color: '#667',
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#e53935',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    marginRight: 10,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#d4d4d4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  cancelBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyFiles: {
    alignItems: 'center',
    padding: 19,
  },
  emptyFilesText: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

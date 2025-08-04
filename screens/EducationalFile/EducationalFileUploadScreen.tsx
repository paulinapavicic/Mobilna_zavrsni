import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  Platform,
} from 'react-native';

import { pick, keepLocalCopy } from '@react-native-documents/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthContext';
import {
  getMaterialDetails,
  uploadEducationalFile,
  deleteEducationFile,
} from '../../services/educationService';

type UploadRouteParams = {
  materialId: string;
};

type FileModel = {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  fileUrl?: string;
  uploadedAt: string;
};

export default function EducationalFileUploadScreen() {
  const { user } = useContext(AuthContext);
  const isCoach = user?.role === 'Coach';

  const { materialId } = useRoute().params as UploadRouteParams;
  const navigation = useNavigation();

  const [materialTitle, setMaterialTitle] = useState('');
  const [files, setFiles] = useState<FileModel[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getMaterialDetails(materialId);
      setMaterialTitle(data.title);
      setFiles(data.files || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load material details.');
      console.error('Load data error:', error);
    }
  }

const handlePickFile = async () => {
  try {
    console.log("Opening document picker...");
    const [res] = await pick({
      allowMultiSelection: false,
      copyTo: 'documentDirectory',
      types: ['*/*'],
    });
    console.log("Picked file info:", res);

    const [localFile] = await keepLocalCopy({
      files: [{ uri: res.uri, fileName: res.name ?? 'unknown' }],
      destination: 'documentDirectory',
    });
    console.log("Local file copy info:", localFile);

    const fileName = localFile.fileName ?? res.name ?? 'unknown';

    const uri =
      Platform.OS === 'android' && !localFile.localUri.startsWith('file://')
        ? 'file://' + localFile.localUri
        : localFile.localUri;

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: res.mimeType || 'application/octet-stream',
    } as any);

    // ----------- Replace axios upload call with fetch here -------------
    console.log('Uploading file with materialId:', materialId);

    setUploading(true);

    // Use fetch instead of axios for the file upload
    const response = await fetch(
      `http://10.0.2.2:5243/api/EducationalFile/material/${materialId}/upload`,
      {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header! Let fetch set it automatically.
        // If your API requires auth tokens, add headers here:
        // headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Parse JSON response
    const respJson = await response.json();
    console.log('Fetch upload response:', respJson);

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(respJson.message || 'Upload failed');
    }

    Alert.alert('Success', 'File uploaded!');
    await loadData();

  } catch (error: any) {
    console.error('Upload error:', error);
    if (error.message === 'User cancelled document picker') {
      console.log('User cancelled document picker');
    } else {
      Alert.alert('Upload failed', error.message || 'Try a different file.');
    }
  } finally {
    setUploading(false);
  }
};

  async function handleDelete(fileId: string) {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEducationFile(fileId);
              Alert.alert('Deleted', 'File deleted successfully');
              await loadData();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Delete failed', err.message || 'Unknown error');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  const renderFile = ({ item }: { item: FileModel }) => (
    <View style={styles.fileItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileTitle}>{item.fileName}</Text>
        <Text style={styles.fileMeta}>
          {item.contentType} • {item.fileSize.toLocaleString()} bytes • Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.fileActions}>
        {item.fileUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
            <Text style={styles.downloadBtn}>Download</Text>
          </TouchableOpacity>
        )}
        {isCoach && (
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload files to: {materialTitle}</Text>

      {isCoach && (
        <TouchableOpacity
          onPress={handlePickFile}
          disabled={uploading}
          style={[styles.uploadBtn, uploading && { opacity: 0.6 }]}
        >
          <Text style={styles.uploadBtnText}>{uploading ? 'Uploading…' : '+ Upload File'}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={renderFile}
        ListEmptyComponent={<Text style={styles.emptyText}>No files uploaded yet.</Text>}
        style={styles.fileList}
      />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', color: '#256ebd', marginBottom: 16 },
  uploadBtn: {
    backgroundColor: '#256ebd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fileList: { flexGrow: 1 },
  fileItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'column',
  },
  fileTitle: { fontWeight: 'bold' },
  fileMeta: { fontSize: 12, color: '#666', marginTop: 4 },
  fileActions: { flexDirection: 'row', marginTop: 8 },
  downloadBtn: { color: '#256ebd', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  cancelBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: { color: '#333' },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 30 },
});
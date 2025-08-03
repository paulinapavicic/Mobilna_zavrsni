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

  // Load material details & current files
  const loadData = async () => {
    try {
      const data = await getMaterialDetails(materialId);
      setMaterialTitle(data.title);
      setFiles(data.files || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load material details.');
      console.error("Load data error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // File picker and upload handler with detailed debug logs
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

      const fileData = new FormData();
      // **Do NOT append materialId in FormData, it’s passed via URL**
      fileData.append('file', {
        uri,
        name: fileName,
        type: res.mimeType || 'application/octet-stream',
      } as any);

      // Debug: inspect FormData parts internally since React Native lacks .entries()
      if (fileData && (fileData as any)._parts) {
        (fileData as any)._parts.forEach(([key, val]: any) =>
          console.log('FormData part:', key, val)
        );
      } else {
        console.warn("Unable to inspect FormData parts");
      }

      setUploading(true);
      const response = await uploadEducationalFile(materialId, fileData);
      console.log("Upload response:", response.data || response);

      Alert.alert('Success', 'File uploaded!');
      await loadData();

    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.message === "User cancelled document picker") {
        console.log("User cancelled document picker");
      } else {
        Alert.alert('Upload failed', error.message || 'Try a different file.');
      }
    } finally {
      setUploading(false);
    }
  };

  // Delete file with confirmation and error handling
  const handleDelete = async (fileId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this file?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEducationFile(fileId);
            Alert.alert('Deleted!', 'File deleted successfully.');
            await loadData();
          } catch (error: any) {
            console.error("Delete error:", error);
            Alert.alert('Delete failed', error.message || 'Unknown error occurred');
          }
        },
      },
    ]);
  };

  // Render single file row
  const renderItem = ({ item }: { item: FileModel }) => (
    <View style={styles.fileItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileTitle}>{item.fileName}</Text>
        <Text style={styles.fileMeta}>
          {item.contentType} • {item.fileSize.toLocaleString()} bytes • Uploaded{' '}
          {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.fileActions}>
        {item.fileUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
            <Text style={styles.downloadBtn}>Download</Text>
          </TouchableOpacity>
        )}
        {isCoach && (
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload File to: {materialTitle}</Text>

      {isCoach && (
        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickFile} disabled={uploading}>
          <Text style={styles.uploadBtnText}>{uploading ? 'Uploading...' : '+ Upload File'}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={files}
        keyExtractor={(f) => f.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No files have been uploaded yet.</Text>}
        style={styles.fileList}
      />

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 18, color: '#2563eb', fontWeight: 'bold', marginBottom: 16 },
  uploadBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadBtnText: { color: '#fff', fontWeight: 'bold' },
  fileList: { flexGrow: 1 },
  fileItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileTitle: { fontWeight: 'bold' },
  fileMeta: { fontSize: 12, color: '#667' },
  fileActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  downloadBtn: { color: '#2563eb', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: {
    marginTop: 16,
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: { color: '#333' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 30 },
});

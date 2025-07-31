import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from 'react-native';

import { pick, keepLocalCopy } from '@react-native-documents/picker';
import Sound from 'react-native-sound';
import { useRoute, useNavigation } from '@react-navigation/native';
import { uploadMusicFile, getMusicFilesByProgramId } from '../../services/musicService';
import { AuthContext } from '../../navigation/AuthContext';

type FileModel = {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl?: string;
};

type RouteParams = {
  programId: string;
};

const MusicUploadScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const { programId } = route.params as RouteParams;
  const [musicFiles, setMusicFiles] = useState<FileModel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);

  // Load files from backend
  const loadFiles = async () => {
    try {
      const data = await getMusicFilesByProgramId(programId);
      setMusicFiles(data);
    } catch {
      Alert.alert('Error', 'Failed to load music files');
    }
  };

  useEffect(() => {
    loadFiles();
    return () => {
      // Cleanup sound when component unmounts
      if (currentSound) {
        currentSound.release();
      }
    };
  }, []);

  // Handle audio playback inside app
  const playAudio = (url: string) => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound.release();
        setCurrentSound(null);
      });
    }
    const sound = new Sound(url, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        Alert.alert('Playback error', 'Cannot play this audio file');
        return;
      }
      setCurrentSound(sound);
      sound.play((success) => {
        if (!success) {
          Alert.alert('Playback failed', 'Failed to play audio completely');
        }
        sound.release();
        setCurrentSound(null);
      });
    });
  };

  // Inside your MusicUploadScreen component

const handleUpload = async () => {
  try {
    const [res] = await pick({
      types: ['audio/*'],      
      allowMultiSelection: false,
      copyTo: 'documentDirectory',
    });

    const [localFile] = await keepLocalCopy({
      files: [{ uri: res.uri, fileName: res.name ?? 'unknown' }],
      destination: 'documentDirectory',
    });

    const formData = new FormData();
    // No need to append programId here, it's in URL, so only file key is necessary
    formData.append('musicFile', {
      uri: localFile.uri,
      name: localFile.fileName,
      type: res.mimeType || 'audio/mpeg',
    } as any);

    setUploading(true);
    // Pass programId as an argument here
    await uploadMusicFile(programId, formData);

    Alert.alert('Success', 'Music file uploaded successfully');
    loadFiles();

  } catch (err: any) {
    if (err?.message === 'User cancelled document picker') {
      console.log('User cancelled document picker');
    } else {
      Alert.alert('Upload Failed', err?.message || 'Unknown error');
    }
  } finally {
    setUploading(false);
  }
};


  // Render each music file item
  const renderFile = ({ item }: { item: FileModel }) => (
    <View style={styles.fileItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.fileDetails}>
          {item.contentType} • {(item.fileSize / 1024).toFixed(1)} KB • Uploaded{' '}
          {new Date(item.uploadedAt).toLocaleDateString()}
        </Text>
      </View>
      {item.fileUrl && (
        <TouchableOpacity onPress={() => playAudio(item.fileUrl)}>
          <Text style={styles.playButton}>▶ Play</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Music</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Select and Upload File'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Uploaded Music Files</Text>

      <FlatList
        data={musicFiles}
        keyExtractor={(item) => item.id}
        renderItem={renderFile}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No music files uploaded yet.</Text>
        }
        style={{ flex: 1 }}
      />

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MusicUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  fileDetails: {
    color: '#555',
    fontSize: 12,
  },
  playButton: {
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontStyle: 'italic',
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: '#999',
    fontWeight: '600',
  },
});

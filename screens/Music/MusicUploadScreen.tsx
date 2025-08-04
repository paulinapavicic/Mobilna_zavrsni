 import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
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
  const { user } = useContext(AuthContext);
  const isCoach = user?.role === 'Coach';

  const { programId } = useRoute().params as RouteParams;
  const navigation = useNavigation();

  const [musicFiles, setMusicFiles] = useState<FileModel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);

  // Load music files for program
  const loadFiles = async () => {
    try {
      const data = await getMusicFilesByProgramId(programId);
      setMusicFiles(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load music files');
      console.error('Load music files error:', error);
    }
  };

  useEffect(() => {
    loadFiles();
    return () => {
      if (currentSound) {
        currentSound.release();
      }
    };
  }, []);

  // Play audio helper
  const playAudio = (url: string) => {
    if (currentSound) {
      currentSound.stop(() => {
        currentSound.release();
        setCurrentSound(null);
      });
    }
    const sound = new Sound(url, undefined, (error) => {
      if (error) {
        Alert.alert('Playback error', 'Cannot play this audio file');
        return;
      }
      setCurrentSound(sound);
      sound.play((success) => {
        if (!success) {
          Alert.alert('Playback error', 'Failed to play audio completely');
        }
        sound.release();
        setCurrentSound(null);
      });
    });
  };

  // Upload music file with detailed debugging
  const handleUpload = async () => {
    try {
      console.log('Opening music picker...');
      const [res] = await pick({
        allowMultiSelection: false,
        types: ['audio/*'],
        copyTo: 'documentDirectory',
      });
      console.log('Picked music file:', res);

      const [localFile] = await keepLocalCopy({
        files: [{ uri: res.uri, fileName: res.name ?? 'unknown' }],
        destination: 'documentDirectory',
      });
      console.log('Local music file copy:', localFile);

      const fileName = localFile.fileName ?? res.name ?? 'unknown';
      const uri =
        Platform.OS === 'android' && !localFile.localUri.startsWith('file://')
          ? `file://${localFile.localUri}`
          : localFile.localUri;

      const fileObj = {
        uri,
        name: fileName,
        type: res.mimeType || 'audio/mpeg',
      };

      const formData = new FormData();
      formData.append('musicFile', fileObj as any);

      // Log FormData contents
      if ((formData as any)._parts) {
        (formData as any)._parts.forEach(([key, val]) => {
          console.log('FormData key:', key, 'Value:', val);
        });
      } else {
        console.warn('Cannot inspect FormData parts');
      }
      console.log('Uploading music file for programId:', programId);

      setUploading(true);
      const response = await fetch(
        `http://10.0.2.2:5243/api/Music/program/${programId}/upload`,
        {
          method: 'POST',
          body: formData,
          // Do NOT set Content-Type header—fetch sets it automatically
        }
      );

      const respJson = await response.json();
      console.log('Upload response:', respJson);
      if (!response.ok) {
        throw new Error(respJson.message || 'Upload failed');
      }

      Alert.alert('Success', 'Music file uploaded successfully');
      await loadFiles();
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.message === 'User cancelled') {
        console.log('User cancelled picker');
      } else {
        Alert.alert('Upload failed', error.message || 'Unknown error');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Music</Text>

      <TouchableOpacity
        style={[styles.uploadButton, uploading && { opacity: 0.6 }]}
        onPress={handleUpload}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Select and Upload Music'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Music Files</Text>

      <FlatList
        data={musicFiles}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName}>{item.fileName}</Text>
              <Text style={styles.fileDetails}>
                {item.contentType} • {(item.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
            {item.fileUrl && (
              <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
                <Text style={styles.playButton}>Play</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No music files uploaded yet.</Text>}
        style={{ flex: 1 }}
      />

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
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
    color: '#256ebd',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#256ebd',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  fileItem: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  fileDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  playButton: {
    color: '#256ebd',
    fontWeight: '600',
  },
  emptyMessage: {
    marginTop: 30,
    textAlign: 'center',
    color: '#999',
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
});
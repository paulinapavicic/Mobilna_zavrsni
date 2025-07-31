import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AuthContext } from '../../navigation/AuthContext';
import {
  getProgramDetails,
  addCommentToProgram,
} from '../../services/programService';

type MusicFile = {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
};

type Comment = {
  id: string;
  coachName: string;
  comment: string;
  createdAt: string;
};

type RouteParams = {
  id: string;
};

const ProgramDetailsScreen: React.FC = () => {
  // Auth context - adapt to your shape if needed
  const { user } = useContext(AuthContext);
  const isCoach = user?.role === 'Coach';
  const isSkater = user?.role === 'Skater';

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as RouteParams;

  const [program, setProgram] = useState<any>(null);
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const loadDetails = async () => {
    try {
      const data = await getProgramDetails(id);
      setProgram(data.program);
      setMusicFiles(data.musicFiles);
      setComments(data.comments);
    } catch {
      Alert.alert('Error', 'Failed to load program details');
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await addCommentToProgram(id, newComment);
      setNewComment('');
      loadDetails();
    } catch {
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  if (!program) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* 📝 Program Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="information-circle" size={20} color="#2563eb" /> Program Details
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Year:</Text>
          <Text>{program.year}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.badge}>{program.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text>{program.description}</Text>
        </View>
      </View>

      {/* 🎵 Music Files */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="musical-note" size={20} color="#2563eb" /> Music Files
        </Text>

        {musicFiles.length > 0 ? (
          musicFiles.map(file => (
            <View key={file.id} style={styles.fileItem}>
              <Text style={styles.fileText}>
                {file.fileName} • {file.contentType} • {file.fileSize.toLocaleString()} bytes
              </Text>
              {/* Only SKATER can play/download files */}
              {isSkater && (
                <TouchableOpacity onPress={() => Linking.openURL(file.fileUrl)}>
                  <Text style={styles.playButton}>▶ Play/Download</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.uploadedAt}>
                Uploaded {new Date(file.uploadedAt).toDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text>No music files uploaded for this program.</Text>
        )}

        <View style={styles.fileButtons}>
          {/* Only SKATER can see Add Music */}
          {isSkater && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('MusicUpload', { programId: id })}
            >
              <Text style={styles.btnText}>+ Add Music</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 💬 Comments */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#2563eb" /> Comments
        </Text>

        {comments.length > 0 ? (
          comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentCoach}>
                {comment.coachName}{' '}
                <Text style={styles.commentDate}>({new Date(comment.createdAt).toDateString()})</Text>
              </Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#666' }}>
            No comments yet.
          </Text>
        )}

        {/* Only coach can add comments */}
        {isCoach && (
          <>
            <TextInput
              style={styles.commentInput}
              placeholder="Leave a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCommentSubmit}>
              <Text style={styles.btnText}>+ Add Comment</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ProgramDetailsScreen;


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: '700',
    marginRight: 8,
    width: 90,
  },
  badge: {
    backgroundColor: '#cce5ff',
    color: '#000',
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fileItem: {
    marginBottom: 12,
  },
  fileText: {
    fontWeight: '600',
  },
  playButton: {
    marginTop: 2,
    color: '#2563eb',
    fontWeight: '600',
  },
  uploadedAt: {
    color: '#888',
    fontSize: 12,
  },
  fileButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#ced4da',
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnCancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  commentItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  commentCoach: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentDate: {
    fontStyle: 'italic',
    color: '#888',
    fontWeight: 'normal',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    minHeight: 80,
  },
});

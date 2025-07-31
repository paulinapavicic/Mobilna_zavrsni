import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../navigation/AuthContext';
import { getProfile, updateProfile } from '../../services/profileService';

type Profile = {
  id: string;
  name: string;
  surname: string;
};

const ProfileScreen: React.FC = () => {
   const { user, logout } = useContext(AuthContext);
  const [initialValues, setInitialValues] = useState<Profile>({
    id: '',
    name: '',
    surname: '',
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile(); // Load initial profile data from your API
        setInitialValues(data);
      } catch {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
  });

  const handleSubmit = async (values: Profile) => {
    try {
      await updateProfile(values);
      setSuccessMessage('Profile updated successfully!');
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

    const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Edit Profile</Text>
          {successMessage ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  placeholder="Enter your name"
                  autoCapitalize="words"
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                <Text style={styles.label}>Surname</Text>
                <TextInput
                  style={styles.input}
                  value={values.surname}
                  onChangeText={handleChange('surname')}
                  onBlur={handleBlur('surname')}
                  placeholder="Enter your surname"
                  autoCapitalize="words"
                />
                {touched.surname && errors.surname && (
                  <Text style={styles.error}>{errors.surname}</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
            {/* ✅ Logout button added below */}
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
    padding: 24,
  },
  header: {
    fontSize: 22,
    color: '#2563eb',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
  },
  label: {
    fontWeight: '500',
    marginBottom: 2,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 7,
  },
  logoutButton: {
    backgroundColor: '#dc3545', // red
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  error: {
    color: 'red',
    marginBottom: 7,
    fontSize: 13,
  },
  successBox: {
    backgroundColor: '#d1e7dd',
    borderRadius: 8,
    padding: 11,
    marginBottom: 16,
  },
  successText: {
    color: '#1e6d46',
    textAlign: 'center',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
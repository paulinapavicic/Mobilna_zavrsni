import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/authService'; 
import { getCategories, getCoaches } from '../../services/utilsService'; 


type Role = 'Skater' | 'Coach';

interface RegisterValues {
  name: string;
  surname: string;
  password: string;
  role: Role | '';
  categoryId: string;
  coachId: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('First name is required'),
  surname: Yup.string().required('Last name is required'),
  password: Yup.string().required('Password is required'),
  role: Yup.string().required('Role is required'),
  categoryId: Yup.string().when('role', (role, schema) => {
    return role === 'Skater' ? schema.required('Category is required') : schema.notRequired();
  }),
  coachId: Yup.string().when('role', (role, schema) => {
    return role === 'Skater' ? schema.required('Coach is required') : schema.notRequired();
  }),
});


export default function RegisterScreen({ navigation }: any) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [coaches, setCoaches] = useState<{ id: string; name: string; surname: string }[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => Alert.alert('Error', 'Failed to load categories'));

    getCoaches()
      .then(setCoaches)
      .catch(() => Alert.alert('Error', 'Failed to load coaches'));
  }, []);

 const handleSubmit = (values: RegisterValues) => {
  // Normalize role (capitalize first letter)
  const role = values.role.trim();

  const payload: any = {
    name: values.name.trim(),
    surname: values.surname.trim(),
    password: values.password,
    role,
  };

  // Only include categoryId and coachId if role is exactly 'Skater'
  if (role === 'Skater') {
    if (values.categoryId) {
      payload.categoryId = parseInt(values.categoryId, 10);
    }
    if (values.coachId) {
      payload.coachId = values.coachId;
    }
  }

  console.log('Submitting payload:', payload);

  registerUser(payload)
    .then(() => {
      Alert.alert('Success', 'Registration complete');
      navigation.navigate('Login');
    })
    .catch(err => {
      // Log entire error response for debugging
      console.error('Registration error:', err);
      if (err.response) {
        console.error('API error details:', err.response);
      }
      const msg = err.response?.data?.message || err.response?.data?.title || err.message || 'Registration failed';
      Alert.alert('Register Failed', msg);
    });
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register</Text>
      <Formik
        initialValues={{
          name: '',
          surname: '',
          password: '',
          role: '',
          categoryId: '',
          coachId: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, setFieldValue, values, errors, touched, handleSubmit }) => (
          <>
            <TextInput
              placeholder="First name"
              style={styles.input}
              onChangeText={handleChange('name')}
              value={values.name}
              autoCapitalize="words"
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              placeholder="Last name"
              style={styles.input}
              onChangeText={handleChange('surname')}
              value={values.surname}
              autoCapitalize="words"
            />
            {touched.surname && errors.surname && <Text style={styles.error}>{errors.surname}</Text>}

            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <Picker
              selectedValue={values.role}
              onValueChange={value => setFieldValue('role', value)}
              style={styles.input}
            >
              <Picker.Item label="Select role" value="" />
              <Picker.Item label="Coach" value="Coach" />
              <Picker.Item label="Skater" value="Skater" />
            </Picker>
            {touched.role && errors.role && <Text style={styles.error}>{errors.role}</Text>}

            {values.role === 'Skater' && (
              <>
                <Picker
                  selectedValue={values.categoryId}
                  onValueChange={value => setFieldValue('categoryId', value)}
                  style={styles.input}
                >
                  <Picker.Item label="Select category" value="" />
                  {categories.map(cat => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
                {touched.categoryId && errors.categoryId && (
                  <Text style={styles.error}>{errors.categoryId}</Text>
                )}

                <Picker
                  selectedValue={values.coachId}
                  onValueChange={value => setFieldValue('coachId', value)}
                  style={styles.input}
                >
                  <Picker.Item label="Select coach" value="" />
                  {coaches.map(coach => (
                    <Picker.Item
                      key={coach.id}
                      label={`${coach.name} ${coach.surname}`}
                      value={coach.id}
                    />
                  ))}
                </Picker>
                {touched.coachId && errors.coachId && (
                  <Text style={styles.error}>{errors.coachId}</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              accessibilityLabel="Register button"
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2563eb',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

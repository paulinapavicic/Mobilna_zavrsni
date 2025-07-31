import React, { useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../navigation/AuthContext';
import { loginUser } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Validation schema using Yup
const LoginSchema = Yup.object().shape({
  name: Yup.string().required('First name is required'),
  surname: Yup.string().required('Last name is required'),
  password: Yup.string().required('Password is required'),
});

const LoginScreen: React.FC = () => {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (values: { name: string; surname: string; password: string }) => {
  try {
    const res = await loginUser(values.name, values.surname, values.password);

    console.log('LOGIN RESPONSE:', res);
    Alert.alert('Login response', JSON.stringify(res, null, 2));
    
    await AsyncStorage.setItem('token', res.token); // ✅ Save token

    login(
      {
        id: res.user.id,
        role: res.user.role,
        coachId: res.user.coachId,
        skaterId: res.user.skaterId,
      },
      res.token
    );
  } catch (err: any) {
    Alert.alert(
      'Login Failed',
      err?.response?.data?.message || 'Invalid name, surname or password'
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to Skating App</Text>
      <Formik
        initialValues={{ name: '', surname: '', password: '' }}
        validationSchema={LoginSchema}
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
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#888"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              autoCapitalize="none"
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#888"
              onChangeText={handleChange('surname')}
              onBlur={handleBlur('surname')}
              value={values.surname}
              autoCapitalize="none"
            />
            {touched.surname && errors.surname && (
              <Text style={styles.error}>{errors.surname}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#2563eb',
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
});

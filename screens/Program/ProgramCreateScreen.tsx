import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { createProgram } from '../../services/programService';

const ProgramCreateScreen: React.FC = () => {
  const navigation = useNavigation();

  const initialValues = {
    year: '',
    type: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    year: Yup.number()
      .required('Year is required')
      .min(1900, 'Too old')
      .max(new Date().getFullYear() + 5, 'Invalid future year'),
    type: Yup.string().required('Please select a type'),
    description: Yup.string().required('Description is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await createProgram(values); // Assumes POST /program
      Alert.alert('Success', 'Program successfully added!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', 'Could not add program!');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Add Program</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancel}>×</Text>
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
            }) => (
              <>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="e.g. 2025"
                  value={values.year}
                  onChangeText={handleChange('year')}
                  onBlur={handleBlur('year')}
                />
                {touched.year && errors.year && (
                  <Text style={styles.error}>{errors.year}</Text>
                )}

                <Text style={styles.label}>Type</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={values.type}
                    onValueChange={(value) => setFieldValue('type', value)}
                  >
                    <Picker.Item label="-- Select --" value="" />
                    <Picker.Item label="Free" value="Free" />
                    <Picker.Item label="Short" value="Short" />
                  </Picker>
                </View>
                {touched.type && errors.type && (
                  <Text style={styles.error}>{errors.type}</Text>
                )}

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe the program..."
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                />
                {touched.description && errors.description && (
                  <Text style={styles.error}>{errors.description}</Text>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()}>
                  <Text style={styles.submitText}>Add Program</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProgramCreateScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 16,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  cancel: {
    fontSize: 28,
    fontWeight: '500',
    color: '#999',
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fcfcfc',
    padding: 12,
    marginBottom: 10,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
});

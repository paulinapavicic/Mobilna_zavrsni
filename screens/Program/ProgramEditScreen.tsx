import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProgramById, updateProgram } from '../../services/programService';

type RouteParams = { id: string };

const ProgramEditScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as RouteParams;

  const [initialValues, setInitialValues] = useState({
    id: '',
    year: '',
    type: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    year: Yup.number()
      .required('Year is required')
      .min(1900)
      .max(new Date().getFullYear() + 5),
    type: Yup.string().required('Type is required'),
    description: Yup.string().required('Description is required'),
  });

  useEffect(() => {
    const loadProgram = async () => {
      try {
        console.log('👀 Fetching program with ID:', id);
        const data = await getProgramById(id);
        console.log('✅ Program loaded:', data);

        setInitialValues({
          id: data.id,
          year: data.year.toString(),
          type: data.type,
          description: data.description,
        });
      } catch (e) {
        console.error('❌ Failed to load program:', e);
        Alert.alert('Error', 'Could not load program data.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [id]);

const handleSubmit = async (values: typeof initialValues) => {
  try {
    const payload = {
      id: values.id, // ✅ required
      year: parseInt(values.year, 10),
      type: values.type,
      description: values.description,
    };

    console.log('📦 Submitting to updateProgram:', payload);

    await updateProgram(values.id, payload);

    Alert.alert('Success', 'Program updated successfully');
    navigation.goBack();
  } catch (e: any) {
    console.error('❌ Failed to update program:', e?.response?.data || e.message);
    Alert.alert(
      'Update Failed',
      e?.response?.data?.title || 'Unable to update'
    );
  }
};


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!initialValues.id) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>No program found to edit.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>✏️ Edit Program</Text>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={styles.input}
                value={values.year}
                onChangeText={handleChange('year')}
                onBlur={handleBlur('year')}
                keyboardType="numeric"
                placeholder="e.g. 2025"
              />
              {touched.year && errors.year && <Text style={styles.error}>{errors.year}</Text>}

              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={values.type}
                  onValueChange={(val) => setFieldValue('type', val)}
                >
                  <Picker.Item label="-- Select --" value="" />
                  <Picker.Item label="Free" value="Free" />
                  <Picker.Item label="Short" value="Short" />
                </Picker>
              </View>
              {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

              <Text style={styles.label}>Description</Text>
              <TextInput
                multiline
                style={[styles.input, styles.textArea]}
                numberOfLines={3}
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                placeholder="Describe the program..."
              />
              {touched.description && errors.description && (
                <Text style={styles.error}>{errors.description}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={() => handleSubmit()}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default ProgramEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 3,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelBtn: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelText: {
    fontWeight: '600',
    color: '#444',
  },
});

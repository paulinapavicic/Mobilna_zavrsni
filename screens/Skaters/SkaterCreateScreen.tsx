import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createSkater, getSkaterCategories } from '../../services/skaterService';

type Category = {
  id: number;  // Make sure backend expects int
  name: string;
};

const SkaterCreateScreen: React.FC = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getSkaterCategories();
      setCategories(response);
    } catch (err) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    categoryId: Yup.number()
      .required('Category is required')
      .moreThan(0, 'Please select a valid category'),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add New Skater</Text>

        <Formik
          initialValues={{ name: '', surname: '', categoryId: 0 }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = {
                name: values.name,
                surname: values.surname,
                categoryId: Number(values.categoryId), // ensure this is a number!
              };
              console.log('📤 Submitting payload:', payload);

              await createSkater(payload);

              Alert.alert('Success', 'Skater created successfully');
              navigation.goBack();
            } catch (error: any) {
              console.error('❌ API Error', error.response?.data || error.message);
              let message =
                error.response?.data?.title ||
                error.response?.data?.message ||
                'Failed to create skater';
              if (
                error.response?.data?.errors &&
                typeof error.response.data.errors === 'object'
              ) {
                message = Object.entries(error.response.data.errors)
                  .map(([key, msgs]) => {
                    if (Array.isArray(msgs)) return `${key}: ${msgs.join(', ')}`;
                    return `${key}: ${msgs}`;
                  })
                  .join('\n');
              }
              Alert.alert('Error', message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                autoCapitalize="words"
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}

              <Text style={styles.label}>
                Surname <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={values.surname}
                onChangeText={handleChange('surname')}
                onBlur={handleBlur('surname')}
                autoCapitalize="words"
              />
              {touched.surname && errors.surname && (
                <Text style={styles.error}>{errors.surname}</Text>
              )}

              <Text style={styles.label}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={values.categoryId}
                  onValueChange={(itemValue) => {
                    setFieldValue('categoryId', itemValue);
                    console.log('Selection changed:', itemValue);
                  }}
                  mode="dropdown"
                >
                  <Picker.Item label="-- Select Category --" value={0} />
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
              {touched.categoryId && errors.categoryId && (
                <Text style={styles.error}>{errors.categoryId}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  disabled={isSubmitting}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={[styles.button, styles.cancelButton]}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default SkaterCreateScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8fafc',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2563eb',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  required: {
    color: '#dc2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
    marginTop: -12,
    marginBottom: 12,
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7b94f8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    color: '#fff',
  },
});

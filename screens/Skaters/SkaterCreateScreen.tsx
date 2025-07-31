import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createSkater, getSkaterCategories } from '../../services/skaterService';

type Category = {
  id: number; // ⬅️ Your backend expects this to be an integer
  name: string;
};

const SkaterCreateScreen: React.FC = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await getSkaterCategories();
      setCategories(data);
    } catch {
      Alert.alert('Error', 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
          onSubmit={async (values) => {
            try {
              console.log('📤 Submitting payload:', values);

              await createSkater({
                name: values.name,
                surname: values.surname,
                categoryId: values.categoryId, // ✅ integer!
              });

              Alert.alert('Success', 'Skater created successfully!');
              navigation.goBack();
            } catch (error: any) {
              console.error('❌ API Error:', error?.response?.data || error.message);
              Alert.alert('Error', error?.response?.data?.title || 'Failed to create skater.');
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <>
              <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text style={styles.label}>Surname <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                value={values.surname}
                onChangeText={handleChange('surname')}
                onBlur={handleBlur('surname')}
              />
              {touched.surname && errors.surname && <Text style={styles.error}>{errors.surname}</Text>}

              <Text style={styles.label}>Category <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={values.categoryId}
                  onValueChange={(itemValue) => {
                    setFieldValue('categoryId', itemValue); // ✅ store as number
                    console.log('🟢 Selected categoryId:', itemValue);
                  }}
                >
                  <Picker.Item label="-- Select --" value={0} />
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
              {touched.categoryId && errors.categoryId && (
                <Text style={styles.error}>{errors.categoryId}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
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

export default SkaterCreateScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  required: {
    color: '#e53935',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#adb5bd',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#222',
    fontWeight: 'bold',
  },
});

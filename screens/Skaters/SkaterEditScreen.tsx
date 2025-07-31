import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import {
  getSkaterById,
  updateSkater,
  getSkaterCategories,
} from '../../services/skaterService';

type RouteParams = {
  id: string;
};

const SkaterEditScreen: React.FC = () => {
  const { id } = useRoute().params as RouteParams;
  const navigation = useNavigation();

  const [initialValues, setInitialValues] = useState({
    id: '',
    name: '',
    surname: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const skater = await getSkaterById(id);
        const cats = await getSkaterCategories();

        setInitialValues({
          id: skater.id,
          name: skater.name,
          surname: skater.surname,
          categoryId: skater.categoryId,
        });
        setCategories(cats);
      } catch (err) {
        Alert.alert('Error', 'Failed to load skater details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    categoryId: Yup.string().required('Category is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateSkater(values.id, values);
      Alert.alert('Success', 'Skater updated successfully.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not update skater.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Skater</Text>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
          }) => (
            <>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Enter name"
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
                placeholder="Enter surname"
              />
              {touched.surname && errors.surname && (
                <Text style={styles.error}>{errors.surname}</Text>
              )}

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={values.categoryId}
                  onValueChange={(value) => setFieldValue('categoryId', value)}
                >
                  <Picker.Item label="-- Select Category --" value="" />
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.name}
                      value={cat.id}
                    />
                  ))}
                </Picker>
              </View>
              {touched.categoryId && errors.categoryId && (
                <Text style={styles.error}>{errors.categoryId}</Text>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.saveBtn}>
                  <Text style={styles.saveText}>Save Changes</Text>
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

export default SkaterEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
    textAlign: 'center',
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
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#adb5bd',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#222',
    fontWeight: 'bold',
  },
});

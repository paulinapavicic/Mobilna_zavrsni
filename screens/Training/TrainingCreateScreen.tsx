import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createTraining, getTrainingElements } from '../../services/trainingService';

const TrainingCreateScreen: React.FC = () => {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [elementOptions, setElementOptions] = useState<{ id: string; name: string }[]>([]);
  const [type, setType] = useState<'OnIce' | 'OffIce'>('OnIce');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTypeChange = async (selectedType: 'OnIce' | 'OffIce') => {
    setType(selectedType);
    try {
      const elements = await getTrainingElements(selectedType);
      setElementOptions(elements);
    } catch {
      Alert.alert('Error', 'Failed to load elements.');
    }
  };

  useEffect(() => {
    handleTypeChange(type);
  }, []);

  const validationSchema = Yup.object().shape({
    duration: Yup.number().min(1).required('Duration is required'),
    notes: Yup.string().optional(),
    elements: Yup.array().of(Yup.string()).min(1, 'Select at least one element'),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add Training Session</Text>

        <Formik
          initialValues={{
            duration: '',
            notes: '',
            elements: [] as string[],
          }}
          validationSchema={validationSchema}
         onSubmit={async (values) => {
  try {
    await createTraining({
  date: selectedDate.toISOString(),
  duration: Number(values.duration),
  type,
  elements: values.elements.join(','), // ✅ send as comma-separated string
  notes: values.notes,
});

    Alert.alert('Success', 'Training created!');
    navigation.goBack();
  } catch (error: any) {
    console.error('🚨 createTraining error:', error?.response?.data || error.message || error);
    Alert.alert('Error', 'Failed to create training');
  }
}}

        >
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={selectedDate}
                  onChange={(_, date) => {
                    setSelectedDate(date || new Date());
                    setShowDatePicker(false);
                  }}
                />
              )}

              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                value={values.duration}
                onChangeText={handleChange('duration')}
              />
              {touched.duration && errors.duration && (
                <Text style={styles.error}>{errors.duration}</Text>
              )}

              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={type}
                  onValueChange={(val) => handleTypeChange(val)}
                >
                  <Picker.Item label="On Ice" value="OnIce" />
                  <Picker.Item label="Off Ice" value="OffIce" />
                </Picker>
              </View>

              <Text style={styles.label}>Elements</Text>
              {elementOptions.map((el) => (
                <TouchableOpacity
                  key={el.id}
                  style={styles.optionRow}
                  onPress={() => {
                    const updated = values.elements.includes(el.id)
                      ? values.elements.filter((e) => e !== el.id)
                      : [...values.elements, el.id];
                    setFieldValue('elements', updated);
                  }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      values.elements.includes(el.id) && styles.checked,
                    ]}
                  />
                  <Text style={styles.optionText}>{el.name}</Text>
                </TouchableOpacity>
              ))}
              {touched.elements && errors.elements && (
                <Text style={styles.error}>{errors.elements as string}</Text>
              )}

              <Text style={styles.label}>Notes</Text>
              <TextInput
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textarea]}
                value={values.notes}
                onChangeText={handleChange('notes')}
                placeholder="Any notes..."
              />

              <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()}>
                <Text style={styles.submitText}>Add Training</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default TrainingCreateScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  checked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#888',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 6,
  },
});

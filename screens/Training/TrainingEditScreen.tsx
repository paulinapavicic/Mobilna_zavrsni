import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getTrainingById, updateTraining, getTrainingElements } from '../../services/trainingService';

type RouteParams = { id: string };

const TrainingEditScreen: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const navigation = useNavigation();

  const [initialData, setInitialData] = useState<any>(null);
  const [elements, setElements] = useState<{ id: string; name: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [type, setType] = useState<'OnIce' | 'OffIce'>('OnIce');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load single training on mount
  useEffect(() => {
    const loadTraining = async () => {
      try {
        const trainingApiResult = await getTrainingById(id);
        // If your API wraps in { Training, OnIceElements, OffIceElements }
        const training = trainingApiResult.Training || trainingApiResult.training || trainingApiResult;
        if (!training) throw new Error('No training found');
        setInitialData({
          ...training,
          duration: training.duration?.toString() ?? '',
          elements: training.elements?.split(',').map((x: string) => x.trim()).filter(Boolean) ?? [],
          notes: training.notes ?? '',
        });
        setSelectedDate(new Date(training.date));
        setType(training.type);
      } catch (e) {
        console.error('Failed to load training:', e);
        Alert.alert('Error', 'Failed to load training.');
        navigation.goBack();
      }
    };
    loadTraining();
  }, [id]);

  // Load element list when type changes
  useEffect(() => {
    const loadElements = async () => {
      try {
        const data = await getTrainingElements(type);
        setElements(data);
      } catch {
        Alert.alert('Error', 'Failed to load elements');
      }
    };
    loadElements();
  }, [type]);

  const validationSchema = Yup.object().shape({
    duration: Yup.number().min(1).required(),
    elements: Yup.array().min(1, 'Select at least one element'),
    notes: Yup.string().optional(),
  });

  if (!initialData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading training…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Training Session</Text>
        <Formik
          enableReinitialize
          initialValues={initialData}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await updateTraining(values.id, {
                date: selectedDate.toISOString(),
                duration: parseInt(values.duration, 10),
                type,
                elements: values.elements.join(','),
                notes: values.notes || '',
              });
              Alert.alert('Success', 'Training updated successfully');
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Could not update training');
            }
          }}
        >
          {({ handleChange, handleSubmit, setFieldValue, values, touched, errors }) => (
            <>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{selectedDate.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                  }}
                />
              )}

              <Text style={styles.label}>Duration (min)</Text>
              <TextInput
                style={styles.input}
                value={values.duration}
                keyboardType="number-pad"
                onChangeText={handleChange('duration')}
              />
              {touched.duration && errors.duration && <Text style={styles.error}>{errors.duration}</Text>}

              <Text style={styles.label}>Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={type}
                  onValueChange={(val) => {
                    setType(val);
                    setFieldValue('type', val);
                    setFieldValue('elements', []);
                  }}
                >
                  <Picker.Item label="On Ice" value="OnIce" />
                  <Picker.Item label="Off Ice" value="OffIce" />
                </Picker>
              </View>

              <Text style={styles.label}>Elements</Text>
              {elements.map((el) => (
                <TouchableOpacity
                  key={el.id}
                  style={styles.checkboxRow}
                  onPress={() => {
                    const selected = values.elements.includes(el.id)
                      ? values.elements.filter((e: string) => e !== el.id)
                      : [...values.elements, el.id];
                    setFieldValue('elements', selected);
                  }}
                >
                  <View style={[
                    styles.checkbox,
                    values.elements.includes(el.id) && styles.checked,
                  ]}/>
                  <Text style={styles.checkboxLabel}>{el.name}</Text>
                </TouchableOpacity>
              ))}
              {touched.elements && errors.elements && <Text style={styles.error}>{errors.elements}</Text>}

              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={values.notes}
                multiline
                numberOfLines={3}
                onChangeText={handleChange('notes')}
                placeholder="Any notes..."
              />

              <View style={styles.buttons}>
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

export default TrainingEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 6,
  },
  pickerWrapper: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 10,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxLabel: {
    fontSize: 15,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#dee2e6',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});

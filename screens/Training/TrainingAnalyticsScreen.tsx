import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getTrainings } from '../../services/trainingService';

const screenWidth = Dimensions.get('window').width;

// Define data point structure
type DataPoint = {
  date: string;     // e.g., "07/21"
  duration: number; // Total duration for that date
};

const TrainingAnalyticsScreen: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const allTrainings = await getTrainings(); // Assuming this fetches all user's sessions

        // Group and sum total minutes per day
        const grouped = allTrainings.reduce((acc: Record<string, number>, item) => {
          const dateKey = new Date(item.date).toISOString().split('T')[0]; // "YYYY-MM-DD"
          acc[dateKey] = (acc[dateKey] || 0) + item.duration;
          return acc;
        }, {});

        // Format and sort as MM/DD labels
        const result = Object.entries(grouped)
          .map(([date, duration]) => ({
            sortKey: new Date(date).getTime(),
            date: new Date(date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
            duration,
          }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ date, duration }) => ({ date, duration }));

        setDataPoints(result);
      } catch (error) {
        console.error('Analytics fetch failed:', error);
        Alert.alert('Error', 'Failed to load training analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = {
    labels: dataPoints.map(d => d.date), // Labels like "07/21"
    datasets: [
      {
        data: dataPoints.map(d => d.duration),
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Training Analytics</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 40 }} />
      ) : dataPoints.length === 0 ? (
        <Text style={styles.emptyText}>No training data found.</Text>
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={240}
          yAxisSuffix=" min"
          fromZero
          chartConfig={{
            backgroundGradientFrom: '#f8f9fa',
            backgroundGradientTo: '#f8f9fa',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: () => '#555',
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#2563eb',
            },
          }}
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
};

export default TrainingAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2563eb',
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontStyle: 'italic',
  },
});

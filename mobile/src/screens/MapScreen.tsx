import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';

export default function MapScreen() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [preferences, setPreferences] = useState({ avoid_unpaved: true, scenic: false, twistiness: 0 });

  useEffect(() => {
    // Fetch sample plan from the API
    async function load() {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:4000/api/plans', { origin: { lat: 37.7749, lon: -122.4194 }, destination: { lat: 36.6002, lon: -121.8947 }, options: preferences });
        setPlan(res.data.plan);
      } catch (e) {
        // ignore failures during scaffold; app may run via tunnel in expo
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [preferences]);

  const center = plan && plan.waypoints && plan.waypoints.length ? plan.waypoints[0] : { lat: 37.7749, lon: -122.4194 };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: center.lat, longitude: center.lon, latitudeDelta: 0.5, longitudeDelta: 0.5 }}>
        {plan && plan.waypoints && (
          <>
            {plan.waypoints.map((w: any, i: number) => (
              <Marker key={i} coordinate={{ latitude: w.lat, longitude: w.lon }} />
            ))}
            <Polyline
              coordinates={plan.waypoints.map((w: any) => ({ latitude: w.lat, longitude: w.lon }))}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          </>
        )}
      </MapView>

      <View style={styles.panel}>
        {loading ? <ActivityIndicator /> : plan ? <Text style={styles.title}>{plan.name}</Text> : <Text>No plan loaded</Text>}
        <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
          <Button title="Low Twist" onPress={() => setPreferences((p: any) => ({ ...p, twistiness: 0 }))} />
          <Button title="Medium Twist" onPress={() => setPreferences((p: any) => ({ ...p, twistiness: 0.5 }))} />
          <Button title="High Twist" onPress={() => setPreferences((p: any) => ({ ...p, twistiness: 0.9 }))} />
        </View>
        <View style={{ marginTop: 8 }}>
          <Button title="Refresh" onPress={() => { setPlan(null); }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'rgba(255,255,255,0.9)', padding: 12, borderRadius: 8 },
  title: { fontWeight: 'bold', marginBottom: 8 }
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SavedScreen() {
  const router = useRouter();
  return (
    <View style={styles.screen}>
      <Text style={styles.emoji}>🔖</Text>
      <Text style={styles.title}>No saved trips yet</Text>
      <Text style={styles.sub}>Build an itinerary and save it here.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.push('/')}>
        <Text style={styles.btnText}>Explore Destinations →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emoji: { fontSize: 56 },
  title: { fontSize: 20, fontWeight: '700', color: '#f0f2ff' },
  sub: { fontSize: 15, color: '#8b91b0', textAlign: 'center' },
  btn: { marginTop: 8, backgroundColor: '#4f6ef7', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

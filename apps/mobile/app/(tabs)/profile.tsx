import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const SPORT_OPTIONS = [
  { key: 'football', label: '⚽ Football' },
  { key: 'tennis', label: '🎾 Tennis' },
  { key: 'formula1', label: '🏎️ Formula 1' },
  { key: 'basketball', label: '🏀 Basketball' },
  { key: 'baseball', label: '⚾ Baseball' },
  { key: 'rugby', label: '🏉 Rugby' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.screen}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}><Text style={styles.avatarText}>✈️</Text></View>
        <Text style={styles.name}>Sports Traveler</Text>
        <Text style={styles.email}>traveler@example.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Home Airport</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>✈️ ORD – Chicago</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favourite Sports</Text>
        <View style={styles.sportsGrid}>
          {SPORT_OPTIONS.map((s) => (
            <View key={s.key} style={styles.sportChip}>
              <Text style={styles.sportChipText}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget (per person)</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>💵 Up to $1,500 USD</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seat Preference</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>💺 Economy</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1117' },
  avatarSection: { alignItems: 'center', padding: 32, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1e2235', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#4f6ef7' },
  avatarText: { fontSize: 36 },
  name: { fontSize: 20, fontWeight: '700', color: '#f0f2ff' },
  email: { fontSize: 14, color: '#8b91b0' },
  editBtn: { marginTop: 8, borderRadius: 10, borderWidth: 1, borderColor: '#4f6ef7', paddingHorizontal: 24, paddingVertical: 8 },
  editBtnText: { color: '#4f6ef7', fontWeight: '600' },
  section: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#1e2235', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2f4a' },
  sectionTitle: { fontSize: 12, color: '#5a607a', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valueText: { fontSize: 15, color: '#f0f2ff' },
  chevron: { fontSize: 20, color: '#5a607a' },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportChip: { backgroundColor: 'rgba(79,110,247,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(79,110,247,0.3)' },
  sportChipText: { fontSize: 13, color: '#4f6ef7', fontWeight: '500' },
});

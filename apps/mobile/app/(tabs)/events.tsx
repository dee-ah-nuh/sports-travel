import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_EVENTS_LIST, SPORT_COLORS, SPORT_EMOJI } from '../../data/mock';

const SPORT_FILTERS = ['All', 'Football', 'Tennis', 'Formula1', 'Basketball'];

export default function EventsScreen() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState('All');

  const filtered = MOCK_EVENTS_LIST.filter((e) =>
    selectedSport === 'All' ? true : e.sport.toLowerCase() === selectedSport.toLowerCase(),
  );

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Text style={styles.headerSub}>Sporting events you can travel to</Text>
      </View>

      {/* Sport filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {SPORT_FILTERS.map((sport) => (
          <TouchableOpacity
            key={sport}
            style={[styles.chip, selectedSport === sport && styles.chipActive]}
            onPress={() => setSelectedSport(sport)}
          >
            <Text style={[styles.chipText, selectedSport === sport && styles.chipTextActive]}>
              {sport === 'All' ? '🌍 All' : `${SPORT_EMOJI[sport.toLowerCase()] ?? '🏆'} ${sport}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {filtered.map((event) => {
          const color = SPORT_COLORS[event.sport] ?? '#6b7280';
          return (
            <TouchableOpacity
              key={event.id}
              style={styles.card}
              onPress={() => router.push(`/itinerary/${event.id}`)}
            >
              {/* Sport badge */}
              <View style={[styles.sportBadge, { borderColor: `${color}44`, backgroundColor: `${color}18` }]}>
                <Text style={styles.sportEmoji}>{SPORT_EMOJI[event.sport] ?? '🏆'}</Text>
                <Text style={[styles.sportLabel, { color }]}>
                  {event.sport.charAt(0).toUpperCase() + event.sport.slice(1)}
                </Text>
                {event.league && <Text style={[styles.leagueLabel, { color: `${color}cc` }]}>{event.league}</Text>}
              </View>

              <Text style={styles.eventName}>{event.name}</Text>

              {(event.homeTeam && event.awayTeam) && (
                <Text style={styles.matchup}>{event.homeTeam} vs {event.awayTeam}</Text>
              )}

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>📍 {event.venue.name}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  📅{' '}
                  {new Date(event.startTime).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </Text>
              </View>

              <View style={styles.footer}>
                {event.minTicketPrice && (
                  <Text style={styles.ticketPrice}>
                    🎟 from {event.currency}{event.minTicketPrice.toLocaleString()}
                  </Text>
                )}
                <View style={[styles.ctaButton, { backgroundColor: color }]}>
                  <Text style={styles.ctaText}>Plan Trip →</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1117' },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#f0f2ff' },
  headerSub: { fontSize: 14, color: '#8b91b0', marginTop: 4 },
  chips: { paddingLeft: 16, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#2a2f4a', marginRight: 8, backgroundColor: '#1e2235',
  },
  chipActive: { borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.15)' },
  chipText: { fontSize: 13, color: '#8b91b0', fontWeight: '500' },
  chipTextActive: { color: '#4f6ef7' },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#1e2235', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2a2f4a', gap: 8,
  },
  sportBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, alignSelf: 'flex-start',
  },
  sportEmoji: { fontSize: 14 },
  sportLabel: { fontSize: 12, fontWeight: '700' },
  leagueLabel: { fontSize: 11 },
  eventName: { fontSize: 18, fontWeight: '700', color: '#f0f2ff', lineHeight: 24 },
  matchup: { fontSize: 14, color: '#8b91b0', fontWeight: '500' },
  metaRow: { flexDirection: 'row' },
  metaText: { fontSize: 13, color: '#8b91b0' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  ticketPrice: { fontSize: 14, color: '#8b91b0', fontWeight: '500' },
  ctaButton: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  ctaText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

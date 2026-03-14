import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_DESTINATIONS, MOCK_EVENTS_LIST, SPORT_COLORS, SPORT_EMOJI } from '../../data/mock';

const SPORTS = ['All', 'Football', 'Tennis', 'Formula1', 'Basketball'];

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filtered = MOCK_DESTINATIONS.filter((d) => {
    if (selectedSport !== 'All') {
      return d.events.some((e) => e.sport.toLowerCase() === selectedSport.toLowerCase());
    }
    return true;
  }).filter((d) =>
    searchText ? d.city.toLowerCase().includes(searchText.toLowerCase()) : true,
  );

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor="#5a607a"
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.originChip}>
          <Text style={styles.originText}>✈️ From ORD</Text>
        </View>
      </View>

      {/* Sport filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {SPORTS.map((sport) => (
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

      {/* Destination cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{filtered.length} Destinations</Text>
        {filtered.map((dest) => (
          <DestinationCard
            key={dest.iataCode}
            dest={dest}
            onEventPress={(eventId) => router.push(`/itinerary/${eventId}`)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function DestinationCard({
  dest,
  onEventPress,
}: {
  dest: (typeof MOCK_DESTINATIONS)[0];
  onEventPress: (id: string) => void;
}) {
  function flagEmoji(code: string): string {
    return code
      .toUpperCase()
      .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.flag}>{flagEmoji(dest.countryCode)}</Text>
          <View>
            <Text style={styles.cityName}>{dest.city}</Text>
            <Text style={styles.countryName}>{dest.country}</Text>
          </View>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>from</Text>
          <Text style={styles.price}>${dest.price}</Text>
          <Text style={styles.priceCurrency}>{dest.currency}</Text>
        </View>
      </View>

      <View style={styles.flightRow}>
        <Text style={styles.flightBadge}>{dest.directFlight ? '✈️ Direct' : '🔗 Connecting'}</Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.flightMeta}>
          {Math.floor(dest.minDurationMinutes / 60)}h {dest.minDurationMinutes % 60}m
        </Text>
      </View>

      {dest.events.length > 0 && (
        <View style={styles.eventsSection}>
          <Text style={styles.eventsLabel}>{dest.eventCount} event{dest.eventCount > 1 ? 's' : ''}</Text>
          {dest.events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventChip,
                { borderColor: `${SPORT_COLORS[event.sport] ?? '#6b7280'}55` },
                { backgroundColor: `${SPORT_COLORS[event.sport] ?? '#6b7280'}15` },
              ]}
              onPress={() => onEventPress(event.id)}
            >
              <Text style={styles.eventEmoji}>{SPORT_EMOJI[event.sport] ?? '🏆'}</Text>
              <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
              {event.minTicketPrice && (
                <Text style={styles.eventPrice}>
                  {event.currency}{event.minTicketPrice}+
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1117' },
  searchRow: { flexDirection: 'row', gap: 10, padding: 16, alignItems: 'center' },
  searchInput: {
    flex: 1, backgroundColor: '#1e2235', borderRadius: 12, padding: 12,
    color: '#f0f2ff', fontSize: 15, borderWidth: 1, borderColor: '#2a2f4a',
  },
  originChip: {
    backgroundColor: '#1e2235', borderRadius: 12, paddingHorizontal: 12,
    paddingVertical: 12, borderWidth: 1, borderColor: '#2a2f4a',
  },
  originText: { color: '#8b91b0', fontSize: 13 },
  chips: { paddingLeft: 16, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#2a2f4a', marginRight: 8, backgroundColor: '#1e2235',
  },
  chipActive: { borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.15)' },
  chipText: { fontSize: 13, color: '#8b91b0', fontWeight: '500' },
  chipTextActive: { color: '#4f6ef7' },
  section: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 13, color: '#5a607a', marginBottom: 4 },
  card: {
    backgroundColor: '#1e2235', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2a2f4a',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardLeft: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  flag: { fontSize: 30 },
  cityName: { fontSize: 18, fontWeight: '700', color: '#f0f2ff' },
  countryName: { fontSize: 12, color: '#8b91b0', marginTop: 2 },
  priceBlock: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, color: '#5a607a', textTransform: 'uppercase' },
  price: { fontSize: 22, fontWeight: '800', color: '#f0f2ff' },
  priceCurrency: { fontSize: 10, color: '#5a607a' },
  flightRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  flightBadge: {
    fontSize: 12, backgroundColor: '#252a42', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 2, color: '#8b91b0', overflow: 'hidden',
  },
  dot: { color: '#5a607a' },
  flightMeta: { fontSize: 13, color: '#8b91b0' },
  eventsSection: { borderTopWidth: 1, borderTopColor: '#252a42', paddingTop: 10, gap: 6 },
  eventsLabel: { fontSize: 11, color: '#4f6ef7', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  eventChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8,
    borderRadius: 8, borderWidth: 1,
  },
  eventEmoji: { fontSize: 16 },
  eventName: { flex: 1, fontSize: 13, color: '#f0f2ff', fontWeight: '500' },
  eventPrice: { fontSize: 12, color: '#8b91b0' },
});

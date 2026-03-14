import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_EVENTS_MAP, SPORT_COLORS, SPORT_EMOJI } from '../../data/mock';
import { generateMockOptions } from '../../data/itinerary.mock';

export default function ItineraryScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const event = eventId ? MOCK_EVENTS_MAP[eventId] : null;
  const [selectedTab, setSelectedTab] = useState(0);

  if (!event) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color = SPORT_COLORS[event.sport] ?? '#6b7280';
  const options = generateMockOptions('ORD', event);
  const currentOption = options[selectedTab];

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Event header */}
      <View style={[styles.eventHeader, { borderBottomColor: `${color}33` }]}>
        <View style={[styles.sportBadge, { borderColor: `${color}44`, backgroundColor: `${color}18` }]}>
          <Text style={styles.sportEmoji}>{SPORT_EMOJI[event.sport] ?? '🏆'}</Text>
          <Text style={[styles.sportLabel, { color }]}>{event.sport}</Text>
        </View>
        <Text style={styles.eventName}>{event.name}</Text>
        {(event as { homeTeam?: string }).homeTeam && (
          <Text style={styles.matchup}>
            {(event as { homeTeam: string; awayTeam: string }).homeTeam} vs{' '}
            {(event as { homeTeam: string; awayTeam: string }).awayTeam}
          </Text>
        )}
        <Text style={styles.venueLine}>📍 {event.venue.name}, {event.venue.city}</Text>
        <Text style={styles.dateLine}>
          📅{' '}
          {new Date(event.startTime).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
        </Text>

        {/* Ticket CTA */}
        {event.minTicketPrice && (
          <TouchableOpacity
            style={[styles.ticketBtn, { backgroundColor: color }]}
            onPress={() => Linking.openURL(event.ticketUrl ?? 'https://www.stubhub.com')}
          >
            <Text style={styles.ticketBtnText}>
              🎟 Get Tickets from {event.currency}{event.minTicketPrice.toLocaleString()} · StubHub ↗
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Option tabs */}
      <View style={styles.tabRow}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.tab, selectedTab === i && styles.tabActive]}
            onPress={() => setSelectedTab(i)}
          >
            <Text style={styles.tabEmoji}>
              {opt.label === 'cheapest' ? '💰' : opt.label === 'fastest' ? '⚡' : '⭐'}
            </Text>
            <Text style={[styles.tabLabel, selectedTab === i && styles.tabLabelActive]}>
              {opt.label.charAt(0).toUpperCase() + opt.label.slice(1)}
            </Text>
            <Text style={styles.tabPrice}>${opt.totalCost.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Score bar */}
      {currentOption && (
        <View style={styles.scoreSection}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Match score</Text>
            <View style={styles.scoreTrack}>
              <View
                style={[styles.scoreFill, { width: `${currentOption.score}%` as `${number}%`, backgroundColor: color }]}
              />
            </View>
            <Text style={[styles.scoreVal, { color }]}>{currentOption.score}/100</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Travel time</Text>
              <Text style={styles.statVal}>
                {Math.floor(currentOption.totalTravelMinutes / 60)}h {currentOption.totalTravelMinutes % 60}m
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Pre-event buffer</Text>
              <Text style={styles.statVal}>{currentOption.preEventBufferHours}h</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Flights</Text>
              <Text style={styles.statVal}>{currentOption.legs.filter((l) => l.type !== 'event').length}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Legs */}
      {currentOption && (
        <View style={styles.legsSection}>
          {currentOption.legs.map((leg) =>
            leg.type === 'event' ? (
              <View key={leg.id} style={[styles.eventLeg, { borderColor: `${color}33`, backgroundColor: `${color}0f` }]}>
                <Text style={styles.legIcon}>🎟️</Text>
                <View style={styles.legBody}>
                  <Text style={styles.eventLegName}>{leg.event?.name}</Text>
                  <Text style={styles.eventLegVenue}>📍 {leg.event?.venue.name}</Text>
                </View>
              </View>
            ) : (
              <View key={leg.id} style={styles.flightLeg}>
                <Text style={styles.legIcon}>✈️</Text>
                <View style={styles.legBody}>
                  <View style={styles.routeRow}>
                    <View>
                      <Text style={styles.iata}>{leg.originIata}</Text>
                      <Text style={styles.citySmall}>{leg.originCity}</Text>
                      {leg.departureTime && (
                        <Text style={styles.timeText}>
                          {new Date(leg.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </Text>
                      )}
                    </View>
                    <View style={styles.routeMiddle}>
                      <View style={styles.routeLine} />
                      <Text style={styles.durationText}>
                        {leg.durationMinutes
                          ? `${Math.floor(leg.durationMinutes / 60)}h ${leg.durationMinutes % 60}m`
                          : ''}
                      </Text>
                      <Text style={styles.stopsText}>{leg.stops === 0 ? 'Direct' : `${leg.stops} stop`}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.iata}>{leg.destinationIata}</Text>
                      <Text style={styles.citySmall}>{leg.destinationCity}</Text>
                      {leg.arrivalTime && (
                        <Text style={styles.timeText}>
                          {new Date(leg.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.legFooter}>
                    <Text style={styles.carrierText}>{leg.carrier} · {leg.flightNumber}</Text>
                    <Text style={styles.costText}>${leg.costEstimate?.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            ),
          )}
        </View>
      )}

      {/* Cost breakdown */}
      {currentOption && (
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Flights</Text>
            <Text style={styles.breakdownVal}>${currentOption.breakdown.flightCost.toLocaleString()}</Text>
          </View>
          {currentOption.breakdown.ticketCostEstimate && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Tickets (est.)</Text>
              <Text style={styles.breakdownVal}>from ${currentOption.breakdown.ticketCostEstimate.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Flight total</Text>
            <Text style={styles.totalVal}>${currentOption.totalCost.toLocaleString()} USD</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1117' },
  errorScreen: { flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 18, color: '#f0f2ff' },
  backLink: { color: '#4f6ef7', fontSize: 15 },
  eventHeader: { padding: 20, gap: 8, borderBottomWidth: 1 },
  sportBadge: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  sportEmoji: { fontSize: 14 },
  sportLabel: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  eventName: { fontSize: 22, fontWeight: '800', color: '#f0f2ff', lineHeight: 28 },
  matchup: { fontSize: 15, color: '#8b91b0', fontWeight: '500' },
  venueLine: { fontSize: 14, color: '#8b91b0' },
  dateLine: { fontSize: 14, color: '#8b91b0' },
  ticketBtn: { marginTop: 8, borderRadius: 12, padding: 14, alignItems: 'center' },
  ticketBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  tabRow: { flexDirection: 'row', gap: 10, padding: 16 },
  tab: { flex: 1, backgroundColor: '#1e2235', borderRadius: 14, padding: 12, alignItems: 'center', gap: 2, borderWidth: 1, borderColor: '#2a2f4a' },
  tabActive: { borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.12)' },
  tabEmoji: { fontSize: 18 },
  tabLabel: { fontSize: 12, color: '#8b91b0', fontWeight: '600' },
  tabLabelActive: { color: '#4f6ef7' },
  tabPrice: { fontSize: 15, fontWeight: '800', color: '#f0f2ff' },
  scoreSection: { marginHorizontal: 16, backgroundColor: '#1e2235', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2f4a', gap: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreLabel: { fontSize: 12, color: '#5a607a', width: 80 },
  scoreTrack: { flex: 1, height: 5, backgroundColor: '#2a2f4a', borderRadius: 3, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 3 },
  scoreVal: { fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 0 },
  stat: { flex: 1 },
  statLabel: { fontSize: 11, color: '#5a607a', textTransform: 'uppercase', letterSpacing: 0.5 },
  statVal: { fontSize: 16, fontWeight: '700', color: '#f0f2ff', marginTop: 2 },
  legsSection: { padding: 16, gap: 4 },
  flightLeg: { flexDirection: 'row', gap: 12, backgroundColor: '#1e2235', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2a2f4a' },
  eventLeg: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1, marginVertical: 4 },
  legIcon: { fontSize: 20, marginTop: 2 },
  legBody: { flex: 1, gap: 8 },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iata: { fontSize: 22, fontWeight: '800', color: '#f0f2ff' },
  citySmall: { fontSize: 11, color: '#8b91b0' },
  timeText: { fontSize: 13, fontWeight: '600', color: '#f0f2ff', marginTop: 2 },
  routeMiddle: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: 8 },
  routeLine: { width: '100%', height: 1, backgroundColor: '#2a2f4a' },
  durationText: { fontSize: 12, color: '#8b91b0' },
  stopsText: { fontSize: 11, color: '#5a607a' },
  legFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  carrierText: { fontSize: 12, color: '#5a607a' },
  costText: { fontSize: 13, color: '#8b91b0', fontWeight: '500' },
  eventLegName: { fontSize: 15, fontWeight: '700', color: '#f0f2ff' },
  eventLegVenue: { fontSize: 13, color: '#8b91b0' },
  breakdown: { margin: 16, backgroundColor: '#1e2235', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2a2f4a', gap: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { fontSize: 14, color: '#8b91b0' },
  breakdownVal: { fontSize: 14, color: '#8b91b0' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#2a2f4a', paddingTop: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#f0f2ff' },
  totalVal: { fontSize: 16, fontWeight: '800', color: '#f0f2ff' },
});

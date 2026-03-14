import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1d27',
          borderTopColor: '#2a2f4a',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#4f6ef7',
        tabBarInactiveTintColor: '#5a607a',
        headerStyle: { backgroundColor: '#1a1d27' },
        headerTintColor: '#f0f2ff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Explore', tabBarIcon: ({ color }) => <TabIcon emoji="🌍" color={color} /> }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: 'Events', tabBarIcon: ({ color }) => <TabIcon emoji="🎟️" color={color} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: 'Saved', tabBarIcon: ({ color }) => <TabIcon emoji="🔖" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: color === '#4f6ef7' ? 1 : 0.5 }}>{emoji}</Text>;
}

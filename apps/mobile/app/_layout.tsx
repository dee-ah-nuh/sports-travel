import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  useFonts as useJetBrainsFonts,
} from '@expo-google-fonts/jetbrains-mono';
import {
  Kanit_400Regular,
  Kanit_500Medium,
  Kanit_600SemiBold,
  Kanit_700Bold,
  useFonts as useKanitFonts,
} from '@expo-google-fonts/kanit';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [jetbrainsLoaded] = useJetBrainsFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });

  const [kanitLoaded] = useKanitFonts({
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_600SemiBold,
    Kanit_700Bold,
  });

  const fontsLoaded = jetbrainsLoaded && kanitLoaded;

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1d27' },
          headerTintColor: '#f0f2ff',
          headerTitleStyle: {
            fontFamily: 'Kanit_700Bold',
            fontSize: 18,
          },
          contentStyle: { backgroundColor: '#0f1117' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event/[id]"
          options={{ title: 'Event Details', presentation: 'modal' }}
        />
        <Stack.Screen
          name="itinerary/[eventId]"
          options={{ title: 'Itinerary', presentation: 'card' }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f1117' },
});

// Shared font constants — import FONTS in any screen for consistency
export const FONTS = {
  regular: 'JetBrainsMono_400Regular',
  medium: 'JetBrainsMono_500Medium',
  semibold: 'JetBrainsMono_600SemiBold',
  bold: 'JetBrainsMono_700Bold',
  displayRegular: 'Kanit_400Regular',
  displayMedium: 'Kanit_500Medium',
  displaySemibold: 'Kanit_600SemiBold',
  displayBold: 'Kanit_700Bold',
} as const;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';
import { GameProvider, useGame } from './src/context/GameContext';

import HomeScreen from './src/screens/HomeScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import RankScreen from './src/screens/RankScreen';
import BadgesScreen from './src/screens/BadgesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BottomNavBar from './src/components/BottomNavBar';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { isHydrated } = useGame();

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEmoji}>🌱</Text>
          <Text style={styles.loadingTitle}>EcoQuest</Text>
          <Text style={styles.loadingSubtitle}>Restoring campus world...</Text>
          <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
        </View>
      </View>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'quests':
        return <QuestsScreen />;
      case 'rank':
        return <RankScreen />;
      case 'badges':
        return <BadgesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor={colors.background} />
      <View style={styles.content}>{renderActiveScreen()}</View>
      <BottomNavBar activeTab={activeTab} onSelectTab={setActiveTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    minWidth: 220,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    fontWeight: '500',
  },
  loadingSpinner: {
    marginTop: 4,
  },
});



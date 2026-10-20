import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const TABS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'quests', label: 'Quests', icon: '🎯' },
  { id: 'rank', label: 'Rank', icon: '🏆' },
  { id: 'badges', label: 'Badges', icon: '🎖️' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomNavBar({ activeTab, onSelectTab }) {
  const insets = useSafeAreaInsets();
  // Ensure the bottom tab bar clears Android 3-button navigation (48dp),
  // gesture navigation pills, and system controls, with comfortable tap clearance.
  const safeBottomPadding = Math.max(
    insets.bottom + 6,
    Platform.OS === 'android' ? 38 : 20
  );

  return (
    <View style={[styles.container, { paddingBottom: safeBottomPadding }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${tab.label} tab`}
            >
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              <View style={styles.indicatorSlot}>
                {isActive && <View style={styles.activePillIndicator} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 14,
    minHeight: 52,
  },
  activeTabButton: {
    backgroundColor: colors.primarySubtle,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  activeTabIcon: {
    transform: [{ scale: 1.12 }],
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155', // High-contrast Slate 700: crisp, dark, and clearly legible
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    color: colors.primaryDark, // Deep Forest Green (#064E3B)
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  indicatorSlot: {
    height: 4,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePillIndicator: {
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';

export default function DailyDropCard() {
  const {
    dailyStreak = 1,
    canClaimDailyDrop,
    claimDailyDrop,
    advanceDailyQuests,
    dailyQuestsDayOffset = 0,
  } = useGame();

  const [claimFeedback, setClaimFeedback] = useState(null);

  const handleClaim = () => {
    if (!claimDailyDrop) return;
    const res = claimDailyDrop();
    if (res?.success) {
      setClaimFeedback({
        type: 'success',
        title: '🌱 Eco-Drop Claimed! +25 Pts',
        message: res.message,
        tip: res.tip,
      });
    } else {
      setClaimFeedback({
        type: 'info',
        title: 'Already Claimed Today',
        message: "You've already claimed today's mystery drop! Come back tomorrow or advance day to test.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.streakBadge}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>Day {dailyStreak} Streak</Text>
        </View>
        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierText}>
            {dailyStreak >= 7 ? '1.5x Boost 🚀' : dailyStreak >= 3 ? '1.2x Boost ⚡' : '1.0x Normal'}
          </Text>
        </View>
      </View>

      <View style={styles.bodyRow}>
        <View style={styles.seedIconBox}>
          <Text style={styles.seedEmoji}>{canClaimDailyDrop ? '🎁' : '🌱'}</Text>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.title}>
            {canClaimDailyDrop ? "Today's Mystery Eco-Drop" : 'Daily Eco-Habit Active'}
          </Text>
          <Text style={styles.subtitle}>
            {canClaimDailyDrop
              ? 'Tap to open your daily sustainable seed bonus (+25 spendable pts)!'
              : `Day ${dailyQuestsDayOffset + 1} bonus claimed. Habit streak burning bright!`}
          </Text>
        </View>
      </View>

      {canClaimDailyDrop ? (
        <TouchableOpacity
          style={styles.claimButton}
          onPress={handleClaim}
          activeOpacity={0.85}
        >
          <Text style={styles.claimButtonText}>🎁 Claim Daily Drop (+25 PTS)</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.claimedRow}>
          <View style={styles.claimedPill}>
            <Text style={styles.claimedPillText}>✅ Claimed for Today</Text>
          </View>
          <TouchableOpacity
            style={styles.advancePill}
            onPress={() => {
              if (advanceDailyQuests) advanceDailyQuests();
              setClaimFeedback(null);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.advancePillText}>⏩ Simulate Next Day</Text>
          </TouchableOpacity>
        </View>
      )}

      {claimFeedback && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackTitle}>{claimFeedback.title}</Text>
          <Text style={styles.feedbackMsg}>{claimFeedback.message}</Text>
          {claimFeedback.tip && (
            <View style={styles.tipBox}>
              <Text style={styles.tipLabel}>💡 Eco Fact:</Text>
              <Text style={styles.tipContent}>{claimFeedback.tip}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  multiplierBadge: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  seedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  seedEmoji: {
    fontSize: 26,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  claimButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  claimedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  claimedPill: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  claimedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  advancePill: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  advancePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  feedbackBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 2,
  },
  feedbackMsg: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  tipBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  tipContent: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 15,
  },
});

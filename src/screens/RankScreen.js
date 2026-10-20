import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useGame } from '../context/GameContext';

export default function RankScreen() {
  const { leaderboard, userRank, top3Podium, lifetimePoints } = useGame();

  const first = top3Podium && top3Podium[0] ? top3Podium[0] : { name: 'Maya S.', pts: 340, rank: 1 };
  const second = top3Podium && top3Podium[1] ? top3Podium[1] : { name: 'Aarav P.', pts: 290, rank: 2 };
  const third = top3Podium && top3Podium[2] ? top3Podium[2] : { name: 'Priya N.', pts: 210, rank: 3 };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Campus Leaderboard 🏆</Text>
        <Text style={styles.screenSubtitle}>
          College sustainability standings updated based on verified Eco Points.
        </Text>
      </View>

      {/* Demonstrator Current Rank Callout */}
      <View style={styles.userRankCard}>
        <View style={styles.userRankRow}>
          <View style={[styles.rankBadge, userRank <= 3 && styles.rankBadgePodium]}>
            <Text style={[styles.rankBadgeNumber, userRank <= 3 && styles.rankBadgeNumberPodium]}>
              #{userRank}
            </Text>
          </View>
          <View style={styles.userRankInfo}>
            <Text style={styles.userRankName}>Eco-Guardians (You)</Text>
            <Text style={styles.userRankSub}>
              {userRank <= 3
                ? '🏆 Top 3 Campus Eco Champion!'
                : userRank === 4
                ? '⭐ Rank #4 • Emerging Contender'
                : 'Current campus standing'}
            </Text>
          </View>
          <View style={styles.userPointsPill}>
            <Text style={styles.userPointsValue}>{lifetimePoints} PTS</Text>
          </View>
        </View>
        <Text style={styles.userRankNote}>
          {userRank === 8
            ? '⚡ Initial baseline standing (#8). Complete quests in the Quests tab to climb above campus peers in real time!'
            : userRank <= 3
            ? '🎉 Congratulations! You have climbed onto the official campus podium as a Top 3 Eco Champion!'
            : `⚡ Dynamic rank updated to #${userRank} based on ${lifetimePoints} verified lifetime Eco Points!`}
        </Text>
      </View>

      {/* Top 3 Podium Visual (Synchronized dynamically with leaderboard) */}
      <Text style={styles.sectionHeader}>Top Eco Champions</Text>
      <View style={styles.podiumContainer}>
        {/* Silver - 2nd */}
        <View style={[styles.podiumColumn, styles.podiumCol2]}>
          <Text style={styles.podiumMedal}>🥈</Text>
          <Text
            style={[styles.podiumName, second.isUser && styles.userTextBold]}
            numberOfLines={1}
          >
            {second.name}
          </Text>
          <Text style={styles.podiumPoints}>{second.pts} pts</Text>
          <View
            style={[
              styles.podiumBlock,
              second.isUser && styles.podiumBlockUser,
              { height: 70 },
            ]}
          >
            <Text style={styles.podiumRankNum}>2</Text>
          </View>
        </View>

        {/* Gold - 1st */}
        <View style={[styles.podiumColumn, styles.podiumCol1]}>
          <Text style={styles.podiumMedal}>🥇</Text>
          <Text
            style={[styles.podiumName, first.isUser && styles.userTextBold]}
            numberOfLines={1}
          >
            {first.name}
          </Text>
          <Text style={styles.podiumPoints}>{first.pts} pts</Text>
          <View
            style={[
              styles.podiumBlock,
              styles.podiumGold,
              first.isUser && styles.podiumBlockUser,
              { height: 95 },
            ]}
          >
            <Text style={styles.podiumRankNum}>1</Text>
          </View>
        </View>

        {/* Bronze - 3rd */}
        <View style={[styles.podiumColumn, styles.podiumCol3]}>
          <Text style={styles.podiumMedal}>🥉</Text>
          <Text
            style={[styles.podiumName, third.isUser && styles.userTextBold]}
            numberOfLines={1}
          >
            {third.name}
          </Text>
          <Text style={styles.podiumPoints}>{third.pts} pts</Text>
          <View
            style={[
              styles.podiumBlock,
              third.isUser && styles.podiumBlockUser,
              { height: 50 },
            ]}
          >
            <Text style={styles.podiumRankNum}>3</Text>
          </View>
        </View>
      </View>

      {/* Educational Demonstration Disclaimer Banner */}
      <View style={styles.demoBanner}>
        <Text style={styles.demoBannerIcon}>ℹ️</Text>
        <Text style={styles.demoBannerText}>
          Simulated college leaderboard for demonstration purposes. Peer scores are benchmark data points.
        </Text>
      </View>

      {/* Full Leaderboard List */}
      <Text style={styles.sectionHeader}>Full Campus Standings (All Participants)</Text>
      <View style={styles.listCard}>
        {leaderboard &&
          leaderboard.map((item, index) => (
            <View
              key={item.id || item.name}
              style={[
                styles.listRow,
                item.isUser && styles.userHighlightRow,
                index !== leaderboard.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.rankCell}>
                <Text
                  style={[
                    styles.rankNumber,
                    item.isUser && styles.userTextBold,
                  ]}
                >
                  {item.medal || `#${item.rank}`}
                </Text>
              </View>

              <View style={styles.nameCell}>
                <Text
                  style={[
                    styles.studentName,
                    item.isUser && styles.userTextBold,
                  ]}
                >
                  {item.name}
                </Text>
                <Text style={styles.departmentName}>{item.dept}</Text>
              </View>

              <View style={styles.scoreCell}>
                <Text
                  style={[
                    styles.scoreText,
                    item.isUser && styles.userTextBold,
                  ]}
                >
                  {item.pts} pts
                </Text>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  userRankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  userRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgePodium: {
    backgroundColor: colors.goldLight,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  rankBadgeNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  rankBadgeNumberPodium: {
    color: '#B45309',
  },
  userRankInfo: {
    flex: 1,
  },
  userRankName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  userRankSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  userPointsPill: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userPointsValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  userRankNote: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 15,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumCol1: {
    marginHorizontal: 4,
  },
  podiumCol2: {},
  podiumCol3: {},
  podiumMedal: {
    fontSize: 22,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 6,
  },
  podiumBlock: {
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBlockUser: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  podiumGold: {
    backgroundColor: colors.goldLight,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  podiumRankNum: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    padding: 8,
    marginBottom: 14,
  },
  demoBannerIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  demoBannerText: {
    fontSize: 10,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 14,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  userHighlightRow: {
    backgroundColor: '#ECFDF5',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rankCell: {
    width: 32,
    alignItems: 'flex-start',
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  nameCell: {
    flex: 1,
    paddingHorizontal: 6,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  departmentName: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  scoreCell: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  userTextBold: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
});

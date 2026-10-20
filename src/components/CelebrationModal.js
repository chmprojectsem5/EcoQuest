import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CelebrationModal({
  visible,
  onClose,
  upgrade,
  district,
  stage = 1,
  onViewInMap,
}) {
  if (!visible || !upgrade) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          {/* Confetti Ribbon Header */}
          <View style={styles.ribbonRow}>
            <Text style={styles.sparkleEmoji}>✨</Text>
            <Text style={styles.sparkleEmoji}>🎉</Text>
            <Text style={styles.sparkleEmoji}>🌱</Text>
            <Text style={styles.sparkleEmoji}>🏆</Text>
            <Text style={styles.sparkleEmoji}>✨</Text>
          </View>

          <View style={styles.badgeContainer}>
            <View style={[styles.phasePill, { backgroundColor: district?.color ? `${district.color}20` : '#D1FAE5' }]}>
              <Text style={[styles.phasePillText, { color: district?.color || colors.primaryDark }]}>
                {district ? `PHASE ${district.phase}: ${district.shortName.toUpperCase()}` : 'CAMPUS RESTORATION'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Project Constructed! 🚀</Text>
          <Text style={styles.projectName}>{upgrade.title}</Text>

          <View style={styles.iconCircle}>
            <Text style={styles.projectIcon}>{upgrade.icon || '🏛️'}</Text>
          </View>

          <Text style={styles.description}>
            {upgrade.desc || upgrade.description || 'Campus sector successfully updated with advanced ecological infrastructure.'}
          </Text>

          <View style={styles.benefitCard}>
            <Text style={styles.benefitLabel}>🌱 Environmental Benefit Unlocked:</Text>
            <Text style={styles.benefitValue}>{upgrade.benefit || 'Renewable energy & biodiversity restored'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Investment</Text>
              <Text style={styles.statValue}>-{upgrade.cost} pts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Restoration Level</Text>
              <Text style={styles.statValue}>Stage {stage} / 4</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            {onViewInMap && (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  onClose();
                  onViewInMap();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryBtnText}>🗺️ View in Map</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: district?.color || colors.primary }]}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Continue Mission 🌿</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 78, 59, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: Math.min(SCREEN_WIDTH - 32, 380),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sparkleEmoji: {
    fontSize: 22,
  },
  badgeContainer: {
    marginBottom: 6,
  },
  phasePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  phasePillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#064E3B',
    textAlign: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#34D399',
  },
  projectIcon: {
    fontSize: 32,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  benefitCard: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 14,
  },
  benefitLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
    marginBottom: 2,
  },
  benefitValue: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  primaryBtn: {
    flex: 1.3,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

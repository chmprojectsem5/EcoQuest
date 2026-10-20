import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

/**
 * SolarElectricitySystem Component
 * 
 * An interactive, visual Solar Microgrid Command Center that showcases
 * the physical campus solar power system installed in Stage 2.
 * Includes live wattage telemetry, battery charge metrics, power flow,
 * and technical inverter diagnostics.
 * 
 * @param {number} restorationStage - Current campus restoration stage (0 to 4)
 */
export default function SolarElectricitySystem({ restorationStage = 0 }) {
  const isSolarActive = restorationStage >= 2;
  const [activeTab, setActiveTab] = useState('flow'); // 'flow' | 'inverter' | 'chart'
  const [currentKw, setCurrentKw] = useState(24.6);

  // Subtle live wattage fluctuation simulation when solar is active
  useEffect(() => {
    if (!isSolarActive) return;
    const interval = setInterval(() => {
      // Fluctuate gently between 23.8 kW and 25.4 kW
      const delta = (Math.random() - 0.5) * 0.4;
      setCurrentKw((prev) => +(Math.max(22.0, Math.min(26.0, prev + delta))).toFixed(1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isSolarActive]);

  if (!isSolarActive) {
    return (
      <View style={styles.inactiveContainer}>
        <View style={styles.inactiveHeader}>
          <View style={styles.inactiveIconWrap}>
            <Text style={styles.inactiveIcon}>☀️</Text>
          </View>
          <View style={styles.inactiveTextGroup}>
            <Text style={styles.inactiveTitle}>Campus Solar Microgrid</Text>
            <Text style={styles.inactiveSubtitle}>Stage 2 Upgrade Required</Text>
          </View>
          <View style={styles.statusBadgeDormant}>
            <Text style={styles.statusBadgeTextDormant}>🔒 Standby</Text>
          </View>
        </View>

        <Text style={styles.inactiveDesc}>
          Science & Academic Hall roof is pre-wired for a 24kW photovoltaic solar array. Complete quests to accumulate 200 spendable points and activate clean solar electricity!
        </Text>

        <View style={styles.specsRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Planned Capacity</Text>
            <Text style={styles.specValue}>24.0 kW Peak</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Daily Clean Yield</Text>
            <Text style={styles.specValue}>~115 kWh/day</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>CO₂ Reduction</Text>
            <Text style={styles.specValue}>85+ kg/day</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Header with Active Status */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.activeIconWrap}>
            <Text style={styles.activeIcon}>⚡</Text>
          </View>
          <View>
            <Text style={styles.title}>Campus Solar Microgrid</Text>
            <Text style={styles.subtitle}>Science & Academic Hall Rooftop Array</Text>
          </View>
        </View>
        <View style={styles.statusBadgeActive}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusBadgeTextActive}>GENERATING</Text>
        </View>
      </View>

      {/* 2. Key Solar Metric Cards */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.metricCardPrimary]}>
          <Text style={styles.metricLabel}>LIVE OUTPUT</Text>
          <Text style={styles.metricValueLarge}>{currentKw} <Text style={styles.metricUnit}>kW</Text></Text>
          <Text style={styles.metricSub}>☀️ 98% Efficiency</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>TODAY'S YIELD</Text>
          <Text style={styles.metricValueMedium}>118.4 <Text style={styles.metricUnit}>kWh</Text></Text>
          <Text style={styles.metricSub}>🌿 86.5 kg CO₂ offset</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>BATTERY BANK</Text>
          <Text style={styles.metricValueMedium}>88% <Text style={styles.metricUnit}>Charged</Text></Text>
          <Text style={styles.metricSub}>🔋 48V / 100 kWh BESS</Text>
        </View>
      </View>

      {/* 3. Interactive Mode Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'flow' && styles.tabButtonActive]}
          onPress={() => setActiveTab('flow')}
        >
          <Text style={[styles.tabText, activeTab === 'flow' && styles.tabTextActive]}>⚡ Power Flow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'inverter' && styles.tabButtonActive]}
          onPress={() => setActiveTab('inverter')}
        >
          <Text style={[styles.tabText, activeTab === 'inverter' && styles.tabTextActive]}>📟 Inverter Telemetry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chart' && styles.tabButtonActive]}
          onPress={() => setActiveTab('chart')}
        >
          <Text style={[styles.tabText, activeTab === 'chart' && styles.tabTextActive]}>📊 24h Yield Curve</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Tab Content Body */}
      {activeTab === 'flow' && (
        <View style={styles.flowCard}>
          <Text style={styles.flowCardTitle}>Real-Time Campus Power Distribution</Text>

          <View style={styles.flowRow}>
            <View style={styles.flowNodeSource}>
              <Text style={styles.nodeIcon}>☀️</Text>
              <Text style={styles.nodeTitle}>Rooftop PV</Text>
              <Text style={styles.nodeKw}>{currentKw} kW</Text>
            </View>

            <Text style={styles.flowArrow}>➔</Text>

            <View style={styles.flowNodeInverter}>
              <Text style={styles.nodeIcon}>⚡</Text>
              <Text style={styles.nodeTitle}>Hybrid MPPT</Text>
              <Text style={styles.nodeKw}>580V DC</Text>
            </View>

            <Text style={styles.flowArrow}>➔</Text>

            <View style={styles.flowLoadsCol}>
              <View style={styles.loadItem}>
                <Text style={styles.loadLabel}>🏛️ Labs & PCs</Text>
                <Text style={styles.loadKw}>12.4 kW</Text>
              </View>
              <View style={styles.loadItem}>
                <Text style={styles.loadLabel}>💡 LED & Quad</Text>
                <Text style={styles.loadKw}>6.2 kW</Text>
              </View>
              <View style={styles.loadItem}>
                <Text style={styles.loadLabel}>🔋 Storage Bank</Text>
                <Text style={styles.loadKw}>6.0 kW</Text>
              </View>
            </View>
          </View>

          {/* Battery Charge Bar */}
          <View style={styles.batteryContainer}>
            <View style={styles.batteryLabelRow}>
              <Text style={styles.batteryLabel}>LiFePO4 Campus Battery Reserve</Text>
              <Text style={styles.batteryPercent}>88% / 100 kWh</Text>
            </View>
            <View style={styles.batteryTrack}>
              <View style={[styles.batteryFill, { width: '88%' }]} />
            </View>
          </View>
        </View>
      )}

      {activeTab === 'inverter' && (
        <View style={styles.inverterCard}>
          <Text style={styles.flowCardTitle}>Smart Inverter Diagnostic Telemetry</Text>
          <View style={styles.inverterGrid}>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>DC Voltage (String 1)</Text>
              <Text style={styles.invValue}>582.4 V</Text>
            </View>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>DC Current</Text>
              <Text style={styles.invValue}>42.6 A</Text>
            </View>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>AC Frequency</Text>
              <Text style={styles.invValue}>50.02 Hz</Text>
            </View>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>Inverter Temp</Text>
              <Text style={styles.invValue}>34.8 °C (Cool)</Text>
            </View>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>Power Factor</Text>
              <Text style={styles.invValue}>0.99 (Optimal)</Text>
            </View>
            <View style={styles.invItem}>
              <Text style={styles.invLabel}>Grid Mode</Text>
              <Text style={styles.invValue}>Self-Consumption</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'chart' && (
        <View style={styles.chartCard}>
          <Text style={styles.flowCardTitle}>Today's Hourly Solar Irradiance (kW)</Text>
          <View style={styles.barsContainer}>
            {[
              { time: '8 AM', val: 6 },
              { time: '10 AM', val: 16 },
              { time: '12 PM', val: 25 },
              { time: '2 PM', val: 24 },
              { time: '4 PM', val: 14 },
              { time: '6 PM', val: 4 },
            ].map((bar, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={styles.barVal}>{bar.val}k</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${(bar.val / 26) * 100}%` }]} />
                </View>
                <Text style={styles.barTime}>{bar.time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 5. Ecological Impact Footer */}
      <View style={styles.impactFooter}>
        <Text style={styles.impactIcon}>🌳</Text>
        <Text style={styles.impactText}>
          Clean solar power generated today has saved <Text style={styles.impactBold}>86.5 kg of coal combustion</Text>, equivalent to the carbon absorption of <Text style={styles.impactBold}>4.2 mature trees</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadgeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  statusBadgeTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricCardPrimary: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  metricValueLarge: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0284C7',
  },
  metricValueMedium: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  metricSub: {
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  flowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flowCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flowNodeSource: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    minWidth: 70,
  },
  flowNodeInverter: {
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    minWidth: 75,
  },
  nodeIcon: {
    fontSize: 18,
  },
  nodeTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  nodeKw: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  flowArrow: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
  },
  flowLoadsCol: {
    gap: 4,
    minWidth: 95,
  },
  loadItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#475569',
  },
  loadKw: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    marginLeft: 4,
  },
  batteryContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  batteryLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  batteryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  batteryPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  batteryTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
  inverterCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inverterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  invItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  invLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  invValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 85,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 50,
    backgroundColor: '#E2E8F0',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 7,
  },
  barTime: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 4,
  },
  impactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  impactIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  impactText: {
    fontSize: 11,
    color: '#166534',
    flex: 1,
    lineHeight: 16,
  },
  impactBold: {
    fontWeight: '700',
  },

  // Inactive Mode Styles
  inactiveContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  inactiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inactiveIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inactiveIcon: {
    fontSize: 20,
  },
  inactiveTextGroup: {
    flex: 1,
  },
  inactiveTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  inactiveSubtitle: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
  },
  statusBadgeDormant: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeTextDormant: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  inactiveDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import CampusViewerModal, { CAMPUS_PINS } from './CampusViewerModal';
import {
  DISTRICTS,
  getDistrict,
  getDistrictUpgrades,
  getNextDistrictUpgrade,
  DEFAULT_DISTRICT_ID,
} from '../data/gameData';
import { useGame } from '../context/GameContext';

export { CAMPUS_PINS };

// High-fidelity district artworks map
const DISTRICT_IMAGES = {
  academic: {
    0: require('../../assets/campus/stage_0_dormant.jpg'),
    1: require('../../assets/campus/stage_1_cleaned.jpg'),
    2: require('../../assets/campus/stage_2_solar.jpg'),
    3: require('../../assets/campus/stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/stage_4_sanctuary.jpg'),
  },
  society: {
    0: require('../../assets/campus/society_stage_0_dormant.jpg'),
    1: require('../../assets/campus/society_stage_1_cleaned.jpg'),
    2: require('../../assets/campus/society_stage_2_solar.jpg'),
    3: require('../../assets/campus/society_stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/society_stage_4_sanctuary.jpg'),
    default: require('../../assets/campus/district_society.jpg'),
  },
  garden: {
    0: require('../../assets/campus/garden_stage_0_dormant.jpg'),
    1: require('../../assets/campus/garden_stage_1_cleaned.jpg'),
    2: require('../../assets/campus/garden_stage_2_solar.jpg'),
    3: require('../../assets/campus/garden_stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/garden_stage_4_sanctuary.jpg'),
    default: require('../../assets/campus/district_garden.jpg'),
  },
  mall: {
    0: require('../../assets/campus/mall_stage_0_dormant.jpg'),
    1: require('../../assets/campus/mall_stage_1_cleaned.jpg'),
    2: require('../../assets/campus/mall_stage_2_solar.jpg'),
    3: require('../../assets/campus/mall_stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/mall_stage_4_sanctuary.jpg'),
    default: require('../../assets/campus/district_mall.jpg'),
  },
  lake: {
    0: require('../../assets/campus/lake_stage_0_dormant.jpg'),
    1: require('../../assets/campus/lake_stage_1_cleaned.jpg'),
    2: require('../../assets/campus/lake_stage_2_solar.jpg'),
    3: require('../../assets/campus/lake_stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/lake_stage_4_sanctuary.jpg'),
    default: require('../../assets/campus/district_lake.jpg'),
  },
};

function getDistrictImage(districtId = 'academic', stage = 0) {
  const images = DISTRICT_IMAGES[districtId] || DISTRICT_IMAGES.academic;
  const numStage = typeof stage === 'number' ? Math.max(0, Math.min(4, Math.floor(stage))) : 0;
  if (images[numStage]) return images[numStage];
  if (images.default) return images.default;
  return DISTRICT_IMAGES.academic[numStage] || DISTRICT_IMAGES.academic[0];
}

export default function CampusScene({ restorationStage: propRestorationStage = 0 }) {
  // Safely hook into GameContext if available, otherwise maintain standalone fallback
  let game = null;
  try {
    game = useGame();
  } catch (e) {
    game = null;
  }

  const contextActiveDistrictId = game?.activeDistrictId || DEFAULT_DISTRICT_ID;
  const contextDistrictStages = game?.districtStages || {
    academic: propRestorationStage,
    society: 0,
    garden: 0,
    mall: 0,
    lake: 0,
  };

  // Local active district state (synchronized with context if provided)
  const [selectedDistrictId, setSelectedDistrictId] = useState(contextActiveDistrictId);

  // Sync with context if context active district changes
  useEffect(() => {
    if (game?.activeDistrictId && game.activeDistrictId !== selectedDistrictId) {
      setSelectedDistrictId(game.activeDistrictId);
      setPreviewStage(null);
    }
  }, [game?.activeDistrictId]);

  const currentDistrict = getDistrict(selectedDistrictId);

  // Calculate base restoration stage for this district
  const baseDistrictStage =
    currentDistrict.id === 'academic'
      ? (game ? game.restorationStage : propRestorationStage)
      : (contextDistrictStages[currentDistrict.id] ?? 0);

  // Reset preview stage when district base stage changes (e.g. after purchasing an upgrade)
  useEffect(() => {
    setPreviewStage(null);
  }, [baseDistrictStage]);

  // Stage preview state allows users/testers to preview any stage (0-4) interactively
  const [previewStage, setPreviewStage] = useState(null);
  const activeStage = previewStage !== null ? previewStage : Math.max(0, Math.min(4, Math.floor(baseDistrictStage)));

  // Reset preview stage when switching districts so we see the district's actual stage
  const handleSelectDistrict = (districtId) => {
    setSelectedDistrictId(districtId);
    setPreviewStage(null);
    if (game?.setActiveDistrictId) {
      game.setActiveDistrictId(districtId);
    }
  };

  const currentMetadata = currentDistrict.stages[activeStage] || currentDistrict.stages[0];
  const districtImage = getDistrictImage(currentDistrict.id, activeStage);

  // Hotspot zone state
  const districtHotspots = currentDistrict.hotspots || [];
  const [selectedHotspotId, setSelectedHotspotId] = useState(districtHotspots[0]?.id || 'hall');

  // Keep hotspot valid when district changes
  useEffect(() => {
    if (districtHotspots.length > 0 && !districtHotspots.find((h) => h.id === selectedHotspotId)) {
      setSelectedHotspotId(districtHotspots[0].id);
    }
  }, [selectedDistrictId]);

  const activeHotspot =
    districtHotspots.find((z) => z.id === selectedHotspotId) || districtHotspots[0] || {
      id: 'default',
      icon: '🌿',
      label: 'Eco Zone',
      minStage: 0,
      activeDesc: 'Active ecological zone.',
      lockedDesc: 'Locked zone.',
    };

  const isZoneUnlocked = activeStage >= activeHotspot.minStage;
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Next district for sequential world tour
  const currentPhaseIndex = DISTRICTS.findIndex((d) => d.id === currentDistrict.id);
  const nextDistrict = currentPhaseIndex >= 0 && currentPhaseIndex < DISTRICTS.length - 1
    ? DISTRICTS[currentPhaseIndex + 1]
    : null;

  return (
    <View style={styles.container}>
      {/* =====================================================================
          1. Multi-Phase Ecological District Selector Carousel
          ===================================================================== */}
      <View style={styles.selectorHeaderRow}>
        <View style={styles.selectorTitleGroup}>
          <Text style={styles.selectorMainIcon}>🌍</Text>
          <View>
            <Text style={styles.selectorTitle}>EcoQuest Multi-Phase World</Text>
            <Text style={styles.selectorSubtitle}>Select Phase / District to Explore & Build</Text>
          </View>
        </View>
        <View style={styles.activePhaseCounter}>
          <Text style={styles.activePhaseCounterText}>Phase {currentDistrict.phase} of 5</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.districtTabsScroll}
      >
        {DISTRICTS.map((district) => {
          const isSelected = district.id === currentDistrict.id;
          const distSavedStage =
            district.id === 'academic'
              ? (game ? game.restorationStage : propRestorationStage)
              : (contextDistrictStages[district.id] ?? 0);
          const isComplete = distSavedStage >= 4;

          return (
            <TouchableOpacity
              key={district.id}
              style={[
                styles.districtTabCard,
                isSelected && {
                  borderColor: district.color,
                  backgroundColor: district.color + '14',
                  transform: [{ scale: 1.02 }],
                },
              ]}
              onPress={() => handleSelectDistrict(district.id)}
              activeOpacity={0.8}
            >
              <View style={styles.districtTabTopRow}>
                <Text style={styles.districtTabPhaseTag}>PHASE {district.phase}</Text>
                {isComplete ? (
                  <View style={[styles.statusBadge, styles.statusComplete]}>
                    <Text style={styles.statusCompleteText}>✓ Complete</Text>
                  </View>
                ) : distSavedStage > 0 ? (
                  <View style={[styles.statusBadge, styles.statusActive]}>
                    <Text style={styles.statusActiveText}>Stage {distSavedStage}/4</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, styles.statusReady]}>
                    <Text style={styles.statusReadyText}>Stage 0</Text>
                  </View>
                )}
              </View>

              <View style={styles.districtTabMainRow}>
                <Text style={styles.districtTabEmoji}>{district.icon}</Text>
                <Text
                  style={[
                    styles.districtTabTitle,
                    isSelected && { color: district.color, fontWeight: '800' },
                  ]}
                  numberOfLines={1}
                >
                  {district.shortName}
                </Text>
              </View>

              {/* Progress mini indicator */}
              <View style={styles.districtMiniProgressBar}>
                <View
                  style={[
                    styles.districtMiniProgressFill,
                    {
                      width: `${Math.max(6, (distSavedStage / 4) * 100)}%`,
                      backgroundColor: district.color,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* =====================================================================
          2. Active District Header & Lore
          ===================================================================== */}
      <View style={styles.districtHeaderCard}>
        {/* District Identity Header: Full Width, No Text Squishing */}
        <View style={styles.headerMainTitleRow}>
          <Text style={styles.headerIcon}>{currentDistrict.icon}</Text>
          <View style={styles.headerTitleContainer}>
            <View style={styles.titleWithPhaseTag}>
              <Text style={styles.headerTitle} numberOfLines={1}>{currentDistrict.name}</Text>
              <View style={[styles.phaseIndicatorTag, { borderColor: currentDistrict.color, backgroundColor: currentDistrict.color + '18' }]}>
                <Text style={[styles.phaseIndicatorTagText, { color: currentDistrict.color }]}>Phase {currentDistrict.phase} of 5</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle} numberOfLines={1}>{currentDistrict.tagline}</Text>
          </View>
        </View>

        {/* Distinct Full-Width Stage Status Ribbon */}
        <View
          style={[
            styles.stageBadgeFullWidth,
            {
              backgroundColor: currentMetadata.color + '15',
              borderColor: currentMetadata.color,
            },
          ]}
        >
          <Text style={[styles.stageBadgeText, { color: currentMetadata.color }]}>
            {currentMetadata.badge}
          </Text>
        </View>

        {/* 3. Restoration Progress Meter */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>District Restoration Progress</Text>
            <Text style={[styles.progressPercentText, { color: currentMetadata.color }]}>
              {currentMetadata.percent}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.max(4, currentMetadata.percent)}%`,
                  backgroundColor: currentMetadata.color,
                },
              ]}
            />
          </View>
        </View>

        {/* 4. Interactive Stage Stepper / Preview Selector */}
        <View style={styles.stageStepperContainer}>
          <Text style={styles.stageStepperLabel}>Inspect / Test Stages (0–4):</Text>
          <View style={styles.stageChipsRow}>
            {[0, 1, 2, 3, 4].map((s) => {
              const isSelected = activeStage === s;
              const isSaved = baseDistrictStage === s;
              const stageLabels = ['0: Dormant', '1: Cleaned', '2: Solar', '3: Flourish', '4: Oasis'];

              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.stageChip,
                    isSelected && {
                      backgroundColor: currentDistrict.color,
                      borderColor: currentDistrict.color,
                    },
                    !isSelected && isSaved && styles.stageChipSaved,
                  ]}
                  onPress={() => setPreviewStage(s)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.stageChipText,
                      isSelected && styles.stageChipTextSelected,
                    ]}
                  >
                    {stageLabels[s]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* =====================================================================
          5. High-Definition Isometric Visual Artwork Frame (Tap to expand & zoom)
          ===================================================================== */}
      <TouchableOpacity
        style={styles.imageCard}
        activeOpacity={0.88}
        onPress={() => setIsViewerOpen(true)}
      >
        <Image
          source={districtImage}
          style={styles.campusImage}
          resizeMode="cover"
        />

        {/* Live Overlay Badge on Top of Image */}
        <View style={styles.imageOverlayBadge} pointerEvents="none">
          <Text style={styles.imageOverlayText}>
            {activeStage === 0 && '⚠️ Stage 0: Dormant & Polluted'}
            {activeStage === 1 && '🌱 Stage 1: Clean-Up & Foundation'}
            {activeStage === 2 && '⚡ Stage 2: Renewable Microgrid'}
            {activeStage === 3 && '🐝 Stage 3: Biodiversity & Ecology'}
            {activeStage === 4 && '✨ Stage 4: Net-Zero Autonomous Oasis'}
          </Text>
        </View>

        {/* Interactive Tap to Zoom Callout */}
        <View style={styles.expandCallout} pointerEvents="none">
          <Text style={styles.expandCalloutText}>🔍 Tap to Expand & Zoom Surroundings ↗</Text>
        </View>

        {/* Stage Indicator Pill */}
        <View style={styles.stageIndicatorPill} pointerEvents="none">
          <Text style={styles.stageIndicatorText}>Stage {activeStage} of 4</Text>
        </View>
      </TouchableOpacity>

      {/* Dedicated Tap to Expand Button */}
      <TouchableOpacity
        style={[styles.expandButton, { borderColor: currentDistrict.color }]}
        activeOpacity={0.8}
        onPress={() => setIsViewerOpen(true)}
      >
        <Text style={styles.expandButtonIcon}>🔍</Text>
        <Text style={[styles.expandButtonText, { color: currentDistrict.color }]}>
          Expand {currentDistrict.shortName} (Clash of Clans 360° Zoom & Pan)
        </Text>
        <Text style={[styles.expandButtonArrow, { color: currentDistrict.color }]}>↗</Text>
      </TouchableOpacity>

      {/* Interactive Fullscreen Zoom & Surroundings Viewer Modal */}
      <CampusViewerModal
        visible={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        imageSource={districtImage}
        stage={activeStage}
        metadata={currentMetadata}
        districtId={currentDistrict.id}
      />

      {/* =====================================================================
          6. Interactive District Hotspot Zones Inspection
          ===================================================================== */}
      <View style={styles.hotspotsSection}>
        <Text style={styles.hotspotsSectionTitle}>
          Inspect {currentDistrict.shortName} Restoration Zones:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotspotsScroll}>
          {districtHotspots.map((zone) => {
            const isUnlocked = activeStage >= zone.minStage;
            const isSelected = selectedHotspotId === zone.id;
            return (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.hotspotChip,
                  isSelected && {
                    backgroundColor: currentDistrict.color + '20',
                    borderColor: currentDistrict.color,
                  },
                  !isUnlocked && styles.hotspotChipLocked,
                ]}
                onPress={() => setSelectedHotspotId(zone.id)}
              >
                <Text style={styles.hotspotChipIcon}>{zone.icon}</Text>
                <Text
                  style={[
                    styles.hotspotChipLabel,
                    isSelected && { color: currentDistrict.color, fontWeight: '800' },
                  ]}
                >
                  {zone.label}
                </Text>
                {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Expanded Zone Detail Card */}
        <View style={[styles.zoneDetailCard, isZoneUnlocked ? styles.zoneUnlocked : styles.zoneLocked]}>
          <View style={styles.zoneDetailHeader}>
            <Text style={styles.zoneDetailIcon}>{activeHotspot.icon}</Text>
            <View style={styles.zoneDetailTitleWrap}>
              <Text style={styles.zoneDetailTitle}>{activeHotspot.label}</Text>
              <Text style={styles.zoneDetailStatus}>
                {isZoneUnlocked
                  ? '🟢 Active & Functional'
                  : `🔒 Locked (Unlocks in Stage ${activeHotspot.minStage})`}
              </Text>
            </View>
          </View>
          <Text style={styles.zoneDetailDesc}>
            {isZoneUnlocked ? activeHotspot.activeDesc : activeHotspot.lockedDesc}
          </Text>
        </View>
      </View>

      {/* =====================================================================
          7. Stage Visual Transformation Highlights & Narrative Lore
          ===================================================================== */}
      <View style={styles.highlightsCard}>
        <Text style={styles.highlightsTitle}>
          {currentDistrict.name} • Stage {activeStage} Highlights:
        </Text>
        <View style={styles.highlightsGrid}>
          {currentMetadata.highlights.map((item, idx) => (
            <View key={idx} style={styles.highlightBadge}>
              <Text style={styles.highlightCheck}>✓</Text>
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.loreText}>{currentMetadata.lore}</Text>
      </View>

      {/* =====================================================================
          8. Tour to Next Phase Banner
          ===================================================================== */}
      {nextDistrict && (
        <TouchableOpacity
          style={[styles.nextPhaseBanner, { borderColor: nextDistrict.color + '60' }]}
          onPress={() => handleSelectDistrict(nextDistrict.id)}
          activeOpacity={0.8}
        >
          <View style={styles.nextPhaseLeft}>
            <Text style={styles.nextPhaseSub}>READY FOR NEXT SECTOR?</Text>
            <Text style={styles.nextPhaseName}>
              {nextDistrict.icon} Phase {nextDistrict.phase}: {nextDistrict.name}
            </Text>
          </View>
          <Text style={[styles.nextPhaseArrow, { color: nextDistrict.color }]}>Explore →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  selectorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectorTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorMainIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  selectorSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  activePhaseCounter: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activePhaseCounterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  districtTabsScroll: {
    paddingVertical: 6,
    paddingBottom: 12,
    gap: 8,
  },
  districtTabCard: {
    width: 148,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  districtTabTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  districtTabPhaseTag: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusComplete: {
    backgroundColor: '#DCFCE7',
  },
  statusCompleteText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: '800',
  },
  statusActive: {
    backgroundColor: '#E0F2FE',
  },
  statusActiveText: {
    color: '#0284C7',
    fontSize: 9,
    fontWeight: '800',
  },
  statusReady: {
    backgroundColor: '#F1F5F9',
  },
  statusReadyText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
  },
  districtTabMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  districtTabEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  districtTabTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  districtMiniProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  districtMiniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  districtHeaderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerMainTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  titleWithPhaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  phaseIndicatorTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  phaseIndicatorTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  stageBadgeFullWidth: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stageBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  stageStepperContainer: {
    marginTop: 4,
  },
  stageStepperLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  stageChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  stageChip: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  stageChipSaved: {
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
  },
  stageChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569',
  },
  stageChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    height: 250,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  campusImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  expandCallout: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandCalloutText: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '800',
  },
  stageIndicatorPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  stageIndicatorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    borderWidth: 1.5,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  expandButtonIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  expandButtonArrow: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 6,
  },
  hotspotsSection: {
    marginTop: 14,
  },
  hotspotsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  hotspotsScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  hotspotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hotspotChipLocked: {
    opacity: 0.7,
  },
  hotspotChipIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  hotspotChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  lockIcon: {
    fontSize: 10,
    marginLeft: 4,
  },
  zoneDetailCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  zoneUnlocked: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  zoneLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  zoneDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  zoneDetailIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  zoneDetailTitleWrap: {
    flex: 1,
  },
  zoneDetailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  zoneDetailStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  zoneDetailDesc: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  highlightsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightCheck: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '900',
    marginRight: 4,
  },
  highlightText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  loreText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  nextPhaseBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  nextPhaseLeft: {
    flex: 1,
  },
  nextPhaseSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nextPhaseName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nextPhaseArrow: {
    fontSize: 12.5,
    fontWeight: '800',
    marginLeft: 8,
  },
});

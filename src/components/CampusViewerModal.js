 import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Map base dimensions (1.6x screen width for immersive 2D panning room, 4:3 aspect ratio)
const MAP_WIDTH = SCREEN_WIDTH * 1.6;
const MAP_HEIGHT = MAP_WIDTH * 0.75;
const MIN_SCALE = 0.85;
const MAX_SCALE = 3.2;
const DEFAULT_SCALE = 1.25;

import { getDistrictPins, DISTRICT_PINS } from '../data/districtPins';
import { getDistrict } from '../data/gameData';
import { useGame } from '../context/GameContext';

export const CAMPUS_PINS = DISTRICT_PINS.academic;

export default function CampusViewerModal({
  visible,
  onClose,
  imageSource,
  stage = 0,
  metadata,
  districtId = 'academic',
}) {
  const districtObj = getDistrict(districtId);
  const game = useGame();
  const collectedSparkIds = game?.collectedSparkIds || [];
  const collectMapSpark = game?.collectMapSpark;
  const [sparkFeedback, setSparkFeedback] = useState(null);

  // Animated values for Clash of Clans 2D canvas transform
  const scaleAnim = useRef(new Animated.Value(DEFAULT_SCALE)).current;
  const panAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Numerical refs for continuous touch-driven math
  const currentScale = useRef(DEFAULT_SCALE);
  const currentPan = useRef({ x: 0, y: 0 });
  const [displayZoom, setDisplayZoom] = useState(Math.round(DEFAULT_SCALE * 100));

  // Multi-touch pinch tracking
  const isPinching = useRef(false);
  const initialDistance = useRef(0);
  const initialScale = useRef(DEFAULT_SCALE);
  const startPanOffset = useRef({ x: 0, y: 0 });
  const lastTapRef = useRef(0);
  const gestureStartTime = useRef(0);

  // Filter modes: 'restored' (default, only restored areas appear), 'all' (blueprints preview), 'off' (hidden)
  const [pinMode, setPinMode] = useState('restored');
  const [selectedPin, setSelectedPin] = useState(null);

  // Active Collectible Sparks on this district map
  const districtSparks = [
    {
      id: `${districtId}-solar-1`,
      icon: '⚡',
      name: 'Solar Spark',
      topPercent: 28,
      leftPercent: 68,
      points: 10,
      lore: 'Harnessed surplus clean energy from photovoltaic cells!',
    },
    {
      id: `${districtId}-leaf-1`,
      icon: '🍃',
      name: 'Eco Bloom',
      topPercent: 54,
      leftPercent: 24,
      points: 10,
      lore: 'Harvested native botanical bloom for the urban canopy!',
    },
    {
      id: `${districtId}-clean-1`,
      icon: '🧹',
      name: 'Litter Patrol',
      topPercent: 78,
      leftPercent: 48,
      points: 10,
      lore: 'Removed scattered single-use plastic waste from walkways!',
    },
  ];

  const handleTapSpark = (spark) => {
    if (!collectMapSpark) return;
    const res = collectMapSpark(spark.id, spark.points);
    if (res?.success) {
      setSparkFeedback({
        title: `✨ +${spark.points} Eco Points!`,
        message: spark.lore,
      });
      setTimeout(() => setSparkFeedback(null), 3500);
    } else if (res?.reason === 'already_collected') {
      setSparkFeedback({
        title: 'Collected Today ✅',
        message: 'You have already gathered this ecological spot for today!',
      });
      setTimeout(() => setSparkFeedback(null), 2500);
    }
  };

  // Get active pins for the selected district
  const activeDistrictPins = getDistrictPins(districtId);

  // Filter pins based on restoration progress
  const restoredPins = activeDistrictPins.filter((pin) => {
    const isUnlocked = stage >= pin.minStage;
    const isNotExpired = pin.maxStage === undefined || stage <= pin.maxStage;
    return isUnlocked && isNotExpired;
  });

  const previewPins = activeDistrictPins.filter((pin) => {
    if (pin.maxStage !== undefined && stage > pin.maxStage) return false;
    return true;
  });

  const visiblePins =
    pinMode === 'restored'
      ? restoredPins
      : pinMode === 'all'
      ? previewPins
      : [];

  // Clamp pan based on current scale to keep the base on screen with elastic rubber-band padding
  const clampPan = (x, y, s) => {
    const scaledW = MAP_WIDTH * s;
    const scaledH = MAP_HEIGHT * s;
    const containerW = SCREEN_WIDTH;
    const containerH = SCREEN_HEIGHT * 0.75;

    const maxTravelX = Math.max(30, (scaledW - containerW) / 2 + 60);
    const maxTravelY = Math.max(40, (scaledH - containerH) / 2 + 70);

    return {
      x: Math.min(maxTravelX, Math.max(-maxTravelX, x)),
      y: Math.min(maxTravelY, Math.max(-maxTravelY, y)),
    };
  };

  const springToScale = (targetScale, newX = currentPan.current.x, newY = currentPan.current.y) => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale));
    currentScale.current = clampedScale;
    setDisplayZoom(Math.round(clampedScale * 100));

    const clampedPan = clampPan(newX, newY, clampedScale);
    currentPan.current = clampedPan;

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: clampedScale,
        friction: 7,
        tension: 45,
        useNativeDriver: false,
      }),
      Animated.spring(panAnim, {
        toValue: clampedPan,
        friction: 7,
        tension: 45,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const springToPan = (targetX, targetY, friction = 7, tension = 40) => {
    const clamped = clampPan(targetX, targetY, currentScale.current);
    currentPan.current = clamped;

    Animated.spring(panAnim, {
      toValue: clamped,
      friction,
      tension,
      useNativeDriver: false,
    }).start();
  };

  const getDistance = (touches) => {
    const [t1, t2] = touches;
    if (!t1 || !t2) return 0;
    const dx = t1.pageX - t2.pageX;
    const dy = t1.pageY - t2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Multi-touch always captured immediately for pinch-zoom
        return evt.nativeEvent.touches.length >= 2;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 2 fingers = pinch zoom!
        if (evt.nativeEvent.touches.length >= 2) return true;
        // 1 finger = pan if moved > 4px (allows tap on pins to pass through)
        return Math.hypot(gestureState.dx, gestureState.dy) > 4;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,

      onPanResponderGrant: (evt, gestureState) => {
        const { touches } = evt.nativeEvent;
        gestureStartTime.current = Date.now();
        startPanOffset.current = { ...currentPan.current };

        if (touches.length >= 2) {
          isPinching.current = true;
          initialDistance.current = getDistance(touches);
          initialScale.current = currentScale.current;
        } else {
          isPinching.current = false;
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const { touches } = evt.nativeEvent;

        if (touches.length >= 2) {
          // --- CLASH OF CLANS SMOOTH PINCH-TO-ZOOM ---
          const dist = getDistance(touches);
          if (!initialDistance.current || initialDistance.current === 0) {
            initialDistance.current = dist;
            initialScale.current = currentScale.current;
          } else if (dist > 0) {
            const ratio = dist / initialDistance.current;
            let newScale = initialScale.current * ratio;
            // Elastic damping at boundaries
            if (newScale < MIN_SCALE) {
              newScale = MIN_SCALE - (MIN_SCALE - newScale) * 0.3;
            } else if (newScale > MAX_SCALE) {
              newScale = MAX_SCALE + (newScale - MAX_SCALE) * 0.3;
            }
            currentScale.current = newScale;
            scaleAnim.setValue(newScale);
            setDisplayZoom(Math.round(newScale * 100));
          }
        } else if (touches.length === 1 && !isPinching.current) {
          // --- CLASH OF CLANS 360-DEGREE FREE 2D PAN ---
          const rawX = startPanOffset.current.x + gestureState.dx;
          const rawY = startPanOffset.current.y + gestureState.dy;
          const clamped = clampPan(rawX, rawY, currentScale.current);
          currentPan.current = clamped;
          panAnim.setValue(clamped);
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        const wasPinching = isPinching.current;
        isPinching.current = false;
        initialDistance.current = 0;

        // Check for double-tap if movement was minimal
        const dt = Date.now() - gestureStartTime.current;
        const distMoved = Math.hypot(gestureState.dx, gestureState.dy);
        if (!wasPinching && dt < 260 && distMoved < 8) {
          const now = Date.now();
          if (now - lastTapRef.current < 320) {
            // Double-tap zoom toggle (Clash of Clans tactical view)
            const nextScale = currentScale.current > 1.35 ? 1.0 : 2.2;
            springToScale(nextScale);
            lastTapRef.current = 0;
            return;
          }
          lastTapRef.current = now;
        }

        // If pinched outside bounds, bounce back smoothly
        if (currentScale.current < MIN_SCALE) {
          springToScale(MIN_SCALE);
          return;
        } else if (currentScale.current > MAX_SCALE) {
          springToScale(MAX_SCALE);
          return;
        }

        // Momentum inertia glide if swiped with flick velocity
        const { vx, vy } = gestureState;
        const speed = Math.hypot(vx, vy);
        if (speed > 0.25) {
          const momentumX = currentPan.current.x + vx * 140;
          const momentumY = currentPan.current.y + vy * 140;
          springToPan(momentumX, momentumY, 6.5, 35);
        } else {
          // Snap back if out of bounds
          const clamped = clampPan(currentPan.current.x, currentPan.current.y, currentScale.current);
          if (clamped.x !== currentPan.current.x || clamped.y !== currentPan.current.y) {
            springToPan(clamped.x, clamped.y, 8, 50);
          }
        }
      },
    })
  ).current;

  const cyclePinMode = () => {
    if (pinMode === 'restored') setPinMode('all');
    else if (pinMode === 'all') setPinMode('off');
    else setPinMode('restored');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* 1. Top Navigation Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleGroup}>
            <View style={styles.districtTagRow}>
              <Text style={styles.districtTagEmoji}>{districtObj?.icon || '🏫'}</Text>
              <Text style={[styles.districtTagName, { color: districtObj?.color || '#38BDF8' }]}>
                Phase {districtObj?.phase || 1}: {districtObj?.name || 'Academic Quad'}
              </Text>
            </View>
            <Text style={styles.stageTitle} numberOfLines={1}>
              {metadata ? metadata.title : `Campus Stage ${stage}`}
            </Text>
            <Text style={styles.stageSubtitle} numberOfLines={1}>
              {metadata ? metadata.badge : 'Interactive Zoom & Surroundings Explorer'}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Floating Zoom & Control Bar (HUD) */}
        <View style={styles.controlBar}>
          <View style={styles.zoomButtonsGroup}>
            <TouchableOpacity
              style={[styles.zoomBtn, currentScale.current <= MIN_SCALE && styles.zoomBtnDisabled]}
              onPress={() => springToScale(currentScale.current - 0.4)}
              disabled={currentScale.current <= MIN_SCALE}
            >
              <Text style={styles.zoomBtnText}>−</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.zoomPill}
              onPress={() => springToScale(currentScale.current >= 2.4 ? 1.0 : currentScale.current + 0.6)}
            >
              <Text style={styles.zoomPillText}>{displayZoom}%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoomBtn, currentScale.current >= MAX_SCALE && styles.zoomBtnDisabled]}
              onPress={() => springToScale(currentScale.current + 0.4)}
              disabled={currentScale.current >= MAX_SCALE}
            >
              <Text style={styles.zoomBtnText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => springToScale(1.0, 0, 0)}
            >
              <Text style={styles.resetBtnText}>↺ 1x</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Multi-State Pin Mode Toggle */}
          <TouchableOpacity
            style={[styles.pinsToggleBtn, pinMode !== 'off' && styles.pinsToggleActive]}
            onPress={cyclePinMode}
            activeOpacity={0.8}
          >
            <Text style={[styles.pinsToggleText, pinMode !== 'off' && styles.pinsToggleTextActive]}>
              {pinMode === 'restored' && `📍 Restored (${restoredPins.length})`}
              {pinMode === 'all' && `🌐 All (${previewPins.length})`}
              {pinMode === 'off' && '📍 Pins: OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Clash of Clans Immersive 2D Free-Pan & Pinch-to-Zoom Canvas */}
        <View style={styles.canvasContainer} {...panResponder.panHandlers}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                width: MAP_WIDTH,
                height: MAP_HEIGHT,
                transform: [
                  { translateX: panAnim.x },
                  { translateY: panAnim.y },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Image
              source={imageSource}
              style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
              resizeMode="contain"
            />

            {/* Interactive Hotspot Pins Overlay */}
            {visiblePins.map((pin) => {
              const isUnlocked = stage >= pin.minStage;
              const isSelected = selectedPin?.id === pin.id;

              const pinTop = (MAP_HEIGHT * pin.topPercent) / 100;
              const pinLeft = (MAP_WIDTH * pin.leftPercent) / 100;

              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.pinContainer,
                    { top: pinTop, left: pinLeft },
                    isSelected && styles.pinSelected,
                    !isUnlocked && styles.pinLocked,
                  ]}
                  onPress={() => setSelectedPin(pin)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.pinBubble,
                      isUnlocked
                        ? [styles.pinBubbleActive, { borderColor: pin.color || '#38BDF8' }]
                        : styles.pinBubbleMuted,
                      isSelected && {
                        borderColor: '#FFFFFF',
                        backgroundColor: pin.color ? pin.color + 'FA' : '#0284C7',
                        transform: [{ scale: 1.08 }],
                      },
                    ]}
                  >
                    <Text style={styles.pinIcon}>{pin.icon}</Text>
                    <Text style={styles.pinLabel} numberOfLines={1}>
                      {pin.shortLabel || pin.title.split(' ')[0]}
                    </Text>
                    {!isUnlocked && <Text style={styles.pinLockTiny}>🔒</Text>}
                  </View>
                  <View
                    style={[
                      styles.pinTail,
                      isUnlocked
                        ? [styles.pinTailActive, { borderTopColor: isSelected ? '#FFFFFF' : pin.color || '#38BDF8' }]
                        : styles.pinTailMuted,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}

            {/* Interactive Collectible Eco-Sparks Overlay */}
            {districtSparks.map((spark) => {
              const isCollected = collectedSparkIds.includes(spark.id);
              const sparkTop = (MAP_HEIGHT * spark.topPercent) / 100;
              const sparkLeft = (MAP_WIDTH * spark.leftPercent) / 100;

              return (
                <TouchableOpacity
                  key={spark.id}
                  style={[
                    styles.sparkContainer,
                    { top: sparkTop, left: sparkLeft },
                    isCollected && styles.sparkCollected,
                  ]}
                  onPress={() => handleTapSpark(spark)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.sparkBubble, isCollected && styles.sparkBubbleCollected]}>
                    <Text style={styles.sparkIcon}>{isCollected ? '✅' : spark.icon}</Text>
                    <Text style={styles.sparkLabel} numberOfLines={1}>
                      {isCollected ? 'Claimed' : '+10 pts'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Collectible Spark Feedback Toast */}
          {sparkFeedback && (
            <View style={styles.sparkToast}>
              <Text style={styles.sparkToastTitle}>{sparkFeedback.title}</Text>
              <Text style={styles.sparkToastMsg}>{sparkFeedback.message}</Text>
            </View>
          )}

          {/* Helper Zoom Tip at Bottom */}
          <View style={styles.hintOverlay} pointerEvents="none">
            <Text style={styles.hintText}>
              🏰 Drag in any direction to explore • Pinch to zoom • Tap pins & ✨ sparks for bonus points
            </Text>
          </View>
        </View>

        {/* 4. Enhanced Scrollable Hotspot Detail Drawer */}
        {selectedPin && (
          <View style={[styles.detailDrawer, { borderTopColor: selectedPin.color || '#38BDF8' }]}>
            {/* Drawer Pull Handle */}
            <View style={styles.drawerPullHandle} />

            {/* Fixed Header Section */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleRow}>
                <View
                  style={[
                    styles.drawerIconBadge,
                    {
                      backgroundColor: (selectedPin.color || '#38BDF8') + '22',
                      borderColor: selectedPin.color || '#38BDF8',
                    },
                  ]}
                >
                  <Text style={styles.drawerIcon}>{selectedPin.icon}</Text>
                </View>

                <View style={styles.drawerTitleWrap}>
                  <View style={styles.categoryPill}>
                    <Text style={[styles.categoryPillText, { color: selectedPin.color || '#38BDF8' }]}>
                      {selectedPin.category || 'CAMPUS RESTORATION'}
                    </Text>
                  </View>
                  <Text style={styles.drawerTitle} numberOfLines={1}>
                    {selectedPin.title}
                  </Text>
                  <View style={styles.drawerStatusRow}>
                    <View
                      style={[
                        styles.statusIndicatorDot,
                        {
                          backgroundColor:
                            stage >= selectedPin.minStage ? '#10B981' : '#F59E0B',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.drawerStatus,
                        {
                          color:
                            stage >= selectedPin.minStage ? '#34D399' : '#FBBF24',
                        },
                      ]}
                    >
                      {stage >= selectedPin.minStage
                        ? `Restored • Stage ${selectedPin.minStage}+`
                        : `Locked Blueprint • Unlocks Stage ${selectedPin.minStage}`}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.drawerClose}
                onPress={() => setSelectedPin(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.drawerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Enhanced Scrollable Content Body */}
            <ScrollView
              style={styles.drawerScroll}
              contentContainerStyle={styles.drawerScrollContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              {/* Tagline */}
              {selectedPin.tagline ? (
                <Text style={styles.drawerTagline}>{selectedPin.tagline}</Text>
              ) : null}

              {/* Before vs. After Transformation Card */}
              {selectedPin.beforeAfter && (
                <View style={styles.transformationCard}>
                  <View style={styles.transHeaderRow}>
                    <Text style={styles.transHeaderIcon}>🔄</Text>
                    <Text style={styles.transHeaderText}>RESTORATION TRANSFORMATION</Text>
                  </View>
                  <View style={styles.transRow}>
                    <Text style={styles.transDotRed}>🔴</Text>
                    <View style={styles.transTextWrap}>
                      <Text style={styles.transLabelRed}>Before Cleanup:</Text>
                      <Text style={styles.transText}>{selectedPin.beforeAfter.before}</Text>
                    </View>
                  </View>
                  <View style={styles.transDivider} />
                  <View style={styles.transRow}>
                    <Text style={styles.transDotGreen}>🟢</Text>
                    <View style={styles.transTextWrap}>
                      <Text style={styles.transLabelGreen}>Restored State:</Text>
                      <Text style={styles.transText}>{selectedPin.beforeAfter.after}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* In-Depth Ecological Lore / Overview */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>📖 Ecological Function & Overview</Text>
                <Text style={styles.drawerDesc}>
                  {stage >= selectedPin.minStage
                    ? selectedPin.activeDesc
                    : selectedPin.stage0Desc || selectedPin.lockedDesc}
                </Text>
              </View>

              {/* Key Environmental Metrics Grid (2x2) */}
              {selectedPin.metrics && selectedPin.metrics.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionHeading}>📊 Environmental Performance & Impact</Text>
                  <View style={styles.metricsGrid}>
                    {selectedPin.metrics.map((m, idx) => (
                      <View key={idx} style={styles.metricCard}>
                        <View style={styles.metricHeader}>
                          <Text style={styles.metricIcon}>{m.icon}</Text>
                          <Text
                            style={[
                              styles.metricValue,
                              { color: selectedPin.color || '#38BDF8' },
                            ]}
                          >
                            {m.val}
                          </Text>
                        </View>
                        <Text style={styles.metricLabel}>{m.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Engineering Specs & Biological Features */}
              {selectedPin.specs && selectedPin.specs.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionHeading}>🛠️ Eco-Engineering & Design Specs</Text>
                  <View style={styles.specsWrap}>
                    {selectedPin.specs.map((spec, idx) => (
                      <View key={idx} style={styles.specBadge}>
                        <Text style={styles.specCheck}>✓</Text>
                        <Text style={styles.specText}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Student Campus Action Tip Callout */}
              {selectedPin.actionTip && (
                <View style={styles.actionTipCard}>
                  <Text style={styles.actionTipIcon}>💡</Text>
                  <View style={styles.actionTipTextWrap}>
                    <Text style={styles.actionTipTitle}>Campus Student Eco-Tip:</Text>
                    <Text style={styles.actionTipBody}>{selectedPin.actionTip}</Text>
                  </View>
                </View>
              )}

              {/* Stage Milestone Banner */}
              <View
                style={[
                  styles.milestoneBanner,
                  stage >= selectedPin.minStage
                    ? styles.milestoneRestored
                    : styles.milestoneLocked,
                ]}
              >
                <Text style={styles.milestoneText}>
                  {stage >= selectedPin.minStage
                    ? `✨ Unlocked in Stage ${selectedPin.minStage} • Verified Campus Restoration`
                    : `🔒 Advance campus quests to unlock this feature in Stage ${selectedPin.minStage}!`}
                </Text>
              </View>

              {/* Bottom Spacer for smooth scrolling */}
              <View style={{ height: 32 }} />
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
    paddingTop: 44,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  titleGroup: {
    flex: 1,
  },
  districtTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  districtTagEmoji: {
    fontSize: 13,
    marginRight: 6,
  },
  districtTagName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stageTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '800',
  },
  stageSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  zoomButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnDisabled: {
    opacity: 0.35,
  },
  zoomBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  zoomPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#475569',
  },
  zoomPillText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  resetBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 4,
  },
  resetBtnText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  pinsToggleBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  pinsToggleActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  pinsToggleText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  pinsToggleTextActive: {
    color: '#FFFFFF',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#070A11',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -30 }],
  },
  pinSelected: {
    transform: [{ translateX: -20 }, { translateY: -36 }, { scale: 1.15 }],
    zIndex: 99,
  },
  pinLocked: {
    opacity: 0.65,
  },
  pinBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 5,
  },
  pinBubbleActive: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderColor: '#38BDF8',
  },
  pinBubbleMuted: {
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderColor: '#64748B',
  },
  pinIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  pinLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pinLockTiny: {
    fontSize: 9,
    marginLeft: 3,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
  pinTailActive: {
    borderTopColor: '#38BDF8',
  },
  pinTailMuted: {
    borderTopColor: '#64748B',
  },
  hintOverlay: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  hintText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  detailDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.48,
    backgroundColor: '#0D1322',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderTopColor: '#38BDF8',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 100,
  },
  drawerPullHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginRight: 10,
  },
  drawerIcon: {
    fontSize: 22,
  },
  drawerTitleWrap: {
    flex: 1,
  },
  categoryPill: {
    marginBottom: 2,
  },
  categoryPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  drawerTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  drawerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  drawerStatus: {
    fontSize: 11,
    fontWeight: '700',
  },
  drawerClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginLeft: 8,
  },
  drawerCloseText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  drawerScroll: {
    flexGrow: 0,
  },
  drawerScrollContent: {
    paddingTop: 6,
    paddingBottom: 16,
  },
  drawerTagline: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 16,
  },
  transformationCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  transHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  transHeaderIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  transHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  transRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  transDotRed: {
    fontSize: 10,
    marginRight: 6,
    marginTop: 2,
  },
  transDotGreen: {
    fontSize: 10,
    marginRight: 6,
    marginTop: 2,
  },
  transTextWrap: {
    flex: 1,
  },
  transLabelRed: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: 1,
  },
  transLabelGreen: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#34D399',
    marginBottom: 1,
  },
  transText: {
    fontSize: 11.5,
    color: '#E2E8F0',
    lineHeight: 16,
  },
  transDivider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 6,
  },
  sectionBlock: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  drawerDesc: {
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#162032',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  specsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  specCheck: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '900',
    marginRight: 4,
  },
  specText: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  actionTipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderLeftWidth: 3.5,
    borderLeftColor: '#F59E0B',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  actionTipIcon: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 1,
  },
  actionTipTextWrap: {
    flex: 1,
  },
  actionTipTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 2,
  },
  actionTipBody: {
    fontSize: 11.5,
    color: '#FEF08A',
    lineHeight: 16,
  },
  milestoneBanner: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  milestoneRestored: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  milestoneLocked: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  milestoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
  },
  sparkContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 25,
  },
  sparkCollected: {
    opacity: 0.65,
  },
  sparkBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#34D399',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  sparkBubbleCollected: {
    backgroundColor: 'rgba(51, 65, 85, 0.85)',
    borderColor: '#64748B',
  },
  sparkIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  sparkLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sparkToast: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#34D399',
    alignItems: 'center',
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sparkToastTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#34D399',
    marginBottom: 2,
  },
  sparkToastMsg: {
    fontSize: 11,
    color: '#F1F5F9',
  },
});

/**
 * EcoQuest — District Artwork Images Map
 * 
 * Static require mappings required by Metro bundler for React Native asset bundling.
 */

export const DISTRICT_IMAGES = {
  academic: {
    0: require('../../assets/campus/stage_0_dormant.jpg'),
    1: require('../../assets/campus/stage_1_cleaned.jpg'),
    2: require('../../assets/campus/stage_2_solar.jpg'),
    3: require('../../assets/campus/stage_3_biodiversity.jpg'),
    4: require('../../assets/campus/stage_4_sanctuary.jpg'),
  },
  society: {
    0: require('../../assets/campus/district_society.jpg'),
    1: require('../../assets/campus/district_society.jpg'),
    2: require('../../assets/campus/district_society.jpg'),
    3: require('../../assets/campus/district_society.jpg'),
    4: require('../../assets/campus/district_society.jpg'),
    default: require('../../assets/campus/district_society.jpg'),
  },
  garden: {
    0: require('../../assets/campus/district_garden.jpg'),
    1: require('../../assets/campus/district_garden.jpg'),
    2: require('../../assets/campus/district_garden.jpg'),
    3: require('../../assets/campus/district_garden.jpg'),
    4: require('../../assets/campus/district_garden.jpg'),
    default: require('../../assets/campus/district_garden.jpg'),
  },
  mall: {
    0: require('../../assets/campus/district_mall.jpg'),
    1: require('../../assets/campus/district_mall.jpg'),
    2: require('../../assets/campus/district_mall.jpg'),
    3: require('../../assets/campus/district_mall.jpg'),
    4: require('../../assets/campus/district_mall.jpg'),
    default: require('../../assets/campus/district_mall.jpg'),
  },
  lake: {
    0: require('../../assets/campus/district_lake.jpg'),
    1: require('../../assets/campus/district_lake.jpg'),
    2: require('../../assets/campus/district_lake.jpg'),
    3: require('../../assets/campus/district_lake.jpg'),
    4: require('../../assets/campus/district_lake.jpg'),
    default: require('../../assets/campus/district_lake.jpg'),
  },
};

export function getDistrictImage(districtId = 'academic', stage = 0) {
  const images = DISTRICT_IMAGES[districtId] || DISTRICT_IMAGES.academic;
  const numStage = typeof stage === 'number' ? Math.max(0, Math.min(4, Math.floor(stage))) : 0;
  if (images[numStage]) return images[numStage];
  if (images.default) return images.default;
  return DISTRICT_IMAGES.academic[numStage] || DISTRICT_IMAGES.academic[0];
}

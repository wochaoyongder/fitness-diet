// TDEE = BMR × 活动系数
import { ACTIVITY_LEVELS } from '../data/activityLevels.js'

export function getActivityFactor(activityId) {
  const level = ACTIVITY_LEVELS.find((l) => l.id === activityId)
  return level ? level.factor : 1.2
}

// TDEE = BMR × 活动系数
export function calcTDEE(bmr, activityId) {
  return Math.round(bmr * getActivityFactor(activityId))
}

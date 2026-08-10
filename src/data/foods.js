// 常见食物热量速查（每 100g）
// 数字基于 USDA FoodData Central / 中国食物成分表（杨月欣 2018）的通行数值
// 本环境无法在线核验，标注 unverified；仅供参考，实际以包装标示为准
//
// kcal: 每 100g 热量
// p/c/f: 蛋白/碳水/脂肪 每 100g 克数
// portion: 常见一份的克数参考
// portionName: 一份的叫法（如"一碗"）

export const FOOD_CATEGORIES = [
  { id: 'staple', label: '主食' },
  { id: 'meat', label: '肉禽鱼' },
  { id: 'egg_dairy', label: '蛋奶' },
  { id: 'soy', label: '豆制品' },
  { id: 'veg', label: '蔬菜' },
  { id: 'fruit', label: '水果' },
  { id: 'fat', label: '油脂坚果' },
  { id: 'drink', label: '饮料' },
]

export const FOODS = [
  // ===== 主食 =====
  { name: '白米饭', cat: 'staple', kcal: 116, p: 2.6, c: 25.9, f: 0.3, portion: 150, portionName: '一碗' },
  { name: '馒头', cat: 'staple', kcal: 223, p: 7.0, c: 47.0, f: 1.1, portion: 100, portionName: '一个' },
  { name: '面条(煮)', cat: 'staple', kcal: 111, p: 3.9, c: 22.0, f: 0.1, portion: 200, portionName: '一碗' },
  { name: '白面包', cat: 'staple', kcal: 313, p: 8.6, c: 58.0, f: 5.1, portion: 80, portionName: '两片' },
  { name: '燕麦(干)', cat: 'staple', kcal: 377, p: 13.0, c: 67.0, f: 7.0, portion: 40, portionName: '一份' },
  { name: '红薯', cat: 'staple', kcal: 86, p: 1.6, c: 20.0, f: 0.1, portion: 200, portionName: '一个' },
  { name: '土豆', cat: 'staple', kcal: 77, p: 2.0, c: 17.0, f: 0.1, portion: 150, portionName: '一个' },
  { name: '玉米(鲜)', cat: 'staple', kcal: 112, p: 4.0, c: 22.8, f: 1.2, portion: 200, portionName: '一根' },
  { name: '米粉(干)', cat: 'staple', kcal: 349, p: 7.4, c: 78.0, f: 0.3, portion: 80, portionName: '一份' },

  // ===== 肉禽鱼 =====
  { name: '鸡胸肉', cat: 'meat', kcal: 133, p: 31.0, c: 0, f: 1.2, portion: 120, portionName: '一块' },
  { name: '鸡腿(去皮)', cat: 'meat', kcal: 181, p: 25.0, c: 0, f: 9.0, portion: 150, portionName: '一只' },
  { name: '瘦牛肉', cat: 'meat', kcal: 250, p: 26.0, c: 0, f: 16.0, portion: 120, portionName: '一份' },
  { name: '瘦猪肉', cat: 'meat', kcal: 143, p: 20.3, c: 0, f: 6.2, portion: 120, portionName: '一份' },
  { name: '猪里脊', cat: 'meat', kcal: 155, p: 22.0, c: 0, f: 7.5, portion: 120, portionName: '一份' },
  { name: '虾', cat: 'meat', kcal: 87, p: 18.6, c: 0, f: 1.1, portion: 100, portionName: '一份' },
  { name: '鲈鱼', cat: 'meat', kcal: 105, p: 18.6, c: 0, f: 3.4, portion: 150, portionName: '一条' },
  { name: '三文鱼', cat: 'meat', kcal: 208, p: 20.0, c: 0, f: 13.0, portion: 100, portionName: '一份' },

  // ===== 蛋奶 =====
  { name: '鸡蛋', cat: 'egg_dairy', kcal: 144, p: 13.3, c: 2.8, f: 8.8, portion: 50, portionName: '一个' },
  { name: '蛋白', cat: 'egg_dairy', kcal: 48, p: 11.6, c: 0.8, f: 0.1, portion: 30, portionName: '一个' },
  { name: '牛奶', cat: 'egg_dairy', kcal: 54, p: 3.0, c: 3.4, f: 3.2, portion: 250, portionName: '一杯' },
  { name: '无糖酸奶', cat: 'egg_dairy', kcal: 72, p: 2.5, c: 9.3, f: 2.7, portion: 150, portionName: '一杯' },
  { name: '奶酪', cat: 'egg_dairy', kcal: 328, p: 25.7, c: 3.5, f: 23.5, portion: 30, portionName: '一片' },

  // ===== 豆制品 =====
  { name: '嫩豆腐', cat: 'soy', kcal: 81, p: 8.1, c: 3.8, f: 3.7, portion: 150, portionName: '一块' },
  { name: '北豆腐', cat: 'soy', kcal: 138, p: 12.2, c: 4.2, f: 8.6, portion: 150, portionName: '一块' },
  { name: '豆浆(无糖)', cat: 'soy', kcal: 31, p: 3.0, c: 1.2, f: 1.6, portion: 250, portionName: '一杯' },
  { name: '腐竹(干)', cat: 'soy', kcal: 459, p: 44.6, c: 22.0, f: 21.7, portion: 30, portionName: '一份' },
  { name: '豆干', cat: 'soy', kcal: 140, p: 16.0, c: 5.0, f: 6.0, portion: 80, portionName: '一份' },

  // ===== 蔬菜 =====
  { name: '西兰花', cat: 'veg', kcal: 36, p: 4.1, c: 4.3, f: 0.6, portion: 150, portionName: '一份' },
  { name: '菠菜', cat: 'veg', kcal: 24, p: 2.6, c: 4.5, f: 0.3, portion: 150, portionName: '一份' },
  { name: '生菜', cat: 'veg', kcal: 13, p: 1.4, c: 2.0, f: 0.2, portion: 100, portionName: '一份' },
  { name: '黄瓜', cat: 'veg', kcal: 16, p: 0.8, c: 2.9, f: 0.2, portion: 150, portionName: '一根' },
  { name: '西红柿', cat: 'veg', kcal: 19, p: 0.9, c: 4.0, f: 0.2, portion: 150, portionName: '一个' },
  { name: '胡萝卜', cat: 'veg', kcal: 39, p: 1.0, c: 8.8, f: 0.2, portion: 100, portionName: '一根' },
  { name: '白菜', cat: 'veg', kcal: 17, p: 1.5, c: 3.2, f: 0.1, portion: 200, portionName: '一份' },

  // ===== 水果 =====
  { name: '苹果', cat: 'fruit', kcal: 52, p: 0.3, c: 13.8, f: 0.2, portion: 200, portionName: '一个' },
  { name: '香蕉', cat: 'fruit', kcal: 93, p: 1.4, c: 22.0, f: 0.2, portion: 120, portionName: '一根' },
  { name: '橙子', cat: 'fruit', kcal: 48, p: 0.8, c: 11.1, f: 0.2, portion: 200, portionName: '一个' },
  { name: '葡萄', cat: 'fruit', kcal: 43, p: 0.5, c: 10.3, f: 0.2, portion: 150, portionName: '一份' },
  { name: '西瓜', cat: 'fruit', kcal: 30, p: 0.6, c: 7.6, f: 0.1, portion: 300, portionName: '两片' },
  { name: '草莓', cat: 'fruit', kcal: 32, p: 1.0, c: 7.1, f: 0.2, portion: 150, portionName: '一份' },
  { name: '芒果', cat: 'fruit', kcal: 35, p: 0.6, c: 8.3, f: 0.2, portion: 150, portionName: '一个' },

  // ===== 油脂坚果 =====
  { name: '橄榄油', cat: 'fat', kcal: 899, p: 0, c: 0, f: 99.9, portion: 10, portionName: '一勺' },
  { name: '花生油', cat: 'fat', kcal: 899, p: 0, c: 0, f: 99.9, portion: 10, portionName: '一勺' },
  { name: '花生(生)', cat: 'fat', kcal: 567, p: 25.8, c: 16.1, f: 49.2, portion: 30, portionName: '一把' },
  { name: '杏仁', cat: 'fat', kcal: 578, p: 21.0, c: 22.0, f: 49.0, portion: 30, portionName: '一把' },
  { name: '核桃', cat: 'fat', kcal: 654, p: 14.0, c: 19.0, f: 65.0, portion: 30, portionName: '一把' },
  { name: '花生酱', cat: 'fat', kcal: 588, p: 25.0, c: 22.0, f: 50.0, portion: 20, portionName: '一勺' },

  // ===== 饮料 =====
  { name: '可乐', cat: 'drink', kcal: 43, p: 0, c: 10.6, f: 0, portion: 330, portionName: '一罐' },
  { name: '啤酒', cat: 'drink', kcal: 32, p: 0.4, c: 2.5, f: 0, portion: 330, portionName: '一罐' },
  { name: '红酒', cat: 'drink', kcal: 85, p: 0.2, c: 2.6, f: 0, portion: 150, portionName: '一杯' },
  { name: '橙汁', cat: 'drink', kcal: 45, p: 0.7, c: 10.2, f: 0.2, portion: 250, portionName: '一杯' },
]

export const FOOD_SOURCES =
  '数字基于 USDA FoodData Central / 中国食物成分表（杨月欣等, 2018）通行数值。本环境无法在线核验，仅供参考；实际以食物包装标示为准。'

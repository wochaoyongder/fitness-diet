import React, { useState } from 'react'
import { FOODS, FOOD_CATEGORIES, FOOD_SOURCES } from '../data/foods.js'

// 食物热量速查
export default function FoodExplorer() {
  const [cat, setCat] = useState('staple')
  const [query, setQuery] = useState('')

  let list = FOODS.filter((f) => f.cat === cat)
  if (query.trim()) {
    list = FOODS.filter((f) => f.name.includes(query.trim()))
  }

  return (
    <div className="card food-explorer">
      <h2>食物热量速查</h2>
      <div className="hint" style={{ marginBottom: 14 }}>
        每百克热量与三大营养素。点食物可看「一份」的克数与热量，帮你建立量感。
      </div>

      <div className="field">
        <label>搜索食物</label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="如：鸡胸、米饭、鸡蛋"
        />
      </div>

      {!query && (
        <div className="food-cats">
          {FOOD_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-btn ${cat === c.id ? 'active' : ''}`}
              onClick={() => setCat(c.id)}
              type="button"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <table className="food-table">
        <thead>
          <tr>
            <th>食物</th>
            <th>热量</th>
            <th>蛋白</th>
            <th>碳水</th>
            <th>脂肪</th>
            <th>一份</th>
            <th>一份热量</th>
          </tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.name}>
              <td className="food-name">{f.name}</td>
              <td className="num">{f.kcal}</td>
              <td className="num">{f.p}</td>
              <td className="num">{f.c}</td>
              <td className="num">{f.f}</td>
              <td className="num">{f.portion}g<span className="portion-name"> {f.portionName}</span></td>
              <td className="num portion-kcal">{Math.round(f.kcal * f.portion / 100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <p className="hint" style={{ marginTop: 12 }}>未找到匹配食物。</p>}

      <p className="ref" style={{ marginTop: 14 }}>{FOOD_SOURCES}</p>
    </div>
  )
}

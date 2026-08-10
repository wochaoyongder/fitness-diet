import React from 'react'
import { rebalanceMacroPct } from '../logic/macros.js'

// 三大营养素联动滑块（蛋白 / 碳水 / 脂肪 %，和恒=100）
export default function MacroSlider({ macroPct, onChange }) {
  const handleChange = (changed, val) => {
    const num = Number(val)
    const clamped = Math.max(0, Math.min(100, num))
    const next = rebalanceMacroPct({ ...macroPct, [changed]: clamped }, changed)
    onChange(next)
  }

  const rows = [
    { key: 'protein', label: '蛋白质', color: 'var(--c-protein)' },
    { key: 'carb', label: '碳水化合物', color: '#d97706' },
    { key: 'fat', label: '脂肪', color: 'var(--c-fat)' },
  ]

  return (
    <div className="card">
      <h2>三大营养素配比</h2>
      <div className="hint" style={{ marginBottom: 12 }}>
        拖动任一滑块，其余两个按比例自动调整，保持和 = 100%。
      </div>
      {rows.map((r) => (
        <div className="slider-row" key={r.key}>
          <div className="top">
            <span>{r.label}</span>
            <span>{macroPct[r.key]}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={macroPct[r.key]}
            onChange={(e) => handleChange(r.key, e.target.value)}
            style={{ accentColor: r.color }}
          />
        </div>
      ))}
    </div>
  )
}

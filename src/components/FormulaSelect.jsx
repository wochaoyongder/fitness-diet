import React from 'react'
import { BMR_FORMULAS, RELIABILITY_LABELS } from '../data/formulas.js'

// BMR 公式下拉选择
// props: formulaId, onChange
export default function FormulaSelect({ formulaId, onChange }) {
  const current = BMR_FORMULAS.find((f) => f.id === formulaId)

  return (
    <div className="card">
      <h2>BMR 公式</h2>
      <div className="field">
        <label>选择公式</label>
        <select value={formulaId} onChange={(e) => onChange(e.target.value)}>
          {BMR_FORMULAS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
              {f.year ? ` (${f.year})` : ''}
            </option>
          ))}
        </select>
      </div>

      {current && (
        <div className="guide">
          <p>
            {current.citation}
            <span className={`source-tag ${current.reliability}`}>
              {RELIABILITY_LABELS[current.reliability]}
            </span>
          </p>
          {current.note && <p style={{ fontSize: 13, color: '#7b8794' }}>{current.note}</p>}
          {current.urls.length > 0 && (
            <p className="ref">
              来源：{current.urls.map((u, i) => (
                <React.Fragment key={i}>
                  <a href={u} target="_blank" rel="noopener noreferrer">{u}</a>
                  {i < current.urls.length - 1 ? '；' : ''}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

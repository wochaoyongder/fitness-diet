import React from 'react'
import { METHODS, GROUP_LABELS } from '../data/methods.js'

const RELIABILITY = {
  verified: '已核验',
  partial: '部分核验',
  unverified: '未核验',
}

// 饮食方法选择（减脂/增肌分组）
export default function MethodSelect({ methodId, onChange }) {
  const groups = ['cut', 'bulk']

  return (
    <div className="card">
      <h2>饮食方法</h2>
      {groups.map((g) => (
        <div className="method-group" key={g}>
          <div className="method-group-label">{GROUP_LABELS[g]}</div>
          <div className="method-options">
            {METHODS.filter((m) => m.group === g).map((m) => (
              <label key={m.id}>
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={methodId === m.id}
                  onChange={() => onChange(m.id)}
                  style={{ display: 'none' }}
                />
                {m.name}
                <span className={`source-tag ${m.reliability}`}>
                  {RELIABILITY[m.reliability]}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

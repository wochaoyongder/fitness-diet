import React from 'react'
import { METHODS, GROUP_LABELS } from '../data/methods.js'

const RELIABILITY = { verified: '已核验', partial: '部分核验', unverified: '未核验' }

// 第 2 步：选目标（先大类，再方法）
// props: group, onGroup, methodId, onMethod, onBack, onNext
export default function Step2Goal({ group, onGroup, methodId, onMethod, onBack, onNext }) {
  const groups = [
    { id: 'cut', label: '减脂', desc: '降低体脂，保留肌肉' },
    { id: 'bulk', label: '增肌', desc: '增加体重，长肌肉为主' },
  ]

  return (
    <div className="step-content">
      <h2 className="step-title-main">你想做什么？</h2>
      <p className="step-sub">先选大类，再选具体方法。</p>

      <div className="group-cards">
        {groups.map((g) => (
          <button
            key={g.id}
            className={`group-card ${group === g.id ? 'active' : ''}`}
            onClick={() => onGroup(g.id)}
            type="button"
          >
            <div className="group-label">{g.label}</div>
            <div className="group-desc">{g.desc}</div>
          </button>
        ))}
      </div>

      <div className="field" style={{ marginTop: 20 }}>
        <label>具体方法</label>
        <div className="method-cards">
          {METHODS.filter((m) => m.group === group).map((m) => (
            <button
              key={m.id}
              className={`method-card ${methodId === m.id ? 'active' : ''}`}
              onClick={() => onMethod(m.id)}
              type="button"
            >
              <div className="method-name">
                {m.name}
                <span className={`source-tag ${m.reliability}`}>{RELIABILITY[m.reliability]}</span>
              </div>
              <div className="method-desc">{m.note}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>← 上一步</button>
        <button className="btn-primary" onClick={onNext}>下一步 →</button>
      </div>
    </div>
  )
}

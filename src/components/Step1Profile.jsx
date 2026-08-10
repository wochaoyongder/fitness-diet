import React, { useState } from 'react'
import { ACTIVITY_LEVELS } from '../data/activityLevels.js'

// 第 1 步：关于你
// props: input, onChange, formulaNeedsBodyFat, onNext
export default function Step1Profile({ input, onChange, formulaNeedsBodyFat, onNext }) {
  const set = (key) => (e) => onChange({ ...input, [key]: e.target.value })
  const [showBodyFat, setShowBodyFat] = useState(!!input.bodyFat)

  return (
    <div className="step-content">
      <h2 className="step-title-main">告诉我你的基本情况</h2>
      <p className="step-sub">这些数据用来计算你每天消耗多少热量。</p>

      <div className="field">
        <label>性别</label>
        <div className="radio-group">
          <label className={input.sex === 'male' ? 'checked' : ''}>
            <input type="radio" name="sex" value="male" checked={input.sex === 'male'} onChange={set('sex')} />
            男
          </label>
          <label className={input.sex === 'female' ? 'checked' : ''}>
            <input type="radio" name="sex" value="female" checked={input.sex === 'female'} onChange={set('sex')} />
            女
          </label>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>年龄（岁）</label>
          <input type="number" min="1" value={input.age} onChange={set('age')} />
        </div>
        <div className="field">
          <label>身高（cm）</label>
          <input type="number" min="1" value={input.height} onChange={set('height')} />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>体重（kg）</label>
          <input type="number" min="1" step="0.1" value={input.weight} onChange={set('weight')} />
        </div>
        <div className="field">
          <label>体脂率（%）</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={input.bodyFat}
            onChange={set('bodyFat')}
            placeholder={formulaNeedsBodyFat ? '必填' : '选填'}
          />
        </div>
      </div>
      {!formulaNeedsBodyFat && (
        <div className="hint" style={{ marginTop: -4 }}>
          {showBodyFat ? '填了体脂率可启用 Katch-McArdle 公式（更准）' : '选填；选 Katch-McArdle 公式时必填'}
        </div>
      )}

      <div className="field">
        <label>活动量</label>
        <div className="activity-grid">
          {ACTIVITY_LEVELS.map((l) => (
            <button
              key={l.id}
              className={`activity-card ${input.activity === l.id ? 'active' : ''}`}
              onClick={() => onChange({ ...input, activity: l.id })}
              type="button"
            >
              <div className="activity-label">{l.label}</div>
              <div className="activity-factor">系数 {l.factor}</div>
              <div className="activity-steps">{l.stepsPerDay}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="step-nav">
        <span />
        <button className="btn-primary" onClick={onNext}>
          下一步 →
        </button>
      </div>
    </div>
  )
}

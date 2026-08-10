import React from 'react'
import { ACTIVITY_LEVELS } from '../data/activityLevels.js'

// 用户输入表单
export default function InputForm({ input, onChange, formulaNeedsBodyFat }) {
  const set = (key) => (e) => onChange({ ...input, [key]: e.target.value })

  return (
    <div className="card">
      <h2>你的信息</h2>

      <div className="field">
        <label>性别</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="sex" value="male" checked={input.sex === 'male'} onChange={set('sex')} />
            男
          </label>
          <label>
            <input type="radio" name="sex" value="female" checked={input.sex === 'female'} onChange={set('sex')} />
            女
          </label>
        </div>
      </div>

      <div className="field">
        <label>年龄（岁）</label>
        <input type="number" min="1" value={input.age} onChange={set('age')} />
      </div>

      <div className="field">
        <label>身高（cm）</label>
        <input type="number" min="1" value={input.height} onChange={set('height')} />
      </div>

      <div className="field">
        <label>体重（kg）</label>
        <input type="number" min="1" step="0.1" value={input.weight} onChange={set('weight')} />
      </div>

      <div className="field">
        <label>
          体脂率（%）{formulaNeedsBodyFat && <span className="required" />}
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={input.bodyFat}
          onChange={set('bodyFat')}
          placeholder={formulaNeedsBodyFat ? '必填（如 20）' : '可选'}
        />
        {!formulaNeedsBodyFat && (
          <div className="hint">选 Katch-McArdle 公式时必填</div>
        )}
      </div>

      <div className="field">
        <label>活动量</label>
        <select value={input.activity} onChange={set('activity')}>
          {ACTIVITY_LEVELS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}（系数 {l.factor}）
            </option>
          ))}
        </select>
        <div className="hint">
          {ACTIVITY_LEVELS.find((l) => l.id === input.activity)?.desc}
        </div>
      </div>
    </div>
  )
}

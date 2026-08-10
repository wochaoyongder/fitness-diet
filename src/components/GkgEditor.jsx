import React from 'react'

// g/kg 模式输入器：蛋白/脂肪按 g/kg，碳水自动补足
// props: weight, values {proteinGPerKg, fatGPerKg}, onChange, targetKcal, resultMacros
export default function GkgEditor({ weight, values, onChange }) {
  const set = (key) => (e) => {
    const v = e.target.value === '' ? '' : Number(e.target.value)
    onChange({ ...values, [key]: v })
  }

  return (
    <div className="card">
      <h2>营养素 g/kg 设置</h2>
      <div className="hint" style={{ marginBottom: 10 }}>
        蛋白质与脂肪按每公斤体重设定，碳水由剩余热量自动补足。
        参考：蛋白质运动人群 1.6-2.2 g/kg；脂肪健康下限 0.8-1.0 g/kg。
      </div>
      <div className="field">
        <label>蛋白质（g/kg 体重）</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={values.proteinGPerKg}
          onChange={set('proteinGPerKg')}
        />
        <div className="hint">
          ≈ {Math.round((Number(values.proteinGPerKg) || 0) * (Number(weight) || 0))} g/天
        </div>
      </div>
      <div className="field">
        <label>脂肪（g/kg 体重）</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={values.fatGPerKg}
          onChange={set('fatGPerKg')}
        />
        <div className="hint">
          ≈ {Math.round((Number(values.fatGPerKg) || 0) * (Number(weight) || 0))} g/天
        </div>
      </div>
      <div className="field">
        <label>碳水</label>
        <input
          type="text"
          disabled
          value="由剩余热量自动计算"
          style={{ background: '#f3f4f6', color: '#7b8794' }}
        />
      </div>
    </div>
  )
}

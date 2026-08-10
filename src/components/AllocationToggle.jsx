import React from 'react'

// 分配方式切换器（比例 % vs g/kg）
// props: allocation, onChange, methodPeriod（'week' 时隐藏）
export default function AllocationToggle({ allocation, onChange, disabled }) {
  if (disabled) return null // 周循环方法不显示

  const options = [
    { id: 'gkg', label: '按 g/kg 体重', desc: '蛋白/脂肪按每公斤体重固定，碳水补足。运动营养哲学，保瘦体重。' },
    { id: 'ratio', label: '按比例 %', desc: '三大营养素按总热量百分比。健康比例哲学（DRI 风格）。' },
  ]

  return (
    <div className="card">
      <h2>分配方式</h2>
      <div className="alloc-toggle">
        {options.map((o) => (
          <button
            key={o.id}
            className={`alloc-btn ${allocation === o.id ? 'active' : ''}`}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        {options.find((o) => o.id === allocation)?.desc}
      </p>
    </div>
  )
}

import React from 'react'

// 顶部进度条（可点击回退到走过的步）
// props: steps(标题数组), current, max(已到达最远步), onGo(idx)
export default function Stepper({ steps, current, max, onGo }) {
  return (
    <div className="stepper">
      {steps.map((title, i) => {
        const idx = i + 1
        const isActive = idx === current
        const isDone = idx < current
        const canGo = idx <= max
        return (
          <React.Fragment key={i}>
            <button
              className={`step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${canGo ? 'clickable' : ''}`}
              onClick={() => canGo && onGo(idx)}
              disabled={!canGo}
            >
              <span className="step-num">
                {isDone ? '✓' : idx}
              </span>
              <span className="step-title">{title}</span>
            </button>
            {i < steps.length - 1 && <div className={`step-bar ${idx < current ? 'done' : ''}`} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

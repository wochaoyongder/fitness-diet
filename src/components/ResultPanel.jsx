import React from 'react'
import { KCAL_PER_GRAM } from '../logic/macros.js'

// 结果展示
// props: result { targetKcal, dailyMacros, weeklyTable?, note }
//        tdee, bmr
export default function ResultPanel({ result, tdee, bmr }) {
  if (!result) return null

  const { protein, carb, fat } = result.dailyMacros
  const totalFromMacro =
    protein * KCAL_PER_GRAM.protein + carb * KCAL_PER_GRAM.carb + fat * KCAL_PER_GRAM.fat
  const pPct = totalFromMacro > 0 ? Math.round((protein * 4 / totalFromMacro) * 1000) / 10 : 0
  const cPct = totalFromMacro > 0 ? Math.round((carb * 4 / totalFromMacro) * 1000) / 10 : 0
  const fPct = totalFromMacro > 0 ? Math.round((fat * 9 / totalFromMacro) * 1000) / 10 : 0

  return (
    <div className="card">
      <h2>计算结果</h2>

      <div className="result-big">
        <div>
          <span className="kcal">{Math.round(result.targetKcal)}</span>
          <span className="kcal-unit">kcal</span>
        </div>
        <div className="label">目标每日热量</div>
      </div>

      <div className="bmr-tdee">
        <span>BMR <strong>{bmr}</strong> kcal</span>
        <span>TDEE <strong>{tdee}</strong> kcal</span>
      </div>

      <div className="macro-row">
        <div className="macro-box protein">
          <div className="g">{protein}g</div>
          <div className="name">蛋白质</div>
          <div className="pct">{pPct}%</div>
        </div>
        <div className="macro-box carb">
          <div className="g">{carb}g</div>
          <div className="name">碳水</div>
          <div className="pct">{cPct}%</div>
        </div>
        <div className="macro-box fat">
          <div className="g">{fat}g</div>
          <div className="name">脂肪</div>
          <div className="pct">{fPct}%</div>
        </div>
      </div>

      {result.note && (
        <p style={{ fontSize: 13, color: 'var(--c-muted)', margin: '8px 0 0' }}>
          {result.note}
        </p>
      )}

      {result.weeklyTable && (
        <>
          <div className="section-title">碳水循环 · 7 天表</div>
          <table className="weekly">
            <thead>
              <tr>
                <th>天</th>
                <th>档位</th>
                <th>蛋白</th>
                <th>碳水</th>
                <th>脂肪</th>
                <th>热量</th>
              </tr>
            </thead>
            <tbody>
              {result.weeklyTable.map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td className={`level-${d.level}`}>
                    {d.level === 'high' ? '高碳' : d.level === 'mid' ? '中碳' : '低碳'}
                  </td>
                  <td>{d.protein}g</td>
                  <td>{d.carb}g</td>
                  <td>{d.fat}g</td>
                  <td>{d.kcal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: 'var(--c-muted)', marginTop: 6 }}>
            周均 {Math.round(result.weeklyTable.reduce((s, d) => s + d.kcal, 0) / 7)} kcal/天
          </p>
        </>
      )}
    </div>
  )
}

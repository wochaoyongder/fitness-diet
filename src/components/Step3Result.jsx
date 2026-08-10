import React, { useState } from 'react'
import AllocationToggle from './AllocationToggle.jsx'
import MacroSlider from './MacroSlider.jsx'
import GkgEditor from './GkgEditor.jsx'

// 第 3 步：看结果 + 高级调整（默认显示配比卡）
export default function Step3Result({
  result, tdee, bmr, method, allocation, onAllocation,
  macroPct, onMacroPct, gkgValues, onGkg, weight,
  schedule, onSchedule, carbManualDecrease, onCarbDecrease,
  deficitOverride, onDeficit, surplusOverride, onSurplus,
  cycleTargetDeficit, onCycleTargetDeficit,
  nextWeekWeight, onNextWeekWeight,
  onBack,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const isCarbCycle = method.id === 'carb_cycle'
  const isCarbDecrease = method.id === 'carb_decrease'
  const showDeficit = 'deficitKcal' in method.defaults
  const showSurplus = 'surplusKcal' in method.defaults

  if (!result) return <div className="step-content"><p>请返回上一步补全信息。</p></div>

  const { protein, carb, fat } = result.dailyMacros
  const totalFromMacro = protein * 4 + carb * 4 + fat * 9
  const pPct = totalFromMacro > 0 ? Math.round((protein * 4 / totalFromMacro) * 1000) / 10 : 0
  const cPct = totalFromMacro > 0 ? Math.round((carb * 4 / totalFromMacro) * 1000) / 10 : 0
  const fPct = totalFromMacro > 0 ? Math.round((fat * 9 / totalFromMacro) * 1000) / 10 : 0

  // C: 连续低碳检测（≥2 个连续低碳日）
  let consecutiveLow = 0
  for (const lvl of schedule) {
    if (lvl === 'low') consecutiveLow++
    else consecutiveLow = 0
  }
  // 检查是否有 2+ 连续（含循环首尾相接）
  const lowRun = (() => {
    let maxRun = 0, cur = 0
    for (const lvl of schedule) {
      if (lvl === 'low') { cur++; maxRun = Math.max(maxRun, cur) }
      else cur = 0
    }
    // 首尾相接
    if (schedule[0] === 'low' && schedule[schedule.length - 1] === 'low') {
      let head = 0; for (const l of schedule) { if (l === 'low') head++; else break }
      let tail = 0; for (let i = schedule.length - 1; i >= 0; i--) { if (schedule[i] === 'low') tail++; else break }
      maxRun = Math.max(maxRun, head + tail)
    }
    return maxRun
  })()

  return (
    <div className="step-content">
      <h2 className="step-title-main">你的饮食计划</h2>
      <p className="step-sub">基于「{method.name}」计算，下方可调整配比。</p>

      {/* 结果主卡 */}
      <div className="result-big">
        <div>
          <span className="kcal" key={`k-${Math.round(result.targetKcal)}`}>{Math.round(result.targetKcal)}</span>
          <span className="kcal-unit">kcal/天</span>
        </div>
        <div className="label">
          {isCarbCycle ? '周均每日热量' : '目标每日热量'}
        </div>
        <div className="bmr-tdee">
          <span>BMR <strong>{bmr}</strong></span>
          <span>TDEE <strong>{tdee}</strong></span>
        </div>
      </div>

      {/* A: 碳水循环赤字过大警告 */}
      {isCarbCycle && result.warning && (
        <div className="warn warn-strong">{result.warning}</div>
      )}

      <div className="macro-row">
        <div className="macro-box protein">
          <div className="g" key={`p-${protein}`}>{protein}g</div>
          <div className="name">蛋白质</div>
          <div className="pct" key={`pp-${pPct}`}>{pPct}%</div>
        </div>
        <div className="macro-box carb">
          <div className="g" key={`c-${carb}`}>{carb}g</div>
          <div className="name">碳水</div>
          <div className="pct" key={`cp-${cPct}`}>{cPct}%</div>
        </div>
        <div className="macro-box fat">
          <div className="g" key={`f-${fat}`}>{fat}g</div>
          <div className="name">脂肪</div>
          <div className="pct" key={`fp-${fPct}`}>{fPct}%</div>
        </div>
      </div>

      {result.note && <p className="result-note">{result.note}</p>}

      {/* B: 碳水渐降下周递减展示 */}
      {isCarbDecrease && result.nextWeek && (
        <div className="next-week-card">
          <div className="next-week-title">下周预测（体重 {result.nextWeek.weight}kg）</div>
          <div className="next-week-row">
            <div className="next-week-cell">
              <div className="next-week-label">TDEE</div>
              <div className="next-week-val">{result.nextWeek.tdee}</div>
            </div>
            <div className="next-week-cell">
              <div className="next-week-label">目标</div>
              <div className="next-week-val">{result.nextWeek.targetKcal}</div>
            </div>
            <div className="next-week-cell">
              <div className="next-week-label">碳水</div>
              <div className="next-week-val">{result.nextWeek.macros.carb}g</div>
            </div>
            <div className="next-week-cell">
              <div className="next-week-label">较本周</div>
              <div className={`next-week-val ${result.nextWeek.carbDecrease > 0 ? 'down' : result.nextWeek.carbDecrease < 0 ? 'up' : ''}`}>
                {result.nextWeek.carbDecrease > 0 ? `−${result.nextWeek.carbDecrease}g` : result.nextWeek.carbDecrease < 0 ? `+${-result.nextWeek.carbDecrease}g` : '持平'}
              </div>
            </div>
          </div>
        </div>
      )}

      {result.weeklyTable && (
        <>
          <div className="section-title">碳水循环 · 7 天表</div>
          <table className="weekly">
            <thead>
              <tr><th>天</th><th>档位</th><th>蛋白</th><th>碳水</th><th>脂肪</th><th>热量</th></tr>
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
          <p className="weekly-avg">
            周均 {Math.round(result.weeklyTable.reduce((s, d) => s + d.kcal, 0) / 7)} kcal/天
          </p>
        </>
      )}

      {/* 默认显示配比卡 */}
      {isCarbCycle ? (
        <div className="card">
          <h2>碳水循环排班</h2>
          <div className="hint" style={{ marginBottom: 10 }}>默认 高-中-中-高-中-低-低，避免连续低碳。可下拉调整。</div>
          <div className="schedule-row">
            {schedule.map((lvl, i) => (
              <select key={i} value={lvl} className={lvl}
                onChange={(e) => { const n = [...schedule]; n[i] = e.target.value; onSchedule(n) }}>
                <option value="high">高</option>
                <option value="mid">中</option>
                <option value="low">低</option>
              </select>
            ))}
          </div>
          <div className="hint">
            周 {schedule.filter((s) => s === 'high').length} 高碳 /{' '}
            {schedule.filter((s) => s === 'mid').length} 中碳 /{' '}
            {schedule.filter((s) => s === 'low').length} 低碳
          </div>
          {/* C: 连续低碳提醒 */}
          {lowRun >= 2 && (
            <div className="warn warn-soft">
              ⚠ 你排出了 {lowRun} 天连续低碳，易饿 + 代谢补偿（凯圣王）。建议至少插入一天中/高碳。
            </div>
          )}
        </div>
      ) : isCarbDecrease ? (
        <>
          <GkgEditor weight={weight} values={gkgValues} onChange={onGkg} />
          {/* B: 下周体重输入 */}
          <div className="card">
            <h2>下周体重预测</h2>
            <div className="hint" style={{ marginBottom: 10 }}>
              填入预计下周的体重，自动按新体重重算 TDEE，碳水自然下降——这正是「渐降」。
            </div>
            <div className="field">
              <label>下周体重（kg）</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nextWeekWeight ?? ''}
                placeholder={weight}
                onChange={(e) => onNextWeekWeight(e.target.value === '' ? null : Number(e.target.value))}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <AllocationToggle allocation={allocation} onChange={onAllocation} />
          {allocation === 'ratio' ? (
            <MacroSlider macroPct={macroPct} onChange={onMacroPct} />
          ) : (
            <GkgEditor weight={weight} values={gkgValues} onChange={onGkg} />
          )}
        </>
      )}

      {/* 高级调整折叠区（grid-rows 平滑展开） */}
      <div className={`advanced-wrap ${showAdvanced ? 'open' : ''}`}>
        <div className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          <span>{showAdvanced ? '▾' : '▸'} 高级调整（公式 / 赤字盈余 / 碳水下调）</span>
        </div>
        <div className="advanced-body">
          <div className="advanced-inner">
            {/* A: 碳水循环目标赤字 */}
            {isCarbCycle && (
              <div className="field">
                <label>目标赤字（kcal/天，留空用凯圣王原公式）</label>
                <input
                  type="number"
                  min="0"
                  value={cycleTargetDeficit ?? ''}
                  placeholder="如 300（按 TDEE−300 反推周碳水）"
                  onChange={(e) => onCycleTargetDeficit(e.target.value === '' ? null : Number(e.target.value))}
                />
                <div className="hint">填了按目标周均热量反推周碳水总量，赤字可控；不填用凯圣王原公式（体重×2×7）。</div>
              </div>
            )}
            {isCarbDecrease && (
              <div className="field">
                <label>额外减少碳水（g/天）</label>
                <input type="number" min="0" value={carbManualDecrease}
                  onChange={(e) => onCarbDecrease(Number(e.target.value) || 0)} />
                <div className="hint">减脂停滞时自行减少碳水。</div>
              </div>
            )}
            {showDeficit && !isCarbCycle && (
              <div className="field">
                <label>热量赤字（kcal，留空用默认 {method.defaults.deficitKcal}）</label>
                <input type="number" value={deficitOverride ?? ''}
                  placeholder={method.defaults.deficitKcal}
                  onChange={(e) => onDeficit(e.target.value === '' ? null : Number(e.target.value))} />
              </div>
            )}
            {showSurplus && (
              <div className="field">
                <label>热量盈余（kcal，留空用默认 {method.defaults.surplusKcal}）</label>
                <input type="number" value={surplusOverride ?? ''}
                  placeholder={method.defaults.surplusKcal}
                  onChange={(e) => onSurplus(e.target.value === '' ? null : Number(e.target.value))} />
              </div>
            )}
            <div className="hint" style={{ marginTop: 8 }}>
              BMR 公式可在顶部「说明」页查看与切换。
            </div>
          </div>
        </div>
      </div>

      <div className="step-nav">
        <button className="btn-secondary" onClick={onBack}>← 上一步</button>
        <span className="recalc-hint">改动后结果自动重算</span>
      </div>
    </div>
  )
}

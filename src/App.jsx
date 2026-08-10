import React, { useState, useMemo, useEffect } from 'react'
import Stepper from './components/Stepper.jsx'
import Step1Profile from './components/Step1Profile.jsx'
import Step2Goal from './components/Step2Goal.jsx'
import Step3Result from './components/Step3Result.jsx'
import FormulaSelect from './components/FormulaSelect.jsx'
import MethodGuide from './components/MethodGuide.jsx'
import FoodExplorer from './components/FoodExplorer.jsx'
import { BMR_FORMULAS, DEFAULT_FORMULA_ID } from './data/formulas.js'
import { DEFAULT_ACTIVITY_ID } from './data/activityLevels.js'
import { METHODS, DEFAULT_METHOD_ID } from './data/methods.js'
import { calcBMR } from './logic/bmr.js'
import { calcTDEE } from './logic/tdee.js'
import { calcMethod } from './logic/methods.js'

const STORAGE_KEY = 'fitness-diet-profile'
function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
function saveProfile(input) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(input)) } catch { /* 忽略 */ }
}

const STEP_TITLES = ['关于你', '选目标', '看结果']

export default function App() {
  const saved = loadProfile()
  const [input, setInput] = useState({
    sex: saved?.sex || 'male',
    age: saved?.age || 25,
    height: saved?.height || 175,
    weight: saved?.weight || 73,
    bodyFat: saved?.bodyFat || '',
    activity: saved?.activity || DEFAULT_ACTIVITY_ID,
  })
  const [formulaId, setFormulaId] = useState(DEFAULT_FORMULA_ID)
  const [methodId, setMethodId] = useState(DEFAULT_METHOD_ID)
  const [tab, setTab] = useState('calculator')

  // 步骤：1=关于你 2=选目标 3=看结果
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1) // 已到达最远步，用于进度条可点击

  const method = METHODS.find((m) => m.id === methodId)
  // group 随 method 变（用户在第2步也可改 group）
  const [group, setGroup] = useState(method?.group || 'bulk')

  // 分配方式
  const [allocation, setAllocation] = useState(method?.defaultAllocation || 'gkg')
  useEffect(() => {
    const m = METHODS.find((x) => x.id === methodId)
    if (m?.defaultAllocation) setAllocation(m.defaultAllocation)
    if (m) setGroup(m.group)
  }, [methodId])

  const [gkgValues, setGkgValues] = useState({
    proteinGPerKg: method?.defaults?.proteinGPerKg || 1.8,
    fatGPerKg: method?.defaults?.fatGPerKg || 1.0,
  })
  useEffect(() => {
    const m = METHODS.find((x) => x.id === methodId)
    if (m?.defaults?.proteinGPerKg) {
      setGkgValues({ proteinGPerKg: m.defaults.proteinGPerKg, fatGPerKg: m.defaults.fatGPerKg })
    }
  }, [methodId])

  const [macroPct, setMacroPct] = useState(method?.defaults?.macroPct || { protein: 30, carb: 45, fat: 25 })
  useEffect(() => {
    const m = METHODS.find((x) => x.id === methodId)
    if (m?.defaults?.macroPct) setMacroPct(m.defaults.macroPct)
  }, [methodId])

  const [schedule, setSchedule] = useState(
    METHODS.find((m) => m.id === 'carb_cycle').defaults.defaultSchedule
  )
  const [carbManualDecrease, setCarbManualDecrease] = useState(0)
  const [deficitOverride, setDeficitOverride] = useState(null)
  const [surplusOverride, setSurplusOverride] = useState(null)
  // A: 碳水循环目标赤字（null=用凯圣王原公式，填了=按赤字反推周碳水）
  const [cycleTargetDeficit, setCycleTargetDeficit] = useState(null)
  // B: 碳水渐降下周体重（null=不显示下周，填了=算下周碳水）
  const [nextWeekWeight, setNextWeekWeight] = useState(null)

  const formula = BMR_FORMULAS.find((f) => f.id === formulaId)
  const needsBodyFat = formula?.needsBodyFat

  useEffect(() => { saveProfile(input) }, [input])

  const calcInput = useMemo(
    () => ({
      sex: input.sex,
      age: Number(input.age) || 0,
      height: Number(input.height) || 0,
      weight: Number(input.weight) || 0,
      bodyFat: input.bodyFat === '' ? null : (Number(input.bodyFat) || 0) / 100,
    }),
    [input]
  )

  const bmr = useMemo(() => {
    if (!calcInput.age || !calcInput.height || !calcInput.weight) return 0
    if (needsBodyFat && (calcInput.bodyFat === null || isNaN(calcInput.bodyFat))) return 0
    return calcBMR(formulaId, calcInput)
  }, [formulaId, calcInput, needsBodyFat])

  const tdee = useMemo(() => calcTDEE(bmr, input.activity), [bmr, input.activity])

  const isCarbCycle = methodId === 'carb_cycle'
  const isCarbDecrease = methodId === 'carb_decrease'

  const result = useMemo(() => {
    if (!tdee || !calcInput.weight || !method) return null
    const methodInput = { weight: calcInput.weight, allocation }

    if (isCarbCycle) {
      Object.assign(methodInput, {
        schedule,
        carbSplit: method.defaults.carbSplit,
        fatSplit: method.defaults.fatSplit,
        proteinGPerKg: method.defaults.proteinGPerKg,
        weeklyCarbGPerKg: method.defaults.weeklyCarbGPerKg,
        weeklyFatGPerKg: method.defaults.weeklyFatGPerKg,
        targetDeficit: cycleTargetDeficit,
      })
    } else if (isCarbDecrease) {
      methodInput.proteinGPerKg = gkgValues.proteinGPerKg
      methodInput.fatGPerKg = gkgValues.fatGPerKg
      methodInput.carbManualDecrease = carbManualDecrease
      methodInput.deficitKcal = deficitOverride !== null ? deficitOverride : method.defaults.deficitKcal
      // B: 下周递减 —— 用新体重重算 BMR/TDEE
      methodInput.nextWeekWeight = nextWeekWeight
      if (nextWeekWeight != null && nextWeekWeight > 0) {
        methodInput.nextTdee = calcTDEE(
          calcBMR(formulaId, { ...calcInput, weight: Number(nextWeekWeight) }),
          input.activity
        )
      }
    } else if (allocation === 'gkg') {
      methodInput.proteinGPerKg = gkgValues.proteinGPerKg
      methodInput.fatGPerKg = gkgValues.fatGPerKg
      if ('deficitKcal' in method.defaults) {
        methodInput.deficitKcal = deficitOverride !== null ? deficitOverride : method.defaults.deficitKcal
      } else if ('surplusKcal' in method.defaults) {
        methodInput.surplusKcal = surplusOverride !== null ? surplusOverride : method.defaults.surplusKcal
      }
    } else {
      methodInput.macroPct = macroPct
      if ('deficitKcal' in method.defaults) {
        methodInput.deficitKcal = deficitOverride !== null ? deficitOverride : method.defaults.deficitKcal
      } else if ('surplusKcal' in method.defaults) {
        methodInput.surplusKcal = surplusOverride !== null ? surplusOverride : method.defaults.surplusKcal
      }
    }

    try { return calcMethod(methodId, methodInput, tdee) }
    catch (e) { console.error(e); return null }
  }, [methodId, method, tdee, calcInput, allocation, gkgValues, macroPct, schedule, carbManualDecrease, deficitOverride, surplusOverride, cycleTargetDeficit, nextWeekWeight, isCarbCycle, isCarbDecrease])

  const goStep = (n) => { setStep(n); if (n > maxStep) setMaxStep(n) }
  const next = () => goStep(Math.min(3, step + 1))
  const back = () => goStep(Math.max(1, step - 1))

  // 切到某 group 时，若当前 method 不属于该 group，切到该 group 第一个 method
  const handleGroup = (g) => {
    setGroup(g)
    const first = METHODS.find((m) => m.group === g)
    if (first && METHODS.find((m) => m.id === methodId)?.group !== g) {
      setMethodId(first.id)
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>健身饮食计算器</h1>
        <p>计算减脂/增肌期热量与三大营养素分配 · 开源项目</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'calculator' ? 'active' : ''}`} onClick={() => setTab('calculator')}>
          计算器
        </button>
        <button className={`tab ${tab === 'food' ? 'active' : ''}`} onClick={() => setTab('food')}>
          食物速查
        </button>
        <button className={`tab ${tab === 'guide' ? 'active' : ''}`} onClick={() => setTab('guide')}>
          说明
        </button>
      </div>

      {tab === 'calculator' ? (
        <div className="wizard">
          <Stepper steps={STEP_TITLES} current={step} max={maxStep} onGo={goStep} />

          <div className="card step-card">
            {step === 1 && (
              <Step1Profile
                input={input} onChange={setInput}
                formulaNeedsBodyFat={needsBodyFat} onNext={next}
              />
            )}
            {step === 2 && (
              <Step2Goal
                group={group} onGroup={handleGroup}
                methodId={methodId} onMethod={setMethodId}
                onBack={back} onNext={next}
              />
            )}
            {step === 3 && (
              <Step3Result
                result={result} tdee={tdee} bmr={bmr} method={method}
                allocation={allocation} onAllocation={setAllocation}
                macroPct={macroPct} onMacroPct={setMacroPct}
                gkgValues={gkgValues} onGkg={setGkgValues} weight={calcInput.weight}
                schedule={schedule} onSchedule={setSchedule}
                carbManualDecrease={carbManualDecrease} onCarbDecrease={setCarbManualDecrease}
                deficitOverride={deficitOverride} onDeficit={setDeficitOverride}
                surplusOverride={surplusOverride} onSurplus={setSurplusOverride}
                cycleTargetDeficit={cycleTargetDeficit} onCycleTargetDeficit={setCycleTargetDeficit}
                nextWeekWeight={nextWeekWeight} onNextWeekWeight={setNextWeekWeight}
                input={input} formulaId={formulaId}
                onBack={back}
              />
            )}
          </div>

          {/* 公式选择放底部，低调 */}
          <details className="formula-details">
            <summary>BMR 公式（{formula?.name}）</summary>
            <FormulaSelect formulaId={formulaId} onChange={setFormulaId} />
          </details>
        </div>
      ) : tab === 'food' ? (
        <FoodExplorer />
      ) : (
        <MethodGuide formulaId={formulaId} methodId={methodId} activityId={input.activity} />
      )}
    </div>
  )
}

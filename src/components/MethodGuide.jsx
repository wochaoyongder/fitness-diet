import React from 'react'
import { METHODS, GROUP_LABELS } from '../data/methods.js'
import { BMR_FORMULAS, RELIABILITY_LABELS as BMR_REL } from '../data/formulas.js'
import { ACTIVITY_LEVELS, ACTIVITY_NOTE } from '../data/activityLevels.js'
import { INSTITUTION_SOURCES, BLOGGER_SOURCES, COMBINED_TEMPLATE } from '../data/references.js'

// 内嵌教学说明
// props: formulaId, methodId, activityId
export default function MethodGuide({ formulaId, methodId, activityId }) {
  const formula = BMR_FORMULAS.find((f) => f.id === formulaId)
  const method = METHODS.find((m) => m.id === methodId)
  const activity = ACTIVITY_LEVELS.find((l) => l.id === activityId)

  return (
    <div className="card guide">
      <h2>说明</h2>

      <h3>当前 BMR 公式</h3>
      {formula && (
        <>
          <p>
            <strong>{formula.name}</strong>
            {formula.year ? `（${formula.year}）` : ''}
            <span className={`source-tag ${formula.reliability}`}>
              {BMR_REL[formula.reliability]}
            </span>
          </p>
          <p className="ref">{formula.citation}</p>
          {formula.urls.map((u, i) => (
            <p className="ref" key={i}>
              <a href={u} target="_blank" rel="noopener noreferrer">{u}</a>
            </p>
          ))}
          {formula.note && <p style={{ fontSize: 13, color: '#7b8794' }}>{formula.note}</p>}
        </>
      )}

      <h3>当前饮食方法</h3>
      {method && (
        <>
          <p>
            <strong>{method.name}</strong>
            <span style={{ marginLeft: 6, color: '#7b8794' }}>
              （{GROUP_LABELS[method.group]} · {method.period === 'week' ? '周循环' : '每日'}）
            </span>
            <span className={`source-tag ${method.reliability}`}>
              {method.reliability === 'verified' ? '已核验' : method.reliability === 'partial' ? '部分核验' : '未核验'}
            </span>
          </p>
          <p className="ref">{method.citation}</p>
          <p>{method.note}</p>
        </>
      )}

      <h3>三大营养素科普</h3>
      <ul>
        <li>1g 蛋白质 = 4 kcal；1g 碳水化合物 = 4 kcal；1g 脂肪 = 9 kcal</li>
        <li>蛋白质：修复与构建肌肉，减脂期保瘦体重</li>
        <li>碳水化合物：主要能量来源，尤其支撑训练</li>
        <li>脂肪：激素合成、脂溶性维生素吸收，非敌人，但热量密度高</li>
      </ul>

      <h3>当前活动量档位</h3>
      {activity && (
        <>
          <p>
            <strong>{activity.label}</strong>（系数 {activity.factor}）
          </p>
          <p>{activity.desc}</p>
          <p style={{ fontSize: 13, color: '#7b8794' }}>参考步数：{activity.stepsPerDay}</p>
          <p style={{ fontSize: 13, color: '#7b8794' }}>示例：{activity.examples}</p>
        </>
      )}
      <p className="ref">{ACTIVITY_NOTE}</p>

      <h3>数据来源（机构）</h3>
      {INSTITUTION_SOURCES.map((s, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <p>
            <strong>{s.name}</strong>
            <span className={`source-tag ${s.reliability}`}>
              {s.reliability === 'verified' ? '已核验' : s.reliability === 'partial' ? '部分核验' : '未核验'}
            </span>
          </p>
          <p style={{ fontSize: 13 }}>{s.desc}</p>
          <p className="ref">{s.citation}</p>
          {s.urls.map((u, j) => (
            <p className="ref" key={j}>
              <a href={u} target="_blank" rel="noopener noreferrer">{u}</a>
            </p>
          ))}
        </div>
      ))}

      <h3>数据来源（博主）</h3>
      {BLOGGER_SOURCES.map((s, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <p>
            <strong>{s.name}</strong>
            <span className={`source-tag ${s.reliability}`} style={{ marginLeft: 6 }}>
              {s.reliability === 'verified' ? '已核验' : s.reliability === 'partial' ? '部分核验' : '未核验'}
            </span>
            <span style={{ fontSize: 12, color: '#7b8794', marginLeft: 6 }}>[{s.status}]</span>
          </p>
          <p style={{ fontSize: 13 }}>{s.desc}</p>
          {s.urls.length > 0 && (
            <p className="ref" style={{ marginTop: 2 }}>
              来源：{s.urls.map((u, j) => <span key={j}>{j > 0 && '；'}{u}</span>)}
            </p>
          )}
          <p className="ref">{s.citation}</p>
        </div>
      ))}

      <h3>综合执行模板</h3>
      <p style={{ fontSize: 13, color: '#7b8794', marginBottom: 8 }}>
        凯圣王×陈石共同逻辑 + 通行运动营养原则的二次整理，<strong>非任何一位老师的官方课表</strong>。
      </p>
      <p><strong>增肌（建议 8-12 周周期）</strong></p>
      <p style={{ fontSize: 13 }}>{COMBINED_TEMPLATE.bulk.note}</p>
      <ul>
        <li>频率：{COMBINED_TEMPLATE.bulk.frequency}</li>
        <li>有效组：{COMBINED_TEMPLATE.bulk.effectiveSets}</li>
        <li>强度：{COMBINED_TEMPLATE.bulk.intensity}</li>
      </ul>
      <p><strong>减脂（建议 6-12 周后评估）</strong></p>
      <p style={{ fontSize: 13 }}>{COMBINED_TEMPLATE.cut.note}</p>
      <p style={{ fontSize: 13 }}>温和缺口：{COMBINED_TEMPLATE.cut.deficit}；{COMBINED_TEMPLATE.cut.protein}</p>
      <p><strong>平台期排查</strong></p>
      <p style={{ fontSize: 13 }}>{COMBINED_TEMPLATE.plateau}</p>

      <div className="disclaimer">
        ⚠️ 免责声明：{COMBINED_TEMPLATE.disclaimer} 本工具仅供参考与学习，不构成医疗或专业营养建议。
      </div>
    </div>
  )
}

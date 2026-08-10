// 导出工具：CSV / PNG / Word / PDF，零第三方依赖
// data 结构见 Step3Result 调用处

// 触发下载
function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ===== CSV =====
export function exportCSV(data) {
  const rows = []
  rows.push(['项目', '数值'])
  rows.push(['性别', data.sex])
  rows.push(['年龄', data.age + ' 岁'])
  rows.push(['身高', data.height + ' cm'])
  rows.push(['体重', data.weight + ' kg'])
  if (data.bodyFat) rows.push(['体脂率', data.bodyFat + ' %'])
  rows.push(['活动量', data.activityLabel])
  rows.push(['BMR 公式', data.formulaName])
  rows.push(['BMR', data.bmr + ' kcal'])
  rows.push(['TDEE', data.tdee + ' kcal'])
  rows.push(['饮食方法', data.methodName])
  rows.push(['目标每日热量', data.targetKcal + ' kcal'])
  rows.push(['蛋白质', data.protein + ' g'])
  rows.push(['碳水', data.carb + ' g'])
  rows.push(['脂肪', data.fat + ' g'])
  rows.push(['日期', data.date])

  // 周表
  if (data.weeklyTable && data.weeklyTable.length) {
    rows.push([])
    rows.push(['碳水循环 · 7 天表'])
    rows.push(['天', '档位', '蛋白(g)', '碳水(g)', '脂肪(g)', '热量(kcal)'])
    data.weeklyTable.forEach(d => {
      rows.push([d.day, d.level === 'high' ? '高碳' : d.level === 'mid' ? '中碳' : '低碳', d.protein, d.carb, d.fat, d.kcal])
    })
    rows.push(['周均', '', '', '', '', data.weeklyAvg])
  }

  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n')
  // BOM 防止 Excel 中文乱码
  download(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), `饮食计划_${data.date}.csv`)
}

// ===== PNG（原生 canvas 绘制） =====
export function exportPNG(data) {
  const canvas = document.createElement('canvas')
  const W = 640
  const pad = 32
  const ctx = canvas.getContext('2d')
  const font = (s, w = 'normal') => `${w} ${s}px "Microsoft YaHei","PingFang SC",sans-serif`
  const mono = (s, w = 'normal') => `${w} ${s}px "JetBrains Mono",Menlo,Consolas,monospace`

  // 先量高度
  let H = pad + 70 // 标题区
  H += 90 // 大热量区
  H += 70 // 三营养素
  if (data.weeklyTable) H += 40 + data.weeklyTable.length * 28 + 10
  H += 80 // 信息区
  H += pad

  canvas.width = W
  canvas.height = H
  // 背景
  ctx.fillStyle = '#FAF8F4'
  ctx.fillRect(0, 0, W, H)
  // 顶部墨条
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, 0, W, 6)

  let y = pad + 28
  // 标题
  ctx.fillStyle = '#8A8478'
  ctx.font = font(12, 'bold')
  ctx.fillText('健身饮食计划 · ' + data.date, pad, y - 10)
  ctx.fillStyle = '#141414'
  ctx.font = font(24, 'bold')
  ctx.fillText(data.methodName, pad, y + 18)
  y += 56

  // 大热量
  ctx.font = mono(64, 'bold')
  ctx.fillText(String(data.targetKcal), pad, y + 30)
  const kcalW = ctx.measureText(String(data.targetKcal)).width
  ctx.font = font(16)
  ctx.fillStyle = '#8A8478'
  ctx.fillText('kcal/天' + (data.isCycle ? '（周均）' : ''), pad + kcalW + 8, y + 30)
  ctx.fillStyle = '#8A8478'
  ctx.font = font(11, 'bold')
  ctx.fillText('BMR ' + data.bmr + '  ·  TDEE ' + data.tdee, pad, y + 52)
  y += 80

  // 三营养素
  const cellW = (W - pad * 2) / 3
  const macros = [
    { name: '蛋白质', g: data.protein, color: '#141414' },
    { name: '碳水', g: data.carb, color: '#A16207' },
    { name: '脂肪', g: data.fat, color: '#9A3412' },
  ]
  macros.forEach((m, i) => {
    const x = pad + i * cellW
    ctx.fillStyle = m.color
    ctx.beginPath(); ctx.arc(x + 8, y + 8, 4, 0, Math.PI * 2); ctx.fill() // 色点
    ctx.fillStyle = '#8A8478'
    ctx.font = font(11, 'bold')
    ctx.fillText(m.name, x + 18, y + 12)
    ctx.fillStyle = '#141414'
    ctx.font = mono(26, 'bold')
    ctx.fillText(m.g + 'g', x, y + 44)
  })
  y += 70

  // 周表
  if (data.weeklyTable) {
    ctx.fillStyle = '#8A8478'
    ctx.font = font(11, 'bold')
    ctx.fillText('碳水循环 · 7 天表', pad, y)
    y += 16
    const cols = [pad, pad + 60, pad + 160, pad + 260, pad + 360, pad + 460]
    ctx.strokeStyle = '#D9D4CB'
    data.weeklyTable.forEach((d) => {
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke()
      ctx.fillStyle = '#141414'
      ctx.font = font(12)
      ctx.fillText('Day' + d.day, cols[0], y + 18)
      ctx.fillStyle = d.level === 'high' ? '#141414' : d.level === 'low' ? '#9A3412' : '#8A8478'
      ctx.fillText(d.level === 'high' ? '高碳' : d.level === 'mid' ? '中碳' : '低碳', cols[1], y + 18)
      ctx.fillStyle = '#141414'
      ctx.font = mono(12)
      ctx.fillText(d.protein + 'g', cols[2], y + 18)
      ctx.fillText(d.carb + 'g', cols[3], y + 18)
      ctx.fillText(d.fat + 'g', cols[4], y + 18)
      ctx.fillText(d.kcal + '', cols[5], y + 18)
      y += 28
    })
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke()
    y += 18
  }

  // 底部信息
  ctx.fillStyle = '#8A8478'
  ctx.font = font(11)
  const info = `${data.sex} · ${data.age}岁 · ${data.height}cm · ${data.weight}kg · ${data.activityLabel} · ${data.formulaName}`
  ctx.fillText(info, pad, y)
  y += 20
  ctx.font = font(10)
  ctx.fillText('本计划仅供参考，不构成医疗或营养建议。', pad, y)

  canvas.toBlob((blob) => {
    download(blob, `饮食计划_${data.date}.png`)
  }, 'image/png')
}

// ===== Word（.doc HTML） =====
export function exportWord(data) {
  const weekly = data.weeklyTable ? `
    <h3>碳水循环 · 7 天表</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><th>天</th><th>档位</th><th>蛋白</th><th>碳水</th><th>脂肪</th><th>热量</th></tr>
      ${data.weeklyTable.map(d => `<tr><td>${d.day}</td><td>${d.level === 'high' ? '高碳' : d.level === 'mid' ? '中碳' : '低碳'}</td><td>${d.protein}g</td><td>${d.carb}g</td><td>${d.fat}g</td><td>${d.kcal}</td></tr>`).join('')}
      <tr><td colspan="5"><b>周均</b></td><td>${data.weeklyAvg} kcal/天</td></tr>
    </table>` : ''

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>饮食计划</title></head>
<body style="font-family:'Microsoft YaHei',sans-serif;color:#141414;">
<h1 style="margin-bottom:4px;">健身饮食计划</h1>
<p style="color:#888;">${data.date} · ${data.methodName}</p>
<hr>
<h2 style="font-size:48px;color:#0f766e;">${data.targetKcal} <span style="font-size:18px;color:#888;">kcal/天${data.isCycle ? '（周均）' : ''}</span></h2>
<p style="color:#888;">BMR ${data.bmr} kcal · TDEE ${data.tdee} kcal</p>
<table border="0" cellpadding="8" cellspacing="0" style="margin-top:12px;">
<tr>
<td style="background:#f0fdfa;padding:16px;text-align:center;"><b style="font-size:24px;">${data.protein}g</b><br>蛋白质</td>
<td style="background:#fffbeb;padding:16px;text-align:center;"><b style="font-size:24px;">${data.carb}g</b><br>碳水</td>
<td style="background:#fef2f2;padding:16px;text-align:center;"><b style="font-size:24px;">${data.fat}g</b><br>脂肪</td>
</tr>
</table>
${weekly}
<h3>基本信息</h3>
<p>${data.sex} · ${data.age}岁 · ${data.height}cm · ${data.weight}kg · 活动量：${data.activityLabel}<br>BMR 公式：${data.formulaName}</p>
<hr>
<p style="color:#999;font-size:12px;">本计划仅供参考，不构成医疗或营养建议。由 fitness-diet 开源工具生成。</p>
</body></html>`

  const blob = new Blob([html], { type: 'application/msword' })
  download(blob, `饮食计划_${data.date}.doc`)
}

// ===== PDF（打开打印窗口，用户选"另存为 PDF"） =====
export function exportPDF(data) {
  const weekly = data.weeklyTable ? `
    <h3>碳水循环 · 7 天表</h3>
    <table>
      <thead><tr><th>天</th><th>档位</th><th>蛋白</th><th>碳水</th><th>脂肪</th><th>热量</th></tr></thead>
      <tbody>
      ${data.weeklyTable.map(d => `<tr><td>${d.day}</td><td>${d.level === 'high' ? '高碳' : d.level === 'mid' ? '中碳' : '低碳'}</td><td>${d.protein}g</td><td>${d.carb}g</td><td>${d.fat}g</td><td>${d.kcal}</td></tr>`).join('')}
      <tr><td colspan="5"><b>周均</b></td><td>${data.weeklyAvg} kcal/天</td></tr>
      </tbody>
    </table>` : ''

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>饮食计划</title>
<style>
body{font-family:-apple-system,"Microsoft YaHei",sans-serif;color:#141414;max-width:600px;margin:24px auto;padding:0 24px;}
h1{font-size:22px;margin-bottom:2px;}
.sub{color:#888;font-size:13px;margin-top:0;}
hr{border:none;border-top:1px solid #ddd;margin:16px 0;}
.kcal{font-size:48px;color:#0f766e;font-weight:bold;}
.kcal small{font-size:16px;color:#888;font-weight:normal;}
.bmr{color:#888;font-size:12px;}
.macros{display:flex;gap:12px;margin:16px 0;}
.macros div{flex:1;padding:16px;text-align:center;border-radius:6px;}
.macros .p{background:#f0fdfa;} .macros .c{background:#fffbeb;} .macros .f{background:#fef2f2;}
.macros b{font-size:24px;display:block;}
.macros span{font-size:12px;color:#888;}
table{width:100%;border-collapse:collapse;font-size:13px;margin:12px 0;}
th,td{border:1px solid #ddd;padding:6px;text-align:center;}
th{background:#f0fdfa;color:#0f766e;}
.info{font-size:13px;}
.disc{color:#999;font-size:11px;margin-top:24px;}
@media print{body{margin:0;}}
</style></head><body>
<h1>健身饮食计划</h1>
<p class="sub">${data.date} · ${data.methodName}</p>
<hr>
<div class="kcal">${data.targetKcal} <small>kcal/天${data.isCycle ? '（周均）' : ''}</small></div>
<p class="bmr">BMR ${data.bmr} kcal · TDEE ${data.tdee} kcal</p>
<div class="macros">
<div class="p"><b>${data.protein}g</b><span>蛋白质</span></div>
<div class="c"><b>${data.carb}g</b><span>碳水</span></div>
<div class="f"><b>${data.fat}g</b><span>脂肪</span></div>
</div>
${weekly}
<h3>基本信息</h3>
<p class="info">${data.sex} · ${data.age}岁 · ${data.height}cm · ${data.weight}kg · 活动量：${data.activityLabel}<br>BMR 公式：${data.formulaName}</p>
<hr>
<p class="disc">本计划仅供参考，不构成医疗或营养建议。由 fitness-diet 开源工具生成。</p>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
</body></html>`

  const w = window.open('', '_blank')
  w.document.write(html)
  w.document.close()
}

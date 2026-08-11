import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置
// base: GitHub Pages 部署在子路径 /fitness-diet/ 下，必须设 base 否则资源 404
// 用 GITHUB_ACTIONS 环境变量判断（GitHub Actions 运行时自动设为 true），本地开发不受影响
const isGH = process.env.GITHUB_ACTIONS === 'true' || process.env.VITE_GH_PAGES === 'true'

export default defineConfig({
  plugins: [react()],
  base: isGH ? '/fitness-diet/' : '/',
})

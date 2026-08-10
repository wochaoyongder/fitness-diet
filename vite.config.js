import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置：仅启用 React 插件，代码从简
export default defineConfig({
  plugins: [react()],
})

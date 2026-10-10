import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* 单入口 · 相对 base（适配平台容器任意挂载路径） */
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
})

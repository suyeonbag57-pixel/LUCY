import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel(권장 배포)에서는 base가 '/' 면 된다.
// GitHub Pages의 프로젝트 저장소로 배포할 때만 저장소 이름을 base로 넣는다.
// 그 값은 .github/workflows/deploy.yml 에서 VITE_BASE로 전달한다.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})

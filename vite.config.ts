import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Su GitHub Pages il sito non e' servito dalla radice del dominio ma da
// /<nome-repository>/, quindi il percorso base va reso configurabile.
// In locale resta "/" e non cambia nulla; la CI imposta VITE_BASE_PATH.
// Vite pretende un base con slash iniziale e finale, mentre l'action
// configure-pages restituisce "/nome-repo" senza slash finale: normalizziamo.
function normalizeBasePath(rawBasePath: string | undefined): string {
  const trimmed = (rawBasePath ?? '').trim()

  if (trimmed === '' || trimmed === '/') {
    return '/'
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  plugins: [react(), tailwindcss()],
})

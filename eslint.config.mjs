import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  ...compat.config({
    // Use 'next' for standard rules or 'next/core-web-vitals' for stricter checks
    extends: ['next/core-web-vitals'],
  }),
]

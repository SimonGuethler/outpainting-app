import { fileURLToPath, URL } from 'node:url'
import js from '@eslint/js'
import { includeIgnoreFile } from 'eslint/config'
import vue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'

export default withVueTs(
    includeIgnoreFile(fileURLToPath(new URL('.gitignore', import.meta.url)), { gitignoreResolution: true }),
    { files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}'] },
    js.configs.recommended,
    vue.configs['flat/essential'],
    vueTsConfigs.recommended,
)

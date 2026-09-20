/* v8 ignore start */

export default {
  'src/**/*.{js,jsx,ts,tsx}': [
    'eslint',
    'prettier --write',
    'eslint --fix',
    () => 'tsc --noEmit',
  ],
}

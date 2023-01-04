module.exports = {
  'src/**/*.{js,jsx,ts,tsx,json}': [
    'eslint',
    'prettier --write',
    'eslint --fix',
    'bash -c tsc --noEmit',
  ],
}

module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'error',
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off',
  },
}

module.exports = {
    extends: [
      'eslint:recommended', 
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/stylistic',
    ],
    plugins: [
      '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
    rules: {
      
    },
    root: true,
  };
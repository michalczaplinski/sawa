module.exports = {
  use: [
    ['@neutrinojs/jest', {
      setupTestFrameworkScriptFile: '<rootDir>/config/setupJestTests.js',
      setupFiles: [
        '<rootDir>/config/shim.js'
      ]
    }],
    '@neutrinojs/react-components'
  ]
};
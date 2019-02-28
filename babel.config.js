const config = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: 'commonjs'
      }
    ]
  ]
};

module.exports = config;

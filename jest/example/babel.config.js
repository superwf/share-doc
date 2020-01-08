module.exports = {
  presets: [
    '@babel/typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '60',
        },
      },
    ],
  ],
}

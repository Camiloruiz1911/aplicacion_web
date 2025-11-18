module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // 🚀 mejor usar este con Expo
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};

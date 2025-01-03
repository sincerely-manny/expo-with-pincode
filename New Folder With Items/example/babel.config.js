module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        { alias: { 'expo-with-pincode': '../package/build' } },
      ],
      'expo-router/babel',
      '@babel/plugin-transform-runtime',
    ],
  };
};

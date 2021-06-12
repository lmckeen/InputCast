module.exports = {
  mode: 'development',
  entry: {
    'sender': './src/sender',
    'receiver': './src/receiver'
  },
  devtool: 'inline-cheap-source-map',
  output: {
    libraryTarget: 'umd'
  }
}
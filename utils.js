const STYLE_TAGS_REGEXP = /<style[^>]*>([^<]*)</g

// Taken from https://github.com/markdalgleish/static-site-generator-webpack-plugin
module.exports.findAsset = function findAsset (src, compilation, webpackStatsJson) {
  if (!src) {
    const chunkNames = Object.keys(webpackStatsJson.assetsByChunkName)

    src = chunkNames[0]
  }

  const asset = compilation.assets[src]

  if (asset) {
    return asset
  }

  const chunkValue = webpackStatsJson.assetsByChunkName[src]

  if (!chunkValue) {
    return null
  }
  // Webpack outputs an array for each chunk when using sourcemaps
  if (chunkValue instanceof Array) {
    // Is the main bundle always the first element?
    chunkValue = chunkValue[0]
  }
  return compilation.assets[chunkValue]
}

module.exports.parseCSSfromHTML = function parseCSSfromHTML (html) {
  let css = ''
  let matches
  while ((matches = STYLE_TAGS_REGEXP.exec(html)) !== null) {
    css += matches[1].trim()
  }
  return css
}

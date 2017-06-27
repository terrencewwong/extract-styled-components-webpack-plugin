const path = require('path')
const evaluate = require('eval')
const { createElement } = require('react')
const { renderToString } = require('react-dom/server')
const { ServerStyleSheet } = require('styled-components')
const RawSource = require('webpack-sources/lib/RawSource')
const { findAsset, parseCSSfromHTML } = require('./utils')

class ExtractStyledComponents {
  constructor (options) {
    const { entry } = options
    if (!entry) throw new Error('option: `entry` is required')

    this.entry = options.entry
    this.output = options.output
      || path.basename(this.entry, path.extname(this.entry)) + '.css'
  }

  apply (compiler) {
    compiler.plugin('this-compilation', compilation => {
      compilation.plugin('optimize-assets', (_, done) => {
        const webpackStats = compilation.getStats()
        const webpackStatsJson = webpackStats.toJson()
        try {
          const asset = findAsset(this.entry, compilation, webpackStatsJson)

          if (asset === null) {
            throw new Error('Source file not found: "' + this.entry + '"')
          }

          const source = asset.source()

          let render = evaluate(source, this.entry)
          if (render.default) render = render.default

          const sheet = new ServerStyleSheet()

          // server-side render our component and collect the styles
          renderToString(sheet.collectStyles(render()))

          const css = parseCSSfromHTML(sheet.getStyleTags())

          compilation.assets[this.output] = new RawSource(css)
        } catch (e) {
          compilation.errors.push(e.stack);
          done()
        }

        done()
      })
    })
  }
}

module.exports = ExtractStyledComponents

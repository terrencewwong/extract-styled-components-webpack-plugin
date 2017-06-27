const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractStyledComponents = require('../')
describe('extract-styled-components-webpack-plugin', () => {
  it('can run in webpack', () => {
    const outputFile = 'a-styled-component.css'
    const expectedOutputFile = path.join(__dirname, 'expected-output', outputFile)
    const expectedOutput = fs.readFileSync(expectedOutputFile, 'utf8')

    const config = {
      entry: __dirname + '/input/a-styled-component.js',
      output: {
        filename: 'a-styled-component.js',
        path: __dirname + '/output',
        libraryTarget: 'umd'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [ 'es2015', 'react' ]
              }
            }
          }
        ]
      },
      plugins: [
        new ExtractStyledComponents({
          entry: 'a-styled-component.js',
          output: outputFile
        })
      ]
    }

    // I couldn't figure out how to make the test work without using promises...
    // jest--
    const promise = new Promise((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) return done(err)
        const got = stats.compilation.assets[outputFile]._value

        try {
          expect(got).toBe(expectedOutput)
        } catch (e) {
          reject(e)
        }
        resolve()
      })
    })

    return promise
  })
})

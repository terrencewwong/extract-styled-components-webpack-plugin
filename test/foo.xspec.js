describe('foo', () => {
  it('async', () => {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('hello!')
        try {
          expect(true).toBe(false)
        } catch (e) {
          reject(e)
        }
        resolve('done')
      }, 100)
    })

    return expect(p).resolves.toBe('done')
  })
})

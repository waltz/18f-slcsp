import ReadZips from '../lib/read_zips.js'

describe('ReadZips', () => {
  const zipReader = new ReadZips('./spec/fixtures/fake_zips.csv')

  describe('parse', () => {
    it('makes a hash of the zips with their rate area', done => {
      zipReader.parse().then(zips => {
        expect(zips).toEqual({'12345': '5'})
        done()
      })
    })
  })
})

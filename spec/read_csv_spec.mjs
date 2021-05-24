import ReadCSV from '../lib/read_csv.js'

describe('ReadCSV', () => {
  const readCSV = new ReadCSV('./spec/fixtures/plain.csv')

  describe('parse', () => {
    it('parses a csv', done => {
      readCSV.parse().then(contents => {
        expect(contents).toEqual([{ 'things': 'are pleasant', 'burrito': 'steak' }])
        done()
      })
    })
  })
})

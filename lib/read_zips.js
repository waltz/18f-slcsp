import ReadCSV from './read_csv.js'

export default class ReadZips extends ReadCSV {
  constructor(path) {
    super(path)
    this._data = {}
  }

  handleData({ zipcode, rate_area }) {
    this._data[zipcode] = rate_area
  }
}

import ReadCSV from './read_csv.js'

export default class ReadPlans extends ReadCSV {
  constructor(path) {
    super(path)
    this._data = {}
  }

  handleData(row) {
    const { metal_level, rate_area } = row

    // We only care about Silver plans.
    if (metal_level !== 'Silver') {
      return
    }

    if (this._data[rate_area] === undefined) {
      this._data[rate_area] = []
    }

    row.rate = this.normalizeRate(row.rate)

    this._data[rate_area].push(row)
  }

  // Takes in a plan rate as a string and returns a Number that
  // is the plan rate in cents. This makes comparison easier.
  // 
  // NB: This truncates fractional cents. They don't exist.
  normalizeRate(rate) {
    const origRate = rate
    const decimalLocation = rate.indexOf('.')
    
    // Gas stations are wrong, fractional cents don't exist.
    // Half-serious, half-kidding. I think this is a good topic
    // to talk about.
    if (decimalLocation >= 0) {
      rate = rate.slice(0, decimalLocation + 3)
    }

    if (rate.match(/.*\.\d$/)) {
      rate = rate + '0'
    }

    if (rate.indexOf('.') === -1) {
      rate = rate + '00'
    }

    rate = rate.replace('.', '')

    return parseInt(rate)
  } 
}

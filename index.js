import csv from 'csv-parser'
import fs from 'fs'

class ReadCSV {
  constructor(path) {
    this.path = path
    this._data = []
  }

  data() {
    return this._data
  }

  get stream() {
    return fs.createReadStream(this.path)
  }

  async parse() {
    return new Promise((resolve, reject) => {
      this.stream
        .pipe(csv())
        .on('data', this.handleData.bind(this))
        .on('end', () => {
          resolve(this._data)
        })
    });
  }

  handleData(row) {
    this._data.push(row)
  }
}

class ReadZips extends ReadCSV {
  constructor(path) {
    super(path)
    this._data = {}
  }

  handleData({ zipcode, rate_area }) {
    this._data[zipcode] = rate_area
  }
}

class ReadPlans extends ReadCSV {
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

class SLCSP {
  constructor() {
    this.readCSVs()
      .then(() => this.findRates())
      .then(rates => this.writeCSV(rates))
  }

  async readCSVs() {
    const plans = new ReadPlans('plans.csv')
    this.plans = await plans.parse()

    const zips = new ReadZips('zips.csv')
    this.zips = await zips.parse()

    const slcsp = new ReadCSV('slcsp.csv')
    this.slcsp = await slcsp.parse()
  }

  findRates() {
    return this.slcsp.map(slcsp => {
      const { zipcode } = slcsp

      const rate_area = this.zips[zipcode]
      const currentPlans = this.plans[rate_area]
      currentPlans.sort(this.orderPlans)

      // If there are less than two plans, then there can't be a 'second'
      // lowest cost plan.
      if (currentPlans.length < 2) {
        return slcsp
      }

      slcsp.rate = this.formatCentsAsDollars(currentPlans[1].rate)

      return slcsp
    })
  }
  
  writeCSV(rates) {
    let output = 'zipcode,rate\n'

    output += rates.map(({ zipcode, rate }) => `${zipcode},${rate}`).join('\n')

    console.log(output)
  }

  comparePlans(first, second) {
    if (first.rate > second.rate) {
      return 1
    }

    if (first.rate < second.rate) {
      return -1
    }
    
    return 0
  }

  formatCentsAsDollars(numericCents) {
    const formatted = numericCents.toString()
    const dollars = formatted.slice(0, formatted.length - 2)
    const cents = formatted.slice(formatted.length - 2, formatted.length)

    return dollars + '.' + cents
  }
}

new SLCSP()

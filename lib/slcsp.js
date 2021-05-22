import ReadPlans from './read_plans.js'
import ReadZips from './read_zips.js'
import ReadCSV from './read_csv.js'

export default class SLCSP {
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

      // The AdHoc project prompt seems to ask for the _third_ lowest cost
      // plan. I'm not completely sure what's going on, so I'd like to talk
      // to folks about it.
      //
      // Right now, this grabs the _second_ element in the list. The `sort`
      // function puts these in ascending order by plan rate. That gives
      // us the _second_ cheapest as the _second_ element.
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

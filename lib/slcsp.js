import ReadPlans from './read_plans.js'
import ReadZips from './read_zips.js'
import ReadCSV from './read_csv.js'

export default class SLCSP {
  kickoff() {
    this.readCSVs()
      .then(requests => this.findRates(requests))
      .then(rates =>this.formatCSV(rates))
      .then(console.log)
  }

  async readCSVs() {
    const plans = await(new ReadPlans('plans.csv').parse())
    const zips = await(new ReadZips('zips.csv').parse())
    const requests = await(new ReadCSV('slcsp.csv').parse())

    return { plans, zips, requests }
  }

  findRates({ plans, zips, requests }) {
    return requests.map(request => {
      const rate_area = zips[request.zipcode]

      if (rate_area === undefined) {
        throw `Unable to find rate area for zip code ${requests.zipcode}`
      }

      const currentPlans = plans[rate_area]

      if (currentPlans === undefined) {
        throw `Unable to find plans for and rate area ${rate_area}`
      }

      currentPlans.sort(this.comparePlans)

      // If there are less than two plans, then there can't be a 'second'
      // lowest cost plan.
      if (currentPlans.length < 2) {
        return request 
      }

      // The AdHoc project prompt seems to ask for the _third_ lowest cost
      // plan. I'm not completely sure what's going on, so I'd like to talk
      // to folks about it.
      //
      // Right now, this grabs the _second_ element in the list. The `sort`
      // function puts these in ascending order by plan rate. That gives
      // us the _second_ cheapest as the _second_ element.
      const formattedRate = this.formatCentsAsDollars(currentPlans[1].rate)

      return { zipcode: request.zipcode, rate: formattedRate }
    })
  }
  
  formatCSV(rates) {
    let output = 'zipcode,rate\n'

    output += rates.map(({ zipcode, rate }) => `${zipcode},${rate}`).join('\n')

    return output
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

import ReadPlans from '../lib/read_plans.js'

describe('ReadPlans', () => {
  const readPlans = new ReadPlans('./spec/fixtures/fake_plans.csv')

  describe('parse', () => {
    const fakePlan = { plan_id: 'very-fake-plan-id', state: 'HI', metal_level: 'Silver', rate: 222233, rate_area: '7' }

    it('pulls out the plans grouped by rate area', done => {
      readPlans.parse().then(plans => {
        expect(plans).toEqual({ '7': [fakePlan] })
        done()
      })
    })
  })
})

import SLCSP from '../lib/slcsp.js'

describe('SLCSP', () => {
  var slcsp = new SLCSP()

  describe('formatCSV', () => {
    const cheap = { zipcode: 20001, rate: 5 }

    it('makes a bitty csv', () => {
      expect(slcsp.formatCSV([cheap])).toEqual("zipcode,rate\n20001,5")
    })

    it('handles multiple rows', () => {
      const pricey = { zipcode: 20002, rate: 55 }

      expect(slcsp.formatCSV([cheap, pricey ])).toEqual("zipcode,rate\n20001,5\n20002,55")
    })
  })

  describe('comparePlans', () => {
    let first = { rate: 1 }
    let second = { rate: 2 }

    it('compares plans', () => {
      expect(slcsp.comparePlans(first, second)).toEqual(-1)
    })

    it('respects the plan order', () => {
      expect(slcsp.comparePlans(second, first)).toEqual(1)
    })

    it('knows the the plans cost the same', () => {
      let third = { rate: 1 }

      expect(slcsp.comparePlans(first, third)).toEqual(0)
    })
  })

  describe('formatCentsAsDollars', () => {
    it('makes a dollar out of some sense', () => {
      expect(slcsp.formatCentsAsDollars(100)).toEqual('1.00')
    })

    it('adds the descimal at the right spot', () => {
      expect(slcsp.formatCentsAsDollars(6899994)).toEqual('68999.94')
    })
  })
})

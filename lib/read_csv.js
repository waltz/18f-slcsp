import csv from 'csv-parser'
import fs from 'fs'

export default class ReadCSV {
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

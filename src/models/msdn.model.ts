import axios from 'axios'

import TimeAgo = require('javascript-time-ago')
import en = require('javascript-time-ago/locale/en')
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

import Source from '../interfaces/source.interface'

import LogHelper from '../helpers/log.helper'
import CommonHelper from '../helpers/common.helper'

export default class MSDNModel implements Source {
  logHelper: LogHelper
  commonHelper: CommonHelper

  constructor(query: string) {
    this.title = `🔎 Search MSDN: ${query}`
    this.url = 'https://docs.microsoft.com'

    this.logHelper = new LogHelper()
    this.commonHelper = new CommonHelper()
  }
  title: string
  url: string

  async find(search: string): Promise<Source[]> {
    const url = `https://docs.microsoft.com/api/search?search=${search}&locale=en-us&top=10`
    this.logHelper.log(url)

    const response = await axios.get(url)

    let index = 0
    const sources: Source[] = []

    response.data.results.map((result: any) => {
      const formattedDate = timeAgo.format(result.lastUpdatedDate)
      index++

      let title = this.commonHelper.checkOrEmpty(result.title)
      let description = this.commonHelper.checkOrEmpty(result.description)
      let count = result.descriptions ? result.descriptions.length : ''

      sources.push({
        title: `${index}:📚 ${count} 😃 📅 ${formattedDate} ➡ ${title} ➡ ${description}`,
        url: result.url,
        updated: result.lastUpdatedDate,
        description: result.description,
        logHelper: this.logHelper,
        commonHelper: this.commonHelper
      })
    })
    return sources
  }
}

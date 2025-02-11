import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class MartinusEanProvider extends BaseEanProvider {
  readonly domain = 'martinus.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('section#details dt')
    .filter((_, el) => $(el).text().trim().toLowerCase() === 'isbn')
    .next('dd').text().trim()
  
    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

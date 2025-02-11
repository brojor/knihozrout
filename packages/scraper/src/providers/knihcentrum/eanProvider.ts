import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class KnihcentrumEanProvider extends BaseEanProvider {
  readonly domain = 'knihcentrum.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('.data-table td')
    .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
    .next('td').text().trim()
  
    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class AlbatrosmediaEanProvider extends BaseEanProvider {
  readonly domain = 'albatrosmedia.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('.product__infos span')
    .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
    .next('span').text().trim()
  
    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

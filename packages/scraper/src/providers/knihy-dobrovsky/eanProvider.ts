import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class KnihyDobrovskyEanProvider extends BaseEanProvider {
  readonly domain = 'knihydobrovsky.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('.box-book-info dt')
    .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean')
    .next('dd').text().trim()
  
    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

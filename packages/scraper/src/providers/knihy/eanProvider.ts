import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class KnihyEanProvider extends BaseEanProvider {
  readonly domain = 'knihy.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('.box-detail__info__params dt')
    .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean:')
    .next('dd').text().trim()
  
    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

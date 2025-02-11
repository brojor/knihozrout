import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class DobreKnihyEanProvider extends BaseEanProvider {
  readonly domain = 'dobre-knihy.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('#product_box_2 th')
      .filter((_, el) => $(el).text().trim().toLowerCase() === 'ean:')
      .next('td').text().trim()

    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

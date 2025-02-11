import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class MegaknihyEanProvider extends BaseEanProvider {
  readonly domain = 'megaknihy.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('script[type="application/ld+json"]').html()
    if (!eanText) {
      return undefined
    }

    const jsonData = JSON.parse(eanText)
    const ean = parseInt(jsonData.gtin)
    return isNaN(ean) ? undefined : ean
  }
}

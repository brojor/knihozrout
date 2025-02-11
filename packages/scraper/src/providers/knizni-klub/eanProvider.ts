import * as cheerio from 'cheerio'
import { BaseEanProvider } from '../baseEanProvider.js'

export class KnizniKlubEanProvider extends BaseEanProvider {
  readonly domain = 'knizniklub.cz'

  protected extractEan($: cheerio.CheerioAPI): number | undefined {
    const eanText = $('#specification-content p:has(strong:contains("EAN:"))').text().replace("EAN:", "").trim();

    const ean = parseInt(eanText)
    return isNaN(ean) ? undefined : ean
  }
}

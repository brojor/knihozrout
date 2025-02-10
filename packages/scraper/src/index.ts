import { PartialScrapedBook, ScrapedBook } from './types/book.js'
import { KnihyDobrovskyProvider } from './providers/knihy_dobrovsky.js'
import { KnizniKlubProvider } from './providers/knizni_klub.js'
import { BaseProvider } from './providers/base_provider.js'
import { BookValidator } from './validators/book.validator.js'
import { AlbatrosmediaProvider } from './providers/albatrosmedia_provider.js'
import { MegaknihyProvider } from './providers/megaknihy_provider.js'
import { MartinusProvider } from './providers/martinus_provider.js'
import { KnihyProvider } from './providers/knihy_provider.js'
import { DobreKnihyProvider } from './providers/dobre-knihy.cz_provider.js'
import { KnihyCentrumProvider } from './providers/knihcentrum_provider.js'
import { ScrapingError } from './errors/scraping_error.js'

export class BookScraper {
  private readonly providers: BaseProvider[] = [
    new KnihyDobrovskyProvider(),
    new KnizniKlubProvider(),
    new MartinusProvider(),
    new AlbatrosmediaProvider(),
    new MegaknihyProvider(),
    new KnihyProvider(),
    new DobreKnihyProvider(),
    new KnihyCentrumProvider(),
  ]

  constructor(
    private readonly googleApiKey: string,
    private readonly googleSearchEngineId: string,
  ) { }

  async scrapeBookDetails(ean: number): Promise<ScrapedBook> {
    const urls = await this.searchUrls(ean)
    if (urls.length === 0) throw new ScrapingError(`Google Custom Search API nevrátilo pro EAN: ${ean} žádné výsledky!`)

    return await this.scrapeFromUrls(urls, ean)

  }

  private async searchUrls(ean: number): Promise<string[]> {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleSearchEngineId}&q=${ean}`
    )

    if (!response.ok) throw new Error(`Google Custom Search API vrátilo chybu: ${response.status}: ${response.statusText}`)

    const data = await response.json()
    if (!data.items) return []

    return data.items
      .map((item: any) => {
        try {
          const url = new URL(item.link)
          return url.toString()
        } catch {
          return null
        }
      })
      .filter((url: string | null): url is string => url !== null)
  }

  private async scrapeFromUrls(urls: string[], ean: number): Promise<ScrapedBook> {
    let mergedBook: PartialScrapedBook = {}

    for (const url of urls) {
      const domain = new URL(url).hostname.replace('www.', '')
      const provider = this.providers.find(p => p.domain === domain)
      if (!provider) continue

      const bookData = await provider.scrapeBookDetails(url, ean)

      mergedBook = { ...bookData, ...mergedBook }

      if (BookValidator.isComplete(mergedBook)) break
    }

    if (!BookValidator.isValid(mergedBook)) {
      throw new ScrapingError(`Nepodařilo se získat všechna povinná data o knize s EAN: ${ean}`)
    }

    return mergedBook
  }
}

export default BookScraper

export { ScrapingError } from './errors/scraping_error.js' 
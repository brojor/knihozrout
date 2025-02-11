import { PartialScrapedBook, ScrapedBook } from './types/book.js'
import { DetailsProviderError, EanProviderError, ScraperError } from './errors/scraperError.js'
import { BookValidator } from './validators/book.validator.js'
import { BaseDetailsProvider } from './providers/baseDetailsProvider.js'
import { BaseEanProvider } from './providers/baseEanProvider.js'
import { AlbatrosmediaDetailsProvider, AlbatrosmediaEanProvider } from './providers/albatrosmedia/index.js'
import { MegaknihyDetailsProvider, MegaknihyEanProvider } from './providers/megaknihy/index.js'
import { MartinusDetailsProvider, MartinusEanProvider } from './providers/martinus/index.js'
import { KnizniKlubDetailsProvider, KnizniKlubEanProvider } from './providers/knizni-klub/index.js'
import { KnihyDobrovskyDetailsProvider, KnihyDobrovskyEanProvider } from './providers/knihy-dobrovsky/index.js'
import { KnihyDetailsProvider, KnihyEanProvider } from './providers/knihy/index.js'
import { DobreKnihyDetailsProvider, DobreKnihyEanProvider } from './providers/dobre-knihy/index.js'
import { KnihcentrumDetailsProvider, KnihcentrumEanProvider } from './providers/knihcentrum/index.js'

export class BookScraper {
  private readonly detailsProviders: BaseDetailsProvider[]
  private readonly eanProviders: BaseEanProvider[]

  constructor(
    private readonly googleApiKey: string,
    private readonly googleSearchEngineId: string,
  ) { 
    this.detailsProviders = [
      new KnihyDobrovskyDetailsProvider(),
      new KnizniKlubDetailsProvider(),
      new MartinusDetailsProvider(),
      new AlbatrosmediaDetailsProvider(),
      new MegaknihyDetailsProvider(),
      new KnihyDetailsProvider(),
      new DobreKnihyDetailsProvider(),
      new KnihcentrumDetailsProvider(),
    ]

    this.eanProviders = [
      new KnihyDobrovskyEanProvider(),
      new KnizniKlubEanProvider(),
      new MartinusEanProvider(),
      new AlbatrosmediaEanProvider(),
      new MegaknihyEanProvider(),
      new KnihyEanProvider(),
      new DobreKnihyEanProvider(),
      new KnihcentrumEanProvider(),
    ]
  }

  async scrapeBookDetails(ean: number): Promise<ScrapedBook> {
    const urls = await this.searchUrls(ean)
    if (urls.length === 0) throw new DetailsProviderError(`Google Custom Search API nevrátilo pro EAN: ${ean} žádné výsledky!`)

    return await this.scrapeFromUrls(urls, ean)

  }

  async getEanFromUrl(url: string): Promise<number> {
    const provider = this.eanProviders.find(p => p.canHandle(url))
    if (!provider) {
      throw new EanProviderError(`Nenalezen provider pro URL: ${url}`)
    }

    return await provider.getEanFromUrl(url)
  }

  private async searchUrls(ean: number): Promise<string[]> {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleSearchEngineId}&q=${ean}`
    )

    if (!response.ok) throw new DetailsProviderError(`Google Custom Search API vrátilo chybu: ${response.status}: ${response.statusText}`)

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
      const provider = this.detailsProviders.find(p => p.domain === domain)
      if (!provider) continue

      const bookData = await provider.scrapeBookDetails(url, ean)

      mergedBook = {
        ...mergedBook,
        ...Object.fromEntries(
          Object.entries(bookData).filter(([_, value]) => value !== undefined)
        ),
      }

      if (BookValidator.isComplete(mergedBook)) break
    }

    if (!BookValidator.isValid(mergedBook)) {
      throw new DetailsProviderError(`Nepodařilo se získat všechna povinná data o knize s EAN: ${ean}`)
    }

    return mergedBook
  }
}

export default BookScraper

export { EanProviderError, DetailsProviderError, ScraperError } from './errors/scraperError.js' 